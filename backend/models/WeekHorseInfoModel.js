const mongoose = require('mongoose');
const HorsesImageModel = require('./HorsesImageModel');

const schema = new mongoose.Schema({
  week: { type: mongoose.Schema.Types.ObjectId, ref: 'Weeks' },
  horseNumber: { type: String },
  horseName: { type: String },
  riderName: { type: String }, // Not needed for now but for the future reference.
  hasImages: {
    type: Boolean,
    default: false,
  }
});
schema.index({ week: 1, horseNumber: 1 }, { unique: true });
schema.index({ horseName: 1 }, { collation: {
    locale: 'en',
    strength: 1,
} })

// Instance method
schema.methods.updateHasImageInfo = async function () {
   try {
        const imageCount = await HorsesImageModel.countDocuments({
            horseInfo: this._id,
            isDeleted: 0,
        })
        console.log(this._id, imageCount);
        if (imageCount > 0) {
            console.log('marked as tru -------------------------');
            this.hasImages = true;
        } else {
            this.hasImages = false;
        }
        await this.save();
    } catch (error) {
        console.log(error);
    }
};

module.exports = mongoose.model('WeekHorseInfo', schema);
