const Match = require('../models/Match');
const Team = require('../models/Team');
const Player = require('../models/Player');

exports.getTeamStandings = async (req, res) => {
  try {
    const teams = await Team.find({ group: { $ne: null } });
    const matches = await Match.find({ group: { $ne: null } }).populate('teamA teamB');

    const standings = {};

    // Inizializza tutte le squadre nei loro gironi
    for (const team of teams) {
      if (!standings[team.group]) standings[team.group] = {};
      standings[team.group][team._id.toString()] = {
        team,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      };
    }

    // Calcola le statistiche solo per partite giocate
    for (const match of matches) {
      const { teamA, teamB, goalsTeamA, goalsTeamB, group } = match;

      if (goalsTeamA === null || goalsTeamB === null) continue;

      const teamAStats = standings[group][teamA._id.toString()];
      const teamBStats = standings[group][teamB._id.toString()];

      // Aggiorna gol
      teamAStats.goalsFor += goalsTeamA;
      teamAStats.goalsAgainst += goalsTeamB;
      teamBStats.goalsFor += goalsTeamB;
      teamBStats.goalsAgainst += goalsTeamA;

      // Aggiorna punti
      if (goalsTeamA > goalsTeamB) {
        teamAStats.points += 3;
        teamAStats.wins += 1;
        teamBStats.losses += 1;
      } else if (goalsTeamA < goalsTeamB) {
        teamBStats.points += 3;
        teamBStats.wins += 1;
        teamAStats.losses += 1;
      } else {
        teamAStats.points += 1;
        teamBStats.points += 1;
        teamAStats.draws += 1;
        teamBStats.draws += 1;
      }
    }

    // Converte standings in array ordinati
    const result = {};
    for (const group in standings) {
      result[group] = Object.values(standings[group]).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const diffA = a.goalsFor - a.goalsAgainst;
        const diffB = b.goalsFor - b.goalsAgainst;
        return diffB - diffA;
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel calcolo della classifica squadre' });
  }
};

exports.getTopScorers = async (req, res) => {
    try {
        const players = await Player.find()
            .populate('team')
            .sort({ goals: -1 });

        res.json(players);
    } catch (err) {
        res.status(500).json({ error: 'Errore nel recupero marcatori' });
    }
};