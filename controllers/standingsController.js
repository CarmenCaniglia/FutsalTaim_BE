const Match = require('../models/Match');
const Team = require('../models/Team');

exports.getStandings = async (req, res) => {
  try {
    const genderFilter = req.query.gender;
    
    // Trova tutte le squadre (filtra per gender se richiesto)
    const teamQuery = genderFilter ? { gender: genderFilter } : {};
    const teams = await Team.find(teamQuery);

    // Inizializza standings per ogni gruppo
    const standingsMap = {};

    for (const team of teams) {
      const key = `${team.gender}-${team.group}`;
      if (!standingsMap[key]) standingsMap[key] = [];
      // Evita duplicati
      if (!standingsMap[key].some(t => t.team._id.equals(team._id))) {
        standingsMap[key].push({
          team,
          played: 0, won: 0, draw: 0, lost: 0,
          gf: 0, ga: 0, gd: 0, points: 0,
        });
      }
    }

    // Prendi solo partite valide (giocate) nei gironi
    const matches = await Match.find({
      goalsTeamA: { $ne: null },
      goalsTeamB: { $ne: null },
      stage: 'girone'
    }).populate('teamA teamB');

    for (const match of matches) {
      const { teamA, teamB, goalsTeamA, goalsTeamB } = match;
      const gender = teamA.gender;
      const group = teamA.group;

      if (genderFilter && gender !== genderFilter) continue;

      const key = `${gender}-${group}`;
      const statsA = standingsMap[key].find(t => t.team._id.equals(teamA._id));
      const statsB = standingsMap[key].find(t => t.team._id.equals(teamB._id));

      if (!statsA || !statsB) continue;

      statsA.played += 1;
      statsB.played += 1;

      statsA.gf += goalsTeamA;
      statsA.ga += goalsTeamB;
      statsB.gf += goalsTeamB;
      statsB.ga += goalsTeamA;

      if (goalsTeamA > goalsTeamB) {
        statsA.won++; statsA.points += 3;
        statsB.lost++;
      } else if (goalsTeamA < goalsTeamB) {
        statsB.won++; statsB.points += 3;
        statsA.lost++;
      } else {
        statsA.draw++; statsB.draw++;
        statsA.points += 1;
        statsB.points += 1;
      }
    }

    // Prepara risposta
    const result = Object.entries(standingsMap).map(([key, teams]) => {
      const [gender, group] = key.split('-');
      return {
        gender,
        group,
        standings: teams.map(t => ({
          ...t,
          gd: t.gf - t.ga,
        })).sort((a, b) =>
          b.points - a.points ||
          b.gd - a.gd ||
          b.gf - a.gf
        )
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel calcolo delle classifiche' });
  }
};
