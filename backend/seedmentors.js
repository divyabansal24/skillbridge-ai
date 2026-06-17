require('dotenv').config();
const mongoose = require('mongoose');
const Mentor = require('./models/Mentor');

const mentors = [
  { name: 'Akshay Saini', role: 'Founder & Frontend Educator', company: 'NamasteDev (Ex-Flipkart)', experience: 8, rating: 4.95,
    skills: ['javascript', 'react', 'web performance'],
    bio: 'Ex-Flipkart Engineer. Creator of popular frontend preparation materials.', linkedin: 'https://www.linkedin.com/in/akshaymarch7' },
  { name: 'Raj Vikramaditya', role: 'Founder & SDE', company: 'takeUforward (Ex-Amazon)', experience: 6, rating: 4.91,
    skills: ['algorithms', 'dsa', 'system design'],
    bio: 'Software Engineer and creator of takeUforward DSA Sheets.', linkedin: 'https://www.linkedin.com/in/rajsvikramaditya' },
  { name: 'Love Babbar', role: 'Founder & Educator', company: 'CodeHelp (Ex-Amazon)', experience: 6, rating: 4.88,
    skills: ['c++', 'dsa', 'interview prep'],
    bio: 'Founder of CodeHelp. Dedicated placement prep guide and educator.', linkedin: 'https://www.linkedin.com/in/love-babbar-38ab2887' },
  { name: 'Hitesh Choudhary', role: 'CTO & Educator', company: 'LearnCodeOnline', experience: 12, rating: 4.85,
    skills: ['devops', 'node.js', 'react native'],
    bio: 'Seasoned tech consultant and video educator teaching coding to millions.', linkedin: 'https://www.linkedin.com/in/hiteshchoudhary' },
  { name: 'Tanay Pratap', role: 'Founder & CEO', company: 'Invact (Ex-Microsoft)', experience: 9, rating: 4.82,
    skills: ['react', 'career mentorship', 'web dev'],
    bio: 'Ex-Microsoft Software Engineer and active career advisor.', linkedin: 'https://www.linkedin.com/in/tanaypratap' },
  { name: 'Anuj Kumar Sharma', role: 'Backend Lead & Educator', company: 'Anuj Bhaiya (Ex-Amazon)', experience: 7, rating: 4.80,
    skills: ['java', 'system design', 'backend systems'],
    bio: 'Backend systems engineer teaching software design and core logic.', linkedin: 'https://www.linkedin.com/in/anuj-kumar-sharma-5a981a112' }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Mentor.deleteMany({});  // clear old data first
    await Mentor.insertMany(mentors);
    console.log('Mentors seeded!');
    process.exit();
  });