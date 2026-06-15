const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Safely initialize Google Generative AI client
const apiKey = process.env.GEMINI_API_KEY || 'mock_key_not_provided';
let genAI = null;

try {
  if (apiKey !== 'mock_key_not_provided' && apiKey !== 'your_actual_gemini_api_key_here') {
    genAI = new GoogleGenerativeAI(apiKey);
  }
} catch (e) {
  console.error("Failed to initialize Google Generative AI client for Cover Letter:", e.message);
}

// POST /api/coverletter/generate
router.post('/generate', async (req, res) => {
  const { name, skills = [], company, role, experience, tone } = req.body;

  if (!name || !company || !role || !experience || !tone) {
    return res.status(400).json({ message: 'All form fields (name, company, role, experience, tone) are required.' });
  }

  if (!genAI || !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock_key_not_provided' || process.env.GEMINI_API_KEY === 'your_actual_gemini_api_key_here') {
    return res.status(400).json({ 
      message: 'Gemini API key is not configured. Please use fallback evaluations.' 
    });
  }

  try {
    const skillsList = skills.length > 0 ? skills.join(', ') : 'general software engineering practices';
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Write a professional cover letter for ${name} applying for ${role} position at ${company}. The candidate has ${experience} of experience and these technical skills: ${skillsList}. Write in a ${tone} tone. The letter should be exactly 3 paragraphs: opening showing enthusiasm for the company, middle highlighting relevant skills and a brief project mention, closing with a call to action. Address the letter to Hiring Manager by starting it with 'Dear Hiring Manager,' followed by a blank line. Sign off with the candidate name. Do not include placeholders in square brackets in the output. Write the complete ready-to-send letter.`;

    const result = await model.generateContent(prompt);
    const coverLetterText = result.response.text();

    res.json({ coverLetter: coverLetterText });

  } catch (err) {
    console.error("Error during cover letter generation:", err);
    res.status(500).json({ message: 'Failed to generate cover letter via Gemini' });
  }
});

module.exports = router;

