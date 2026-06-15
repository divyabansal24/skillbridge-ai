const express = require('express');
const router = express.Router();

const Mentor = require('../models/Mentor');
const User = require('../models/User');

// ==========================================
// GET RECOMMENDED MENTORS
// ==========================================

router.get('/recommended/:email', async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const userSkills = (user.skills || []).map(skill =>
      skill.toLowerCase()
    );

    const mentors = await Mentor.find({});

    const recommendedMentors = mentors.filter(mentor =>
      mentor.skills.some(skill =>
        !userSkills.includes(skill.toLowerCase())
      )
    );

    recommendedMentors.sort((a, b) =>
      b.rating - a.rating
    );

    res.json(recommendedMentors.slice(0, 5));
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Server error'
    });
  }
});

// ==========================================
// GET ALL MENTORS
// ==========================================

router.get('/all', async (req, res) => {
  try {
    const mentors = await Mentor.find({})
      .sort({ rating: -1 });

    res.json(mentors);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Server error'
    });
  }
});

module.exports = router;