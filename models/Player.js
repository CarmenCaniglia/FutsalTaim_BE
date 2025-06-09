// models/Player.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: Number, required: false }, // oppure semplicemente `number: Number`
    goals: { type: Number, default: 0 },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    
});

module.exports = mongoose.model('Player', playerSchema);
