const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  week: { type: mongoose.Schema.Types.ObjectId, ref: 'Weeks' },
  horseNumber: { type: String },
  horseName: { type: String },
  riderName: { type: String }, // Not needed for now but for the future reference.
});
schema.index({ week: 1, horseNumber: 1 }, { unique: true });

module.exports = mongoose.model('WeekHorseInfo', schema);
