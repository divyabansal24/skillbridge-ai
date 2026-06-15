const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  skills: {
    type: [String],
    default: []
  },

  rating: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Mentor', mentorSchema);