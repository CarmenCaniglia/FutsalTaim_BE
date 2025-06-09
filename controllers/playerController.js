const Player = require('../models/Player');

exports.getAllPlayers = async (req, res) => {
    try {
        const players = await Player.find().populate('team');
        res.json(players);
    } catch (err) {
        res.status(500).json({ error: 'Errore nel recupero giocatori' });
    }
};

exports.createPlayer = async (req, res) => {
    try {
        const { name, number, team  } = req.body;
        const newPlayer = new Player({ name, number, team  });
        await newPlayer.save();
        res.status(201).json(newPlayer);
    } catch (err) {
        res.status(400).json({ error: 'Errore nella creazione del giocatore' });
    }
};

exports.updatePlayer = async (req, res) => {
    try {
        const updated = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Errore nell\'aggiornamento del giocatore' });
    }
};

exports.deletePlayer = async (req, res) => {
    try {
        await Player.findByIdAndDelete(req.params.id);
        res.json({ message: 'Giocatore eliminato' });
    } catch (err) {
        res.status(500).json({ error: 'Errore nell\'eliminazione del giocatore' });
    }
};

exports.getTopScorers = async (req, res) => {
  try {
    const gender = req.query.gender;

    const players = await Player.find()
      .populate({
        path: 'team',
        match: gender ? { gender } : {}, // Filtra i team per genere
      })
      .sort({ goals: -1 });

    // Rimuove i giocatori senza team (cioè team !== match del gender)
    const filtered = players.filter(p => p.team !== null);

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel recupero dei marcatori' });
  }
};
