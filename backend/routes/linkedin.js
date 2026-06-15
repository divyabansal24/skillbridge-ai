const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

// POST /api/linkedin/analyze
router.post('/analyze', async (req, res) => {
  const { profileText } = req.body;

  if (!profileText || profileText.trim().length < 50) {
    return res.status(400).json({ message: 'Please paste a valid LinkedIn profile of at least 50 characters.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your_actual_claude_api_key_here' || apiKey.trim() === '') {
    return res.status(400).json({ 
      message: 'Anthropic API key is not configured. Please use fallback evaluations.' 
    });
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are a professional career coach and LinkedIn profile optimizer. 
Analyze the candidate's pasted LinkedIn profile text and generate a structured JSON evaluation report.
You must return ONLY a raw JSON object matching the exact structure below. Do not wrap it in markdown block quotes, do not add conversational remarks, and do not add any text before or after the JSON.

Expected JSON format:
{
  "overallScore": 72,
  "headlineScore": 65,
  "aboutScore": 55,
  "skillsScore": 80,
  "experienceScore": 75,
  "projectsScore": 60,
  "educationScore": 90,
  "certificationsScore": 50,
  "issues": [
    "Headline is too generic and only lists current job title without value proposition.",
    "About section is missing a clear call to action or contact details.",
    "Experience descriptions are brief and lack quantitative metrics (e.g. percentages, sales)."
  ],
  "strengths": [
    "Strong skills list matching modern technical requirements.",
    "Education history is well documented and relevant."
  ],
  "suggestedHeadline": "Frontend Developer | React & TypeScript Expert | Building Responsive & Scalable Web Apps",
  "suggestedAbout": "Passionate Frontend Developer with 2+ years of experience building high-performance web applications using React, Next.js, and TypeScript. Proven track record of optimizing page speeds and collaborating with cross-functional teams to deliver pixel-perfect user experiences. Open to new roles and collaborations—connect with me or email me at example@email.com."
}

All scores must be numbers between 0 and 100. Write a compelling, realistic headline and about section.`;

    const userPrompt = `Pasted LinkedIn Profile content:\n\n${profileText}`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const contentText = response.content[0].text;

    // Clean up potential markdown formatting wrapping the JSON response
    let cleanJsonText = contentText.trim();
    if (cleanJsonText.startsWith("```json")) {
      cleanJsonText = cleanJsonText.substring(7);
    } else if (cleanJsonText.startsWith("```")) {
      cleanJsonText = cleanJsonText.substring(3);
    }
    if (cleanJsonText.endsWith("```")) {
      cleanJsonText = cleanJsonText.substring(0, cleanJsonText.length - 3);
    }
    cleanJsonText = cleanJsonText.trim();

    try {
      const evaluation = JSON.parse(cleanJsonText);
      res.json(evaluation);
    } catch (parseErr) {
      console.error("Failed to parse JSON response from Claude:", contentText);
      res.status(500).json({ 
        message: 'AI generated an invalid response format. Please try again.',
        raw: contentText 
      });
    }

  } catch (err) {
    console.error("Error during LinkedIn profile analysis:", err);
    res.status(500).json({ message: 'Failed to analyze profile via Claude' });
  }
});

module.exports = router;
