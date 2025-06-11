const Team = require("../models/Team");

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("players");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero delle squadre" });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const { name, gender, group } = req.body;
    const newTeam = new Team({ name, gender, group });
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (err) {
    console.error("Errore creazione team:", err);
    res.status(400).json({ error: "Errore nella creazione della squadra" });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const updated = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Errore nell'aggiornamento della squadra" });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Squadra eliminata" });
  } catch (err) {
    res.status(500).json({ error: "Errore nell'eliminazione della squadra" });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("players");
    if (!team) {
      return res.status(404).json({ error: "Squadra non trovata" });
    }
    res.json(team);
  } catch (err) {
    res.status(400).json({ error: "Errore nel recupero della squadra" });
  }
};
