require('dotenv').config();
const mongoose = require('mongoose');
const Mentor = require('./models/Mentor');

const mentors = [
  { name: 'Rahul Sharma',  role: 'Senior Frontend Engineer', experience: 6, rating: 4.9,
    skills: ['react', 'redux', 'typescript', 'javascript'],
    bio: 'Ex-Flipkart. Loves teaching React architecture.' },
  { name: 'Priya Patel',   role: 'DevOps Engineer', experience: 4, rating: 4.7,
    skills: ['docker', 'kubernetes', 'aws', 'linux'],
    bio: 'AWS Certified. Specializes in MERN deployment.' },
  { name: 'Arjun Mehta',   role: 'Software Architect', experience: 8, rating: 4.8,
    skills: ['system design', 'node.js', 'mongodb', 'rest api'],
    bio: 'Built systems at scale. Loves teaching architecture thinking.' },
  { name: 'Sneha Gupta',   role: 'Data Scientist', experience: 3, rating: 4.6,
    skills: ['python', 'machine learning', 'tensorflow'],
    bio: 'IIT grad. Kaggle master. ML research at startup.' }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Mentor.deleteMany({});  // clear old data first
    await Mentor.insertMany(mentors);
    console.log('Mentors seeded!');
    process.exit();
  });