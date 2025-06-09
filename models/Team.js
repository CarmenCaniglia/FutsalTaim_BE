const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, enum: ['maschile', 'femminile'], required: true },
    group: { type: String }, // es: A, B, C
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
});

module.exports = mongoose.model('Team', teamSchema);
