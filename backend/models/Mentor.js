const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  company: {
    type: String,
    default: ""
  },
  experience: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    default: ""
  },
  skills: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    default: 0
  },
  linkedin: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model('Mentor', mentorSchema);