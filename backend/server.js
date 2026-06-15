const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set('bufferCommands', false);
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const User = require("./models/User");

const fs = require("fs");
const path = require("path");

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("📁 Created uploads directory");
}

// Routes
const mentorRoutes = require("./routes/mentor");
const resumeRoutes = require("./routes/resume");
const interviewRoutes = require("./routes/interview");
const coverletterRoutes = require("./routes/coverletter");
const linkedinRoutes = require("./routes/linkedin");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ================= ROUTES =================
app.use("/api/mentors", mentorRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/coverletter", coverletterRoutes);
app.use("/api/linkedin", linkedinRoutes);


// ================= MONGODB CONNECTION =================
console.log("MONGO_URI =", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.log("⚠️ Could not connect to MongoDB Atlas (IP not whitelisted or offline).");
    console.log("ℹ️ SkillBridge is running gracefully in Local JSON Database Mode (writing to backend/local_db.json).");
  });

// ================= HOME ROUTE =================
app.get("/", (req, res) => {
  res.send("SkillBridge Backend Running");
});

// ================= REGISTER =================
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      skills: [],
    });
await newUser.save();

    const userToReturn = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      skills: newUser.skills,
    };

    res.status(201).json({
      message: "Registration Successful",
      user: userToReturn,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= LOGIN =================
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Compare bcrypt hashes
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "skillbridge_secret_key_2025",
      { expiresIn: "24h" }
    );

   const userToReturn = {
      _id: user._id,
      name: user.name,
      email: user.email,
      skills: user.skills,
    };

    res.status(200).json({
      message: "Login Successful",
      user: userToReturn,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= ADD SKILL =================
app.post("/api/skills/add", async (req, res) => {
  try {
    const { email, skill } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.skills.includes(skill)) {
      user.skills.push(skill);
      await user.save();
    }

    res.status(200).json({
      message: "Skill Added Successfully",
      skills: user.skills,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= GET USER SKILLS =================
app.get("/api/skills/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      skills: user.skills,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= USER PROFILE SETUP =================
app.post("/api/user/setup-profile", async (req, res) => {
  try {
    const { userId, username, bio, targetRole, isPublic } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (username) {
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: "Username can only contain letters, numbers, and underscores." });
      }

      // Check if username is already taken
      let usernameTaken = false;
      if (mongoose.connection.readyState === 1) {
        const existing = await User.findOne({ username, _id: { $ne: userId } });
        if (existing) usernameTaken = true;
      } else {
        const dbPath = path.join(__dirname, "local_db.json");
        if (fs.existsSync(dbPath)) {
          const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
          const existing = db.users.find(u => u.username === username && u._id !== userId);
          if (existing) usernameTaken = true;
        }
      }

      if (usernameTaken) {
        return res.status(400).json({ message: "Username is already taken by another user." });
      }
    }

    let updatedUser = null;
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (username !== undefined) user.username = username;
      if (bio !== undefined) user.bio = bio;
      if (targetRole !== undefined) user.targetRole = targetRole;
      if (isPublic !== undefined) user.isPublic = isPublic;
      await user.save();
      updatedUser = user;
    } else {
      const dbPath = path.join(__dirname, "local_db.json");
      if (fs.existsSync(dbPath)) {
        const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
        const idx = db.users.findIndex(u => u._id === userId);
        if (idx === -1) {
          return res.status(404).json({ message: "User not found" });
        }
        const user = db.users[idx];
        if (username !== undefined) user.username = username;
        if (bio !== undefined) user.bio = bio;
        if (targetRole !== undefined) user.targetRole = targetRole;
        if (isPublic !== undefined) user.isPublic = isPublic;
        user.updatedAt = new Date().toISOString();
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
        updatedUser = user;
      } else {
        return res.status(404).json({ message: "Local database file not found" });
      }
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Profile Setup Error:", error);
    res.status(500).json({ message: "Server error during profile setup" });
  }
});

// ================= GET PUBLIC PROFILE =================
app.get("/api/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;
    let user = null;

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ username });
    } else {
      const dbPath = path.join(__dirname, "local_db.json");
      if (fs.existsSync(dbPath)) {
        const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
        user = db.users.find(u => u.username === username);
      }
    }

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (user.isPublic === false) {
      return res.status(403).json({ message: "This profile is private." });
    }

    res.status(200).json({
      name: user.name,
      username: user.username,
      skills: user.skills || [],
      atsScore: user.atsScore || 0,
      interviewScore: user.interviewScore || 0,
      interviewCount: user.interviewCount || 0,
      targetRole: user.targetRole || "Frontend Developer",
      bio: user.bio || ""
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server error retrieving profile" });
  }
});

// ================= SYNC SCORES =================
app.post("/api/user/sync-scores", async (req, res) => {
  try {
    const { userId, atsScore, interviewScore, interviewCount } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    let updatedUser = null;
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (atsScore !== undefined) user.atsScore = atsScore;
      if (interviewScore !== undefined) user.interviewScore = interviewScore;
      if (interviewCount !== undefined) user.interviewCount = interviewCount;
      await user.save();
      updatedUser = user;
    } else {
      const dbPath = path.join(__dirname, "local_db.json");
      if (fs.existsSync(dbPath)) {
        const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
        const idx = db.users.findIndex(u => u._id === userId);
        if (idx === -1) {
          return res.status(404).json({ message: "User not found" });
        }
        const user = db.users[idx];
        if (atsScore !== undefined) user.atsScore = atsScore;
        if (interviewScore !== undefined) user.interviewScore = interviewScore;
        if (interviewCount !== undefined) user.interviewCount = interviewCount;
        user.updatedAt = new Date().toISOString();
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
        updatedUser = user;
      } else {
        return res.status(404).json({ message: "Local database file not found" });
      }
    }

    res.status(200).json({
      message: "Scores synced successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Sync Scores Error:", error);
    res.status(500).json({ message: "Server error syncing scores" });
  }
});

// ================= JOB DESCRIPTION MATCHER =================
const JD_KEYWORDS = [
  'React', 'Angular', 'Vue', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Node.js', 'Express',
  'MongoDB', 'MySQL', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'Redux',
  'GraphQL', 'REST API', 'HTML', 'CSS', 'Tailwind', 'Machine Learning', 'TensorFlow', 'System Design',
  'Linux', 'CI/CD', 'Figma', 'Firebase'
];

app.post("/api/jd/match", async (req, res) => {
  try {
    const { userSkills = [], jobDescription = "" } = req.body;
    const lowerJD = jobDescription.toLowerCase();
    
    // Extract keywords present in the JD
    const jdSkills = [];
    JD_KEYWORDS.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      // Safe check for 'java' to avoid matching 'javascript'
      if (lowerKeyword === 'java') {
        const javaRegex = /\bjava\b/i;
        if (javaRegex.test(jobDescription)) {
          jdSkills.push(keyword);
        }
      } else {
        if (lowerJD.includes(lowerKeyword)) {
          jdSkills.push(keyword);
        }
      }
    });

    if (jdSkills.length === 0) {
      return res.json({
        matchScore: 0,
        matched: [],
        missing: [],
        recommendation: "Pasted Job Description doesn't seem to contain any of the target technical skills. Please check the text and try again."
      });
    }

    const matched = [];
    const missing = [];
    const userSkillsSet = new Set(userSkills.map(s => s.toLowerCase()));

    jdSkills.forEach(skill => {
      if (userSkillsSet.has(skill.toLowerCase())) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    });

    const matchScore = Math.round((matched.length / jdSkills.length) * 100);
    const learnWeeks = missing.length * 2;
    let recommendation = "";
    if (missing.length > 0) {
      recommendation = `To improve your match score, learn: ${missing.join(", ")}. Estimated time to learn: ${learnWeeks} weeks.`;
    } else {
      recommendation = "Great match! You have all the key skills specified in this job description.";
    }

    res.json({
      matchScore,
      matched,
      missing,
      recommendation
    });
  } catch (error) {
    console.error("JD Matcher API Error:", error);
    res.status(500).json({ message: "Server Error during JD matching" });
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});