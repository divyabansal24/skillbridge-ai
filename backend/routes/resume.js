const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const User = require('../models/User');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    // Accept PDF and DOCX files
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'), false);
    }
  }
});

// Predefined search keywords
const SKILLS_LIST = [
  'React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Redux',
  'Node.js', 'Express', 'MongoDB', 'Docker', 'Python',
  'Machine Learning', 'Git', 'REST API', 'SQL', 'AWS'
];

// Target Role Requirements
const ROLE_REQUIREMENTS = {
  'Frontend Developer': ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Redux', 'Git'],
  'Backend': ['Node.js', 'Express', 'MongoDB', 'REST API', 'Docker', 'Git'],
  'Full Stack': ['React', 'Node.js', 'MongoDB', 'JavaScript', 'REST API', 'Git']
};

// Casing map helper to return correct display case
const SKILL_MAP = SKILLS_LIST.reduce((acc, skill) => {
  acc[skill.toLowerCase()] = skill;
  return acc;
}, {});

// Helper function to match skills
function parseSkills(text) {
  const lowerText = text.toLowerCase();
  const found = [];
  
  // Match skills using bound checking or direct index search
  SKILLS_LIST.forEach(skill => {
    const lowerSkill = skill.toLowerCase();
    // Use word boundaries or sub-string index check for simple parsing
    // Standard includes check with word-break logic where applicable
    if (lowerText.includes(lowerSkill)) {
      found.push(skill);
    }
  });

  return found;
}

// Calculate ATS compatibility score
function calcATSScore(foundSkills, role) {
  const requirements = ROLE_REQUIREMENTS[role] || ROLE_REQUIREMENTS['Full Stack'];
  
  const matched = requirements.filter(reqSkill =>
    foundSkills.some(foundSkill => foundSkill.toLowerCase() === reqSkill.toLowerCase())
  );
  
  const missing = requirements.filter(reqSkill =>
    !foundSkills.some(foundSkill => foundSkill.toLowerCase() === reqSkill.toLowerCase())
  );
  
  const atsScore = requirements.length > 0 
    ? Math.round((matched.length / requirements.length) * 100) 
    : 0;

  return { atsScore, matched, missing };
}

// POST /api/resume/upload
router.post('/upload', upload.single('resume'), async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }

    filePath = req.file.path;
    const { email, role } = req.body;

    if (!email) {
      // Remove temp file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'User email is required' });
    }

    // Read file buffer
    const fileBuffer = fs.readFileSync(filePath);
    let extractedText = '';

    // Step 1: Extract text
    if (req.file.mimetype === 'application/pdf') {
      const parsedData = await pdfParse(fileBuffer);
      extractedText = parsedData.text;
    } else {
      const parsedData = await mammoth.extractRawText({ buffer: fileBuffer });
      extractedText = parsedData.value;
    }

    // Step 2: Search for skills
    const foundSkills = parseSkills(extractedText);

    // Step 3: Match against target role requirements
    const targetRole = role || 'Full Stack';
    const { atsScore, matched, missing } = calcATSScore(foundSkills, targetRole);

    // Step 4: Update the user in MongoDB
    const user = await User.findOne({ email });
    if (user) {
      user.skills = foundSkills;
      user.atsScore = atsScore;
      await user.save();
    } else {
      // If user not found, we still return the parsed stats, but log warning
      console.warn(`User with email ${email} not found to save resume stats`);
    }

    // Step 5: Delete temporary uploaded file
    fs.unlinkSync(filePath);
    filePath = null;

    // Step 6: Return result data
    return res.json({
      message: 'Resume analyzed successfully!',
      skills: foundSkills,
      atsScore,
      matched,
      missing
    });

  } catch (err) {
    console.error('Error during resume processing:', err);
    
    // Clean up file if it exists
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Error deleting temp file:', e);
      }
    }
    
    return res.status(500).json({ message: 'Failed to process and analyze resume' });
  }
});

module.exports = router;