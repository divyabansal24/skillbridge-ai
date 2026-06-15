const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); // your existing JWT middleware

// GET /api/user/profile — get logged-in user's data
router.get('/profile', auth, async (req, res) => {
  try {
    // req.user.id comes from your JWT middleware
    const user = await User.findById(req.user.id).select('-password');
    // .select('-password') means: return everything EXCEPT the password
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/user/skills — update skills array
router.put('/skills', auth, async (req, res) => {
  try {
    const { skills } = req.body; // expect: { skills: ["React", "Python"] }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { skills },              // update the skills field
      { new: true }           // return the UPDATED document
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;