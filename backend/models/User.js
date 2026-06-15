const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    default: []
  },
  targetRole: {
    type: String,
    default: 'Frontend Developer'
  },
  atsScore: {
    type: Number,
    default: 0
  },
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  interviewScore: {
    type: Number,
    default: 0
  },
  interviewCount: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const RealUser = mongoose.model('User', userSchema);
const localDbPath = path.join(__dirname, '../local_db.json');

// Helper to read local JSON db
function readLocalDb() {
  try {
    if (fs.existsSync(localDbPath)) {
      return JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
    }
  } catch (e) {
    console.error("⚠️ Failed to read local DB file, using empty store:", e.message);
  }
  return { users: [] };
}

// Helper to write local JSON db
function writeLocalDb(data) {
  try {
    fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error("⚠️ Failed to write local DB file:", e.message);
  }
}

// Wrap raw user object with document methods (like .save())
function createMockDoc(data) {
  const doc = {
    skills: [],
    targetRole: 'Frontend Developer',
    atsScore: 0,
    interviewScore: 0,
    interviewCount: 0,
    bio: '',
    isPublic: true,
    username: null,
    ...data
  };
  
  doc.save = async function() {
    const db = readLocalDb();
    const idx = db.users.findIndex(u => u.email === doc.email);
    doc.updatedAt = new Date().toISOString();
    
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...doc };
    } else {
      db.users.push(doc);
    }
    
    writeLocalDb(db);
    return doc;
  };
  
  return doc;
}

// The smart hybrid model constructor/proxy
function UserConstructor(data) {
  if (mongoose.connection.readyState === 1) {
    return new RealUser(data);
  }
  
  console.log("ℹ️ MongoDB connection not ready. Creating local in-memory user doc.");
  return createMockDoc({
    name: data.name,
    email: data.email,
    password: data.password,
    skills: data.skills || [],
    atsScore: data.atsScore || 0,
    interviewScore: data.interviewScore || 0,
    interviewCount: data.interviewCount || 0,
    targetRole: data.targetRole || 'Frontend Developer',
    bio: data.bio || '',
    isPublic: data.isPublic !== undefined ? data.isPublic : true,
    username: data.username || null,
    _id: 'mock_' + Math.random().toString(36).substring(2, 11),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

// Static findOne method
UserConstructor.findOne = async function(query) {
  if (mongoose.connection.readyState === 1) {
    try {
      return await RealUser.findOne(query);
    } catch (err) {
      console.warn("⚠️ MongoDB query failed, using local database fallback:", err.message);
    }
  }
  
  const db = readLocalDb();
  let email = query.email;
  
  // Handle queries by other properties if any
  if (!email && query.email) {
    email = query.email;
  }
  
  const user = db.users.find(u => u.email === email);
  if (!user) return null;
  
  return createMockDoc(user);
};

module.exports = UserConstructor;