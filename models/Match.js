const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  goalsTeamA: { type: Number, default: null },
  goalsTeamB: { type: Number, default: null },
  group: { type: String, default: null },
  stage: {
    type: String,
    enum: ['girone', 'semifinale', 'finale'],
    default: 'girone'
  },
  gender: {
    type: String,
    enum: ['maschile', 'femminile'],
    required: true
  },
  date: Date,
  goalScorers: {
  type: [
    {
      player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
      goals: { type: Number, required: true, min: 0, default: 0 }

    }
  ],
  default: []  // << Aggiungi questo
}
});


module.exports = mongoose.model('Match', matchSchema);
