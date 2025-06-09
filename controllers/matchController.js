const Match = require('../models/Match');
const Player = require('../models/Player');

exports.getAllMatches = async (req, res) => {
  try {
    const filter = {};
    if (req.query.gender) {
      filter.gender = req.query.gender;
    }

    const matches = await Match.find(filter).populate('teamA teamB goalScorers.player');

    res.json(matches);
  } catch (err) {
    console.error("Errore in getAllMatches:", err);
    res.status(500).json({ error: 'Errore nel recupero partite' });
  }
};

exports.createMatch = async (req, res) => {
  try {
    const { date, gender, group, teamA, teamB, stage } = req.body;

    const newMatch = new Match({
      date,
      gender,
      group: stage === 'girone' ? group : null,
      stage: stage || 'girone',
      teamA,
      teamB,
      goalsTeamA: null,
      goalsTeamB: null,
      goalScorers: []
    });

    await newMatch.save();
    res.status(201).json(newMatch);
  } catch (err) {
    console.error("Errore nella creazione della partita:", err);
    res.status(400).json({ error: 'Errore nella creazione della partita' });
  }
};

exports.updateMatch = async (req, res) => {
  try {
    const { goalsTeamA, goalsTeamB, goalScorers, teamA, teamB, group, gender } = req.body;
    const match = await Match.findById(req.params.id);

    if (!match) return res.status(404).json({ error: 'Partita non trovata' });

    // Annulla i vecchi gol (se presenti)
    if (Array.isArray(match.goalScorers)) {
      for (const scorer of match.goalScorers) {
        await Player.findByIdAndUpdate(scorer.player, { $inc: { goals: -scorer.goals } });
      }
    }

    // Aggiungi i nuovi gol (se presenti)
    if (Array.isArray(goalScorers)) {
      for (const scorer of goalScorers) {
        await Player.findByIdAndUpdate(scorer.player, { $inc: { goals: scorer.goals } });
      }
    }

    // Aggiorna match
    Object.assign(match, {
      goalsTeamA,
      goalsTeamB,
      goalScorers: Array.isArray(goalScorers) ? goalScorers : [],
      teamA,
      teamB,
      group,
      gender,
    });

    await match.save();

    res.json(match);
  } catch (err) {
    console.error("Errore nell'aggiornamento della partita:", err);
    res.status(400).json({ error: "Errore nell'aggiornamento della partita" });
  }
};

exports.deleteMatch = async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: 'Partita eliminata' });
  } catch (err) {
    console.error("Errore nell'eliminazione della partita:", err);
    res.status(500).json({ error: 'Errore nell\'eliminazione della partita' });
  }
};

exports.createKnockoutMatch = async (req, res) => {
  try {
    const { teamA, teamB, stage, gender, date } = req.body;

    if (!['semifinale', 'finale'].includes(stage)) {
      return res.status(400).json({ error: 'Stage non valido' });
    }

    const newMatch = new Match({
      teamA,
      teamB,
      stage,
      gender,
      date,
      goalsTeamA: null,
      goalsTeamB: null,
      goalScorers: [],
    });

    await newMatch.save();
    res.status(201).json(newMatch);
  } catch (err) {
    console.error("Errore nella creazione del match a eliminazione diretta:", err.message);
    res.status(500).json({ error: 'Errore nella creazione del match a eliminazione diretta' });
  }
};
