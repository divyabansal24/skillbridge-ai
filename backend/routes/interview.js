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
  console.error("Failed to initialize Google Generative AI client for Interview:", e.message);
}

// ─── ROUTE 1: Generate interview questions ───────────────────────
// POST /api/interview/questions
// Body: { role: "Frontend Developer", numQuestions: 5 }
router.post('/questions', async (req, res) => {
  const { role = 'Frontend Developer', numQuestions = 5, difficulty = 'Intermediate', experience = 'Mid-Level' } = req.body;

  if (!genAI || !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock_key_not_provided' || process.env.GEMINI_API_KEY === 'your_actual_gemini_api_key_here') {
    return res.status(400).json({ 
      message: 'Gemini API key is not configured. Please use fallback questions.' 
    });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Generate exactly ${numQuestions} interview questions for a ${role} position.
      
      Rules:
      - Target Difficulty Level: ${difficulty}
      - Target Experience Level: ${experience}
      - Mix of technical and conceptual questions
      - Return a JSON array of strings, like: ["Question 1?", "Question 2?", ...]`;

    const result = await model.generateContent(prompt);
    const questions = JSON.parse(result.response.text());

    res.json({ questions });

  } catch (err) {
    console.error("Error during question generation:", err);
    res.status(500).json({ message: 'Failed to generate questions via Gemini' });
  }
});

// ─── ROUTE 2: Evaluate an answer ────────────────────────────────
// POST /api/interview/evaluate
// Body: { question: "...", answer: "...", role: "Frontend Developer" }
router.post('/evaluate', async (req, res) => {
  const { question, answer, role, difficulty = 'Intermediate', experience = 'Mid-Level' } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ message: 'Question and answer are required' });
  }

  if (!genAI || !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock_key_not_provided' || process.env.GEMINI_API_KEY === 'your_actual_gemini_api_key_here') {
    return res.status(400).json({ 
      message: 'Gemini API key is not configured. Please use fallback evaluations.' 
    });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are an interviewer evaluating a candidate for a ${role} role (Difficulty Level: ${difficulty}, Experience Level: ${experience}).

    Question: ${question}
    Candidate's Answer: ${answer}

    Evaluate the answer and return a JSON object with this exact structure:
    {
      "score": 75,
      "feedback": "Your explanation was clear but missed the concept of reconciliation.",
      "strengths": "Good understanding of Virtual DOM basics.",
      "improvements": "Mention React's diffing algorithm next time."
    }

    The score must be a number between 0 and 100.`;

    const result = await model.generateContent(prompt);
    const evaluation = JSON.parse(result.response.text());

    res.json(evaluation);

  } catch (err) {
    console.error("Error during answer evaluation:", err);
    res.status(500).json({ message: 'Evaluation failed via Gemini' });
  }
});

module.exports = router;