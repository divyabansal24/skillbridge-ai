import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { INTERVIEW_QUESTION_BANK } from "./InterviewData";

// Local Fallback Question Bank
const FALLBACK_QUESTIONS = {
  "Frontend Developer": [
    "Explain the differences between state and props in React.",
    "What is the event loop in JavaScript and how does asynchronous execution work?",
    "How does the virtual DOM work in React, and what is the reconciliation process?",
    "Describe CSS Flexbox vs Grid and when you would use each.",
    "What is Redux and what problems does it solve in application state management?"
  ],
  "Backend Developer": [
    "Explain how Node.js handles concurrency despite being single-threaded.",
    "What are RESTful APIs and what are the best practices for designing them?",
    "Explain the difference between SQL and NoSQL databases, and when you'd use MongoDB over PostgreSQL.",
    "What is middleware in Express.js and how does it modify requests/responses?",
    "How do you secure a backend API (authentication, rate limiting, encryption)?"
  ],
  "Full Stack": [
    "What is CORS (Cross-Origin Resource Sharing) and how do you resolve it in a Node/React app?",
    "Describe the full lifecycle of an HTTP request from browser entry to database response.",
    "What is the difference between client-side rendering (CSR) and server-side rendering (SSR)?",
    "Explain how indexes work in databases and how they optimize query speeds.",
    "How do you manage sessions and authentication across a decoupled React client and Node server?"
  ],
  "Data Scientist": [
    "What is overfitting in machine learning and how do you prevent it?",
    "Explain the difference between supervised and unsupervised learning with examples.",
    "How do validation sets and cross-validation help in evaluating machine learning models?",
    "What is a confusion matrix and what are precision, recall, and F1-score?",
    "Explain how linear regression works and how gradient descent finds optimal coefficients."
  ],
  "DevOps": [
    "What is Docker and how does containerization differ from traditional virtual machines?",
    "Explain Continuous Integration (CI) and Continuous Deployment (CD) and list some key pipeline steps.",
    "What is Infrastructure as Code (IaC) and what are its benefits?",
    "How does Kubernetes manage containers, and what is a Pod?",
    "Describe how you would set up centralized logging and monitoring for a production microservices application."
  ]
};

// Local Mock Evaluation Generator (when API key is missing or fails)
const generateMockEvaluation = (question, answer, role, difficulty = "Intermediate", experience = "Mid-Level") => {
  const answerLength = answer ? answer.trim().length : 0;
  
  if (answerLength < 15) {
    return {
      score: 25,
      feedback: `Your answer is extremely brief and lacks technical depth for a ${experience} candidate. Try to define the core concepts and explain how they operate.`,
      strengths: "Identified the topic but failed to provide an explanation.",
      improvements: "Include technical keywords, examples, and aim for a structured 2-3 sentence answer."
    };
  }

  const lowerAnswer = answer.toLowerCase();
  let score = 65; 
  let feedback = `Your explanation shows a solid understanding of the topic at a ${difficulty} difficulty level for a ${experience} role.`;
  let strengths = "Clear expression of the core concept.";
  let improvements = "Elaborate with real-world project usage or design trade-offs.";

  if (question.includes("state") && question.includes("props")) {
    const hasProps = lowerAnswer.includes("prop") || lowerAnswer.includes("pass");
    const hasState = lowerAnswer.includes("state") || lowerAnswer.includes("local");
    const hasChange = lowerAnswer.includes("change") || lowerAnswer.includes("mutate");
    
    if (hasProps && hasState) score += 15;
    if (hasChange) score += 10;
    
    feedback = "You correctly highlighted that props are configuration passed down, whereas state is managed internally.";
    strengths = "Accurate distinction between mutability of state and immutability of props.";
    improvements = "Mention component re-rendering triggers and pure components or hooks like useState.";
  } else if (question.includes("event loop")) {
    const hasCallStack = lowerAnswer.includes("stack") || lowerAnswer.includes("call");
    const hasQueue = lowerAnswer.includes("queue") || lowerAnswer.includes("callback");
    const hasSingle = lowerAnswer.includes("single") || lowerAnswer.includes("thread");
    
    if (hasCallStack && hasQueue) score += 20;
    if (hasSingle) score += 5;
    
    feedback = "Good explanation of non-blocking I/O execution handling in Javascript.";
    strengths = "Detailed trace of call stack and callback queue interaction.";
    improvements = "Mention microtask queues (Promise resolution) vs macrotask queues (setTimeout).";
  } else {
    const bonus = Math.min(Math.floor(answerLength / 25), 25);
    score += bonus;
    feedback = `Good description of the technical constraints and logic. You touched upon the core variables.`;
    strengths = "Structured description, clear logical sequence, and correct terminology.";
    improvements = "Consider describing performance optimization details or system architecture considerations.";
  }

  return {
    score: Math.min(score, 100),
    feedback,
    strengths,
    improvements
  };
};

// Hardcoded Mentor Data
const MENTORS_DATA = [
  { name: "Akshay Saini", role: "Founder & Frontend Educator", company: "NamasteDev (Ex-Flipkart)", rating: "4.95", experience: 8, skills: ["JavaScript", "React", "Web Performance"], avatarBg: "#1E293B", initials: "AS", linkedin: "https://www.linkedin.com/in/akshaymarch7" },
  { name: "Raj Vikramaditya", role: "Founder & SDE", company: "takeUforward (Ex-Amazon)", rating: "4.91", experience: 6, skills: ["Algorithms", "DSA", "System Design"], avatarBg: "#334155", initials: "RV", linkedin: "https://www.linkedin.com/in/rajsvikramaditya" },
  { name: "Love Babbar", role: "Founder & Educator", company: "CodeHelp (Ex-Amazon)", rating: "4.88", experience: 6, skills: ["C++", "DSA", "Interview Prep"], avatarBg: "#475569", initials: "LB", linkedin: "https://www.linkedin.com/in/love-babbar-38ab2887" },
  { name: "Hitesh Choudhary", role: "CTO & Educator", company: "LearnCodeOnline", rating: "4.85", experience: 12, skills: ["DevOps", "Node.js", "React Native"], avatarBg: "#0F172A", initials: "HC", linkedin: "https://www.linkedin.com/in/hiteshchoudhary" },
  { name: "Tanay Pratap", role: "Founder & CEO", company: "Invact (Ex-Microsoft)", rating: "4.82", experience: 9, skills: ["React", "Career Mentorship", "Web Dev"], avatarBg: "#1E293B", initials: "TP", linkedin: "https://www.linkedin.com/in/tanaypratap" },
  { name: "Anuj Kumar Sharma", role: "Backend Lead & Educator", company: "Anuj Bhaiya (Ex-Amazon)", rating: "4.80", experience: 7, skills: ["Java", "System Design", "Backend Systems"], avatarBg: "#334155", initials: "AK", linkedin: "https://www.linkedin.com/in/anuj-kumar-sharma-5a981a112" }
];

// Clickable Resource Links Data
const RESOURCES_DATA = [
  { title: "React Docs", subtitle: "Official documentation for React v19. Learn components, state, and hooks.", url: "https://react.dev/learn", color: "#60DBFB", category: "Frontend" },
  { title: "Docker Docs", subtitle: "Comprehensive guides for building containers, images, and compose configs.", url: "https://docs.docker.com", color: "#2496ED", category: "DevOps" },
  { title: "TypeScript Handbook", subtitle: "Typed superset documentation. Interfaces, enums, and generics.", url: "https://www.typescriptlang.org/docs", color: "#3178C6", category: "Language" },
  { title: "Redux Toolkit", subtitle: "The official, opinionated, batteries-included toolset for Redux logic.", url: "https://redux-toolkit.js.org", color: "#764ABC", category: "Frontend" },
  { title: "Kaggle Python Course", subtitle: "Interactive coding tutorials containing core Python modules for data science.", url: "https://www.kaggle.com/learn/python", color: "#20BEFF", category: "Data Science" },
  { title: "System Design Primer", subtitle: "Open-source GitHub repository detailing scalability and system structures.", url: "https://github.com/donnemartin/system-design-primer", color: "#FF1744", category: "Architecture" },
  { title: "LeetCode", subtitle: "Practice algorithms, data structures, and database query problems.", url: "https://leetcode.com", color: "#FFA116", category: "Interview" },
  { title: "roadmap.sh", subtitle: "Visual pathways and step-by-step developer guides to master career skills.", url: "https://roadmap.sh", color: "#00E676", category: "Pathways" }
];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // Tab: 'dashboard', 'resume', 'interview', 'mentors', 'resources'
  const [toast, setToast] = useState({ message: "", type: "" }); // { message: '...', type: 'success' | 'error' }
  
  // Resume Analyzer state
  const [selectedRole, setSelectedRole] = useState("Frontend Developer");
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  // AI Mock Interview state
  const [interviewRole, setInterviewRole] = useState("Frontend Developer");
  const [interviewDifficulty, setInterviewDifficulty] = useState("Intermediate");
  const [interviewExperience, setInterviewExperience] = useState("Mid-Level");
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [interviewAnswers, setInterviewAnswers] = useState({ 0: "", 1: "", 2: "", 3: "", 4: "" });
  const [interviewMcqs, setInterviewMcqs] = useState([]);
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [evaluatingAnswers, setEvaluatingAnswers] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [interviewFeedbackError, setInterviewFeedbackError] = useState("");
  const [isInterviewDemoMode, setIsInterviewDemoMode] = useState(false);

  const handleRoleChange = (role) => {
    setInterviewRole(role);
    setInterviewQuestions([]);
    setInterviewMcqs([]);
    setEvaluationResults(null);
    setInterviewAnswers({ 0: "", 1: "", 2: "", 3: "", 4: "" });
    setMcqAnswers({});
    setInterviewFeedbackError("");
  };
  
  // Dashboard Live Stats State (persisted via localStorage)
  const [missingSkillsCount, setMissingSkillsCount] = useState(0);
  const [interviewsDone, setInterviewsDone] = useState(0);

  // Manual skill add and mentor connection states
  const [manualSkillInput, setManualSkillInput] = useState("");
  const [connectedMentors, setConnectedMentors] = useState([]);

  // Job Description Matcher State
  const [jdText, setJdText] = useState("");
  const [jdAnalyzing, setJdAnalyzing] = useState(false);
  const [jdResult, setJdResult] = useState(null);
  const [jdError, setJdError] = useState("");

  // Cover Letter Generator State
  const [clCompany, setClCompany] = useState("");
  const [clRole, setClRole] = useState("");
  const [clExperience, setClExperience] = useState("Fresher");
  const [clTone, setClTone] = useState("Professional");
  const [clGenerating, setClGenerating] = useState(false);
  const [clResult, setClResult] = useState("");
  const [clError, setClError] = useState("");

  // Profile Setup State
  const [pfUsername, setPfUsername] = useState("");
  const [pfBio, setPfBio] = useState("");
  const [pfTargetRole, setPfTargetRole] = useState("Frontend Developer");
  const [pfIsPublic, setPfIsPublic] = useState(true);
  const [pfSavedLink, setPfSavedLink] = useState("");
  const [pfError, setPfError] = useState("");
  const [pfSaving, setPfSaving] = useState(false);

  // LinkedIn Analyzer State
  const [liText, setLiText] = useState("");
  const [liAnalyzing, setLiAnalyzing] = useState(false);
  const [liResult, setLiResult] = useState(null);
  const [liError, setLiError] = useState("");

  const navigate = useNavigate();


  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    let emailKey = "";

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      emailKey = parsedUser.email || "guest";
      setPfUsername(parsedUser.username || "");
      setPfBio(parsedUser.bio || "");
      setPfTargetRole(parsedUser.targetRole || "Frontend Developer");
      setPfIsPublic(parsedUser.isPublic !== undefined ? parsedUser.isPublic : true);
      if (parsedUser.skills) {
        localStorage.setItem("sb_skills", JSON.stringify(parsedUser.skills));
      } else {
        localStorage.setItem("sb_skills", JSON.stringify([]));
      }
    } else {
      navigate("/login");
      return;
    }

    // Load URL query tab parameter if any (e.g. ?tab=resume)
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam && ["dashboard", "resume", "interview", "mentors", "resources", "jd_matcher", "cover_letter", "profile_setup", "linkedin_analyzer"].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    // Load persisted stats (isolated per user)
    const savedInterviews = localStorage.getItem(`interviewCount_${emailKey}`);
    if (savedInterviews) {
      setInterviewsDone(parseInt(savedInterviews));
    } else {
      setInterviewsDone(0);
      localStorage.setItem(`interviewCount_${emailKey}`, "0");
    }

    const savedMissing = localStorage.getItem(`missingSkills_${emailKey}`);
    if (savedMissing) {
      setMissingSkillsCount(parseInt(savedMissing));
    } else {
      setMissingSkillsCount(0);
      localStorage.setItem(`missingSkills_${emailKey}`, "0");
    }

    // Load connected mentors list (isolated per user)
    const savedMentors = localStorage.getItem(`connectedMentors_${emailKey}`);
    if (savedMentors) {
      setConnectedMentors(JSON.parse(savedMentors));
    } else {
      setConnectedMentors([]);
      localStorage.setItem(`connectedMentors_${emailKey}`, JSON.stringify([]));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleAddSkill = async (e) => {
    if (e) e.preventDefault();
    const skill = manualSkillInput.trim();
    if (!skill) return;
    if (!user) return;

    // Check if user already has it
    if (user.skills && user.skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      triggerToast("Skill already added!", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/skills/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({ email: user.email, skill })
      });

      if (!response.ok) {
        throw new Error("Failed to add skill to database.");
      }

      const updatedSkills = user.skills ? [...user.skills, skill] : [skill];

      // Update user state and localStorage
      const updatedUser = {
        ...user,
        skills: updatedSkills
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("sb_skills", JSON.stringify(updatedSkills));
      setUser(updatedUser);
      setManualSkillInput("");
      triggerToast(`Added skill: ${skill}`, "success");
    } catch (err) {
      console.error("Failed to add skill via API:", err);
      // Local-only fallback
      const updatedSkills = user.skills ? [...user.skills, skill] : [skill];
      const updatedUser = { ...user, skills: updatedSkills };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("sb_skills", JSON.stringify(updatedSkills));
      setUser(updatedUser);
      setManualSkillInput("");
      triggerToast(`Added skill: ${skill} (locally)`, "success");
    }
  };

  const handleConnectMentor = (mentorName) => {
    if (connectedMentors.includes(mentorName)) {
      triggerToast(`Already connected with ${mentorName}!`, "success");
      return;
    }

    const updated = [...connectedMentors, mentorName];
    setConnectedMentors(updated);
    localStorage.setItem(`connectedMentors_${user?.email || "guest"}`, JSON.stringify(updated));
    triggerToast(`Request sent to ${mentorName}!`, "success");
  };

  // Job Description Matcher Handlers
  const handleAnalyzeJD = async () => {
    const jdClean = jdText.trim();
    if (!jdClean) {
      setJdError("Please paste a job description to analyze.");
      return;
    }

    setJdAnalyzing(true);
    setJdError("");
    setJdResult(null);

    let userSkills = [];
    try {
      const savedSkills = localStorage.getItem("sb_skills");
      if (savedSkills) {
        userSkills = JSON.parse(savedSkills);
      } else if (user && user.skills) {
        userSkills = user.skills;
      }
    } catch (e) {
      console.error("Error reading sb_skills from localStorage:", e);
      if (user && user.skills) userSkills = user.skills;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/jd/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({ userSkills, jobDescription: jdClean })
      });

      const data = await response.json();

      if (response.ok) {
        setJdResult(data);
        triggerToast("Job description analyzed successfully!", "success");
      } else {
        runLocalJDMatch(userSkills, jdClean);
      }
    } catch (err) {
      console.warn("Backend match API failed, falling back to local processing:", err);
      runLocalJDMatch(userSkills, jdClean);
    } finally {
      setJdAnalyzing(false);
    }
  };

  const runLocalJDMatch = (userSkills, jobDescription) => {
    const JD_KEYWORDS_LIST = [
      'React', 'Angular', 'Vue', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Node.js', 'Express',
      'MongoDB', 'MySQL', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'Redux',
      'GraphQL', 'REST API', 'HTML', 'CSS', 'Tailwind', 'Machine Learning', 'TensorFlow', 'System Design',
      'Linux', 'CI/CD', 'Figma', 'Firebase'
    ];

    const lowerJD = jobDescription.toLowerCase();
    const jdSkills = [];
    
    JD_KEYWORDS_LIST.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
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
      setJdResult({
        matchScore: 0,
        matched: [],
        missing: [],
        recommendation: "Pasted Job Description doesn't seem to contain any of the target technical skills. Please check the text and try again."
      });
      triggerToast("Loaded local JD parser (No target skills found).", "warning");
      return;
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

    setJdResult({
      matchScore,
      matched,
      missing,
      recommendation
    });

    triggerToast("Analyzed match rate locally!", "success");
  };

  // Cover Letter Generator Handlers
  const handleGenerateCoverLetter = async () => {
    const companyClean = clCompany.trim();
    const roleClean = clRole.trim();

    if (!companyClean || !roleClean) {
      setClError("Company Name and Job Role are required.");
      return;
    }

    setClGenerating(true);
    setClError("");
    setClResult("");

    let userSkills = [];
    try {
      const savedSkills = localStorage.getItem("sb_skills");
      if (savedSkills) {
        userSkills = JSON.parse(savedSkills);
      } else if (user && user.skills) {
        userSkills = user.skills;
      }
    } catch (e) {
      console.error("Error reading sb_skills from localStorage:", e);
      if (user && user.skills) userSkills = user.skills;
    }

    const userName = user?.name || "Candidate";
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/coverletter/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({
          name: userName,
          skills: userSkills,
          company: companyClean,
          role: roleClean,
          experience: clExperience,
          tone: clTone
        })
      });

      const data = await response.json();

      if (response.ok && data.coverLetter) {
        setClResult(data.coverLetter);
        triggerToast("Cover letter generated successfully!", "success");
      } else {
        console.warn("Backend API returned an error or is unconfigured, using local generator fallback:", data);
        runLocalCoverLetterGeneration(userName, userSkills, companyClean, roleClean, clExperience, clTone);
      }
    } catch (err) {
      console.warn("Backend cover letter API failed, falling back to local processing:", err);
      runLocalCoverLetterGeneration(userName, userSkills, companyClean, roleClean, clExperience, clTone);
    } finally {
      setClGenerating(false);
    }
  };

  const runLocalCoverLetterGeneration = (name, skills, company, role, experience, tone) => {
    let openingPhrase = "";
    let enthusiasmPhrase = "";
    let callToAction = "";
    let signOff = "";

    const skillsString = skills && skills.length > 0 ? skills.join(", ") : "software engineering and modern technology frameworks";

    if (tone === "Enthusiastic") {
      openingPhrase = `I am absolutely thrilled to write to you today to express my interest in the ${role} position at ${company}.`;
      enthusiasmPhrase = `I have been following ${company}'s progress closely and am inspired by the creative solutions and high-energy culture your team is known for.`;
      callToAction = `I would love the opportunity to bring my passion and skills to your team. I look forward to the possibility of discussing how my background aligns with your exciting goals!`;
      signOff = `Warmest regards,`;
    } else if (tone === "Creative") {
      openingPhrase = `Every once in a while, a career opportunity comes along that perfectly bridges innovation and technical talent. That is why I am writing to apply for the ${role} role at ${company}.`;
      enthusiasmPhrase = `I admire ${company}'s willingness to challenge convention and build forward-thinking products that redefine boundaries.`;
      callToAction = `Let's connect and discuss how my unique blend of experience and creative problem-solving can help push the boundaries of what is possible at ${company}.`;
      signOff = `Best creative wishes,`;
    } else { // Professional
      openingPhrase = `Please accept this letter as formal application for the ${role} position currently available at ${company}.`;
      enthusiasmPhrase = `With a strong reputation for industry leadership and excellence, ${company} represents the ideal environment for me to make a meaningful contribution.`;
      callToAction = `Thank you for your time and consideration. I welcome the opportunity to discuss my qualifications with you in an interview at your earliest convenience.`;
      signOff = `Sincerely,`;
    }

    const experienceTexts = {
      "Fresher": `As a motivated graduate with a strong foundation in tech, I have successfully developed several academic and personal projects.`,
      "0-1 years": `With a solid foundation in the industry and early hands-on experience, I have successfully contributed to software release cycles.`,
      "1-2 years": `Having spent the last couple of years building web applications and collaborating in agile teams, I have refined my developmental processes.`,
      "2-3 years": `With two to three years of professional experience under my belt, I have successfully delivered robust software features and optimized code performance.`
    };
    const expIntro = experienceTexts[experience] || experienceTexts["Fresher"];

    const firstParagraph = `${openingPhrase} ${enthusiasmPhrase} Given my background and interest in joining a high-impact team, I am confident that I can make a valuable contribution to your engineering department.`;
    
    const secondParagraph = `${expIntro} Throughout my journey, I have developed strong competencies in ${skillsString}. Specifically, I have designed and implemented projects using these technologies to solve real-world problems. Whether collaborating with cross-functional teams or working independently, I take pride in writing clean, well-tested, and efficient code.`;
    
    const thirdParagraph = `I am eager to leverage my technical skills and dedication to help ${company} achieve its goals. ${callToAction}\n\n${signOff}\n${name}`;

    const generatedLetter = `Dear Hiring Manager,\n\n${firstParagraph}\n\n${secondParagraph}\n\n${thirdParagraph}`;
    
    setClResult(generatedLetter);
    triggerToast("Generated cover letter locally!", "success");
  };

  // Profile Setup Handler
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setPfError("");
    setPfSavedLink("");
    setPfSaving(true);

    const usernameClean = pfUsername.trim();
    if (!usernameClean) {
      setPfError("Username is required.");
      setPfSaving(false);
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(usernameClean)) {
      setPfError("Username can only contain letters, numbers, and underscores.");
      setPfSaving(false);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const setupRes = await fetch("/api/user/setup-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({
          userId: user._id,
          username: usernameClean,
          bio: pfBio,
          targetRole: pfTargetRole,
          isPublic: pfIsPublic
        })
      });

      const setupData = await setupRes.json();

      if (!setupRes.ok) {
        throw new Error(setupData.message || "Failed to save profile details.");
      }

      // Sync ATS Score and Interview Metrics
      const currentAts = user?.atsScore || 0;
      const currentInterviews = interviewsDone || 0;

      await fetch("/api/user/sync-scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({
          userId: user._id,
          atsScore: currentAts,
          interviewScore: 80, // Default for college project demonstration
          interviewCount: currentInterviews
        })
      });

      const updatedUser = {
        ...user,
        username: usernameClean,
        bio: pfBio,
        targetRole: pfTargetRole,
        isPublic: pfIsPublic
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setPfSavedLink(`http://localhost:3000/profile/${usernameClean}`);
      triggerToast("Profile saved successfully!", "success");
    } catch (err) {
      console.error("Profile save error:", err);
      setPfError(err.message || "Failed to save profile.");
    } finally {
      setPfSaving(false);
    }
  };

  // LinkedIn Analyzer Handler
  const handleAnalyzeLinkedIn = async (e) => {
    if (e) e.preventDefault();
    setLiError("");
    setLiResult(null);
    setLiAnalyzing(true);

    const cleanText = liText.trim();
    if (!cleanText || cleanText.length < 50) {
      setLiError("Please paste a valid LinkedIn profile of at least 50 characters.");
      setLiAnalyzing(false);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/linkedin/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({ profileText: cleanText })
      });

      const data = await response.json();

      if (response.ok) {
        setLiResult(data);
        triggerToast("LinkedIn profile analyzed successfully!", "success");
      } else {
        console.warn("Backend API returned an error or is unconfigured, using local analyzer fallback:", data);
        runLocalLinkedInAnalysis(cleanText, data.message || "Server API unconfigured.");
      }
    } catch (err) {
      console.warn("Backend LinkedIn API failed, falling back to local processing:", err);
      runLocalLinkedInAnalysis(cleanText, "Could not connect to the server.");
    } finally {
      setLiAnalyzing(false);
    }
  };

  const runLocalLinkedInAnalysis = (text, reason) => {
    const lowerText = text.toLowerCase();

    // Heuristics
    // 1. Headline Score
    let headlineScore = 40;
    if (lowerText.includes("headline") || lowerText.includes("title") || lowerText.includes("|") || lowerText.includes("specializ")) {
      headlineScore = 85;
    } else if (lowerText.includes("developer") || lowerText.includes("engineer") || lowerText.includes("student") || lowerText.includes("intern")) {
      headlineScore = 60;
    }

    // 2. About Section
    let aboutScore = 30;
    if (lowerText.includes("about") || lowerText.includes("summary") || lowerText.includes("passionate") || lowerText.includes("experienced")) {
      aboutScore = 80;
    }

    // 3. Skills Score
    const targetSkills = ["react", "javascript", "typescript", "node", "express", "mongodb", "python", "java", "sql", "git", "html", "css", "docker"];
    let matchedSkillsCount = 0;
    targetSkills.forEach(s => {
      if (lowerText.includes(s)) matchedSkillsCount++;
    });
    const skillsScore = Math.min(100, Math.max(40, matchedSkillsCount * 12));

    // 4. Experience Score
    let experienceScore = 30;
    if (lowerText.includes("experience") || lowerText.includes("worked") || lowerText.includes("employment")) {
      experienceScore = 80;
      if (lowerText.includes("years") || lowerText.includes("months")) experienceScore = 90;
    }

    // 5. Projects Score
    let projectsScore = 20;
    if (lowerText.includes("project") || lowerText.includes("built") || lowerText.includes("developed") || lowerText.includes("portfolio")) {
      projectsScore = 85;
    }

    // 6. Education Score
    let educationScore = 40;
    if (lowerText.includes("education") || lowerText.includes("university") || lowerText.includes("college") || lowerText.includes("degree") || lowerText.includes("b.tech") || lowerText.includes("b.s.")) {
      educationScore = 90;
    }

    // 7. Certifications Score
    let certificationsScore = 20;
    if (lowerText.includes("certif") || lowerText.includes("license") || lowerText.includes("credential")) {
      certificationsScore = 85;
    }

    // Overall Score
    const overallScore = Math.round(
      (headlineScore + aboutScore + skillsScore + experienceScore + projectsScore + educationScore + certificationsScore) / 7
    );

    // Strengths & Issues
    const issues = [];
    const strengths = [];

    if (headlineScore < 70) {
      issues.push("Headline is too generic. Try adding your core tech stack (e.g., React, TypeScript) and a brief value statement instead of just your role title.");
    } else {
      strengths.push("Good headline structure displaying key keywords.");
    }

    if (aboutScore < 75) {
      issues.push("About section appears thin or missing. Craft a 3-sentence summary of your technical experience, major project highlights, and call to action.");
    } else {
      strengths.push("Strong About section detailing professional narrative.");
    }

    if (skillsScore < 70) {
      issues.push("Fewer than 5 technical skills detected. List specific languages (JavaScript, Python), libraries (React, Express), and tools (Git, Docker).");
    } else {
      strengths.push("Excellent skills representation containing keywords relevant to recruiter search filters.");
    }

    if (experienceScore < 70) {
      issues.push("Work experience descriptions lack details or numeric metrics. Include accomplishments with percentages or quantifiable improvements.");
    } else {
      strengths.push("Detailed work/internship experience items are present.");
    }

    if (projectsScore < 70) {
      issues.push("No distinct projects section or details found. Add 2-3 technical projects showcasing your hands-on code capability.");
    } else {
      strengths.push("Projects details are well represented.");
    }

    if (certificationsScore < 70) {
      issues.push("No professional certifications or online licenses found. Adding certifications boosts profile credibility.");
    } else {
      strengths.push("Certifications and credentials verified on profile.");
    }

    if (educationScore >= 80) {
      strengths.push("Academic credentials and education timeline are complete.");
    }

    // AI Headline & About Generator
    let matchedMajorSkills = targetSkills.filter(s => lowerText.includes(s)).map(s => s.charAt(0).toUpperCase() + s.slice(1));
    if (matchedMajorSkills.length === 0) matchedMajorSkills = ["Software Engineering", "Full Stack Development"];

    
    const suggestedHeadline = `${user?.targetRole || "Software Developer"} | Specializing in ${matchedMajorSkills.slice(0, 3).join(", ")} | Solving Complex Web Problems`;
    
    const suggestedAbout = `Passionate and results-oriented ${user?.targetRole || "Software Developer"} skilled in ${matchedMajorSkills.slice(0, 4).join(", ")}. Experienced in translating design requirements into pixel-perfect, highly responsive web interfaces. Constantly exploring new frameworks and eager to contribute to innovative projects—let's connect or reach out at ${user?.email || "email@example.com"}.`;

    setLiResult({
      overallScore,
      headlineScore,
      aboutScore,
      skillsScore,
      experienceScore,
      projectsScore,
      educationScore,
      certificationsScore,
      issues,
      strengths,
      suggestedHeadline,
      suggestedAbout
    });

    triggerToast("Offline profile analysis complete!", "success");
  };

  // Toast Trigger Helper
  const triggerToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000);
  };

  // Resume Analyzer Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (allowedTypes.includes(file.type) || extension === 'pdf' || extension === 'docx') {
      setResumeFile(file);
      setUploadError("");
      setAnalysisResult(null);
    } else {
      setUploadError("Invalid file type. Please upload a PDF or DOCX file.");
      setResumeFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  };

  const clearFile = () => {
    setResumeFile(null);
    setUploadError("");
    setAnalysisResult(null);
    setIsDemoMode(false);
  };

  const runDemoAnalysis = () => {
    setIsDemoMode(true);
    setTimeout(() => {
      let mockSkills = [];
      let mockMatched = [];
      let mockMissing = [];
      let mockAtsScore = 0;

      if (selectedRole === "Frontend Developer") {
        mockSkills = ["React", "JavaScript", "HTML", "CSS", "Git", "Docker"];
        mockMatched = ["React", "JavaScript", "HTML", "CSS", "Git"];
        mockMissing = ["TypeScript", "Redux"];
        mockAtsScore = 71;
      } else if (selectedRole === "Backend") {
        mockSkills = ["Node.js", "Express", "MongoDB", "REST API", "SQL", "AWS"];
        mockMatched = ["Node.js", "Express", "MongoDB", "REST API"];
        mockMissing = ["Docker", "Git"];
        mockAtsScore = 67;
      } else {
        mockSkills = ["React", "JavaScript", "Node.js", "MongoDB", "Git", "AWS"];
        mockMatched = ["React", "JavaScript", "Node.js", "MongoDB", "Git"];
        mockMissing = ["REST API"];
        mockAtsScore = 83;
      }

      const results = {
        skills: mockSkills,
        atsScore: mockAtsScore,
        matched: mockMatched,
        missing: mockMissing
      };

      setAnalysisResult(results);
      
      // Update User profile and states immediately (stats live update)
      const updatedUser = {
        ...user,
        skills: mockSkills,
        atsScore: mockAtsScore
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("sb_skills", JSON.stringify(mockSkills));
      setUser(updatedUser);

      // Save missing skills count to localStorage (isolated per user)
      const missingCount = mockMissing.length;
      localStorage.setItem(`missingSkills_${user?.email || "guest"}`, missingCount.toString());
      setMissingSkillsCount(missingCount);

      triggerToast("Resume analyzed in Demo Mode!", "success");
      setAnalyzing(false);
    }, 1500);
  };

  const handleAnalyzeResume = async () => {
    if (!resumeFile) {
      setUploadError("Please upload a resume file first.");
      return;
    }

    setAnalyzing(true);
    setUploadError("");
    setAnalysisResult(null);
    setIsDemoMode(false);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("email", user.email);
    formData.append("role", selectedRole);

    const token = localStorage.getItem("token");

    try {
      // Relative path proxy URL endpoint
      const response = await fetch("/api/resume/upload", {
        method: "POST",
        headers: {
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setAnalysisResult({
          skills: data.skills,
          atsScore: data.atsScore,
          matched: data.matched,
          missing: data.missing
        });

        // Update User profile and states immediately (stats live update)
        const updatedUser = {
          ...user,
          skills: data.skills,
          atsScore: data.atsScore
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("sb_skills", JSON.stringify(data.skills));
        setUser(updatedUser);

        // Save missing skills count to localStorage (isolated per user)
        const missingCount = data.missing ? data.missing.length : 0;
        localStorage.setItem(`missingSkills_${user?.email || "guest"}`, missingCount.toString());
        setMissingSkillsCount(missingCount);

        triggerToast("Resume analyzed successfully!", "success");
        setAnalyzing(false);
      } else {
        runDemoAnalysis();
      }
    } catch (err) {
      runDemoAnalysis();
    }
  };

  // AI Mock Interview Handlers
  const handleGenerateQuestions = async () => {
    setGeneratingQuestions(true);
    setInterviewFeedbackError("");
    setEvaluationResults(null);
    setIsInterviewDemoMode(false);
    setInterviewAnswers({ 0: "", 1: "", 2: "", 3: "", 4: "" });
    setMcqAnswers({});

    // Load MCQs from the offline bank for the role
    const roleData = INTERVIEW_QUESTION_BANK[interviewRole] || INTERVIEW_QUESTION_BANK["Frontend Developer"];
    setInterviewMcqs(roleData.mcqs || []);

    const token = localStorage.getItem("token");

    try {
      // Relative path proxy URL endpoint
      const response = await fetch("/api/interview/questions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({ 
          role: interviewRole, 
          difficulty: interviewDifficulty,
          experience: interviewExperience,
          numQuestions: 5 
        })
      });

      const data = await response.json();

      if (response.ok && data.questions && data.questions.length > 0) {
        setInterviewQuestions(data.questions);
        triggerToast("Questions generated successfully!", "success");
      } else {
        setInterviewQuestions(roleData.theory || FALLBACK_QUESTIONS[interviewRole]);
        setIsInterviewDemoMode(true);
        triggerToast("Loaded offline practice questions.", "success");
      }
    } catch (err) {
      setInterviewQuestions(roleData.theory || FALLBACK_QUESTIONS[interviewRole]);
      setIsInterviewDemoMode(true);
      triggerToast("Loaded offline practice questions.", "success");
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    setInterviewAnswers({
      ...interviewAnswers,
      [index]: value
    });
  };

  const handleSubmitAllAnswers = async () => {
    const unansweredTheoryCount = interviewQuestions.filter((_, idx) => !interviewAnswers[idx]?.trim()).length;
    const unansweredMcqCount = interviewMcqs.filter((_, idx) => mcqAnswers[idx] === undefined).length;

    if (unansweredTheoryCount === interviewQuestions.length && unansweredMcqCount === interviewMcqs.length) {
      setInterviewFeedbackError("Please answer at least one MCQ or theory question before submitting.");
      return;
    }

    setEvaluatingAnswers(true);
    setInterviewFeedbackError("");
    
    // 1. Grade MCQs
    let correctCount = 0;
    const mcqResults = interviewMcqs.map((mcq, idx) => {
      const isCorrect = mcqAnswers[idx] === mcq.correct;
      if (isCorrect) correctCount++;
      return {
        question: mcq.question,
        selected: mcqAnswers[idx] || "Unanswered",
        correct: mcq.correct,
        isCorrect
      };
    });
    const mcqScore = Math.round((correctCount / interviewMcqs.length) * 100);

    // 2. Grade Theory
    const evals = [];
    const token = localStorage.getItem("token");

    for (let i = 0; i < interviewQuestions.length; i++) {
      const question = interviewQuestions[i];
      const answer = interviewAnswers[i] || "";

      if (isInterviewDemoMode) {
        const evalRes = generateMockEvaluation(question, answer, interviewRole, interviewDifficulty, interviewExperience);
        evals.push(evalRes);
      } else {
        try {
          const response = await fetch("/api/interview/evaluate", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              ...(token && { "Authorization": `Bearer ${token}` })
            },
            body: JSON.stringify({ 
              question, 
              answer, 
              role: interviewRole,
              difficulty: interviewDifficulty,
              experience: interviewExperience
            })
          });

          const data = await response.json();

          if (response.ok) {
            evals.push(data);
          } else {
            const evalRes = generateMockEvaluation(question, answer, interviewRole, interviewDifficulty, interviewExperience);
            evals.push(evalRes);
            setIsInterviewDemoMode(true);
          }
        } catch (e) {
          const evalRes = generateMockEvaluation(question, answer, interviewRole, interviewDifficulty, interviewExperience);
          evals.push(evalRes);
          setIsInterviewDemoMode(true);
        }
      }
    }

    const totalTheoryScore = evals.reduce((sum, item) => sum + item.score, 0);
    const avgTheoryScore = evals.length > 0 ? Math.round(totalTheoryScore / evals.length) : 0;

    // Combine score: average of MCQs and Theory
    const finalScore = Math.round((mcqScore + avgTheoryScore) / 2);

    setEvaluationResults({
      evaluations: evals,
      mcqResults,
      mcqScore,
      theoryScore: avgTheoryScore,
      averageScore: finalScore,
      correctCount,
      totalMcqs: interviewMcqs.length
    });

    // Update persisted interview count (isolated per user)
    setInterviewsDone(prev => {
      const nextCount = prev + 1;
      localStorage.setItem(`interviewCount_${user?.email || "guest"}`, nextCount.toString());
      return nextCount;
    });

    triggerToast("Interview evaluated successfully!", "success");
    setEvaluatingAnswers(false);
  };

  // Dashboard Stats calculations
  const skillsCount = user && user.skills ? user.skills.length : 0;
  const atsScoreVal = user && user.atsScore ? user.atsScore : 0;

  // SVG readiness percentage ring values
  const radius = 35;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius; 
  const mentorProgressPercentage = Math.min(connectedMentors.length * 20, 100);
  const interviewProgressPercentage = interviewsDone > 0 ? 100 : 0;
  const resumeProgressPercentage = atsScoreVal > 0 ? 100 : 0;
  
  // Overall readiness is the average of our three modules
  const readinessPercentage = Math.round((resumeProgressPercentage + interviewProgressPercentage + mentorProgressPercentage) / 3);
  const strokeDashoffset = circumference * (1 - readinessPercentage / 100);

  // SVG analysis result circle percentage ring values
  const resultRadius = 45;
  const resultStrokeWidth = 8;
  const resultCircumference = 2 * Math.PI * resultRadius;
  const resultAtsScore = analysisResult ? analysisResult.atsScore : 0;
  const resultStrokeDashoffset = resultCircumference * (1 - resultAtsScore / 100);

  return (
    <div className="dashboard-page-container">
      {/* Global Toast Popup (Bottom-Right) */}
      {toast.message && (
        <div className={`global-toast ${toast.type === "error" ? "toast-error" : "toast-success"}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px" }}>
            {toast.type === "error" ? (
              <>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </>
            ) : (
              <polyline points="20 6 9 17 4 12" />
            )}
          </svg>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.3"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span>SkillBridge AI</span>
          </div>

          <ul className="sidebar-menu">
            <li>
              <button 
                className={`sidebar-item-link ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => setActiveTab("dashboard")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sidebar-icon">
                  <rect x="3" y="3" width="7" height="9" />
                  <rect x="14" y="3" width="7" height="5" />
                  <rect x="14" y="12" width="7" height="9" />
                  <rect x="3" y="16" width="7" height="5" />
                </svg>
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-item-link ${activeTab === "resume" ? "active" : ""}`}
                onClick={() => setActiveTab("resume")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sidebar-icon">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>Resume Analyzer</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-item-link ${activeTab === "interview" ? "active" : ""}`}
                onClick={() => setActiveTab("interview")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sidebar-icon">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Mock Interview</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-item-link ${activeTab === "mentors" ? "active" : ""}`}
                onClick={() => setActiveTab("mentors")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sidebar-icon">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Find Mentors</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-item-link ${activeTab === "resources" ? "active" : ""}`}
                onClick={() => setActiveTab("resources")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sidebar-icon">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span>Resources</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-item-link ${activeTab === "jd_matcher" ? "active" : ""}`}
                onClick={() => setActiveTab("jd_matcher")}
              >
                <span className="sidebar-icon" style={{ fontSize: "1.1rem", display: "inline-flex", width: "20px", height: "20px", alignItems: "center", justifyContent: "center" }}>🎯</span>
                <span>JD Matcher</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-item-link ${activeTab === "cover_letter" ? "active" : ""}`}
                onClick={() => setActiveTab("cover_letter")}
              >
                <span className="sidebar-icon" style={{ fontSize: "1.1rem", display: "inline-flex", width: "20px", height: "20px", alignItems: "center", justifyContent: "center" }}>✉️</span>
                <span>Cover Letter</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-item-link ${activeTab === "linkedin_analyzer" ? "active" : ""}`}
                onClick={() => setActiveTab("linkedin_analyzer")}
              >
                <span className="sidebar-icon" style={{ fontSize: "1.1rem", display: "inline-flex", width: "20px", height: "20px", alignItems: "center", justifyContent: "center" }}>🔗</span>
                <span>LinkedIn Analyzer</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-item-link ${activeTab === "profile_setup" ? "active" : ""}`}
                onClick={() => setActiveTab("profile_setup")}
              >
                <span className="sidebar-icon" style={{ fontSize: "1.1rem", display: "inline-flex", width: "20px", height: "20px", alignItems: "center", justifyContent: "center" }}>👤</span>
                <span>My Profile</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* TAB 1: Main Dashboard Overview */}
        {activeTab === "dashboard" && user && (
          <>
            {/* Welcome Banner */}
            <section className="welcome-banner">
              <div className="welcome-text">
                <h1>Welcome, {user.name} 👋</h1>
                <p>Ready to bridge your skills today? Track your career readiness, optimize your resume, and practice mock interviews to land your dream role.</p>
              </div>
              <div className="readiness-container">
                <div className="readiness-text">
                  <div className="readiness-title">Readiness</div>
                  <div className="readiness-subtitle">Career Fit</div>
                </div>
                <svg width="90" height="90" className="circular-progress-svg">
                  <circle
                    className="circle-bg"
                    cx="45"
                    cy="45"
                    r={radius}
                    strokeWidth={strokeWidth}
                  />
                  <circle
                    className="circle-fg"
                    cx="45"
                    cy="45"
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                  <text
                    x="45"
                    y="51"
                    textAnchor="middle"
                    className="circle-text"
                    transform="rotate(90 45 45)"
                  >
                    {readinessPercentage}%
                  </text>
                </svg>
              </div>
            </section>

            {/* Stats Grid */}
            <section className="stats-grid">
              {/* Card 1: ATS Score */}
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">ATS Score</span>
                  <span className="stat-value" style={{ color: "var(--stat-green)" }}>
                    {atsScoreVal > 0 ? `${atsScoreVal}%` : "No Score"}
                  </span>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: "var(--stat-green-bg)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--stat-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    <polyline points="12 12 16 8" strokeWidth="2.5" />
                    <circle cx="12" cy="12" r="1" fill="var(--stat-green)" />
                  </svg>
                </div>
              </div>

              {/* Card 2: Skills Found */}
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Skills Found</span>
                  <span className="stat-value" style={{ color: "var(--stat-blue)" }}>{skillsCount}</span>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: "var(--stat-blue-bg)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--stat-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                </div>
              </div>

              {/* Card 3: Skills Missing */}
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Skills Missing</span>
                  <span className="stat-value" style={{ color: "var(--stat-red)" }}>{missingSkillsCount}</span>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: "var(--stat-red-bg)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--stat-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
              </div>

              {/* Card 4: Interviews Done */}
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Interviews Done</span>
                  <span className="stat-value" style={{ color: "var(--stat-gold)" }}>{interviewsDone}</span>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: "var(--stat-gold-bg)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--stat-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 7l-7 5 7 5V7z" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </div>
              </div>
            </section>

            {/* Detailed Stats Cards */}
            <section className="details-grid">
              {/* Module Progress */}
              <div className="detail-card">
                <div className="card-header">
                  <h3 className="card-title">Module Progress</h3>
                  <p className="card-subtitle">Your completion progress across platform tasks</p>
                </div>
                <div className="progress-list">
                  <div className="progress-item">
                    <div className="progress-info">
                      <span className="progress-name">Resume Parsing</span>
                      <span className="progress-percentage">{atsScoreVal > 0 ? "100%" : "0%"}</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ "--target-width": atsScoreVal > 0 ? "100%" : "0%" }}></div>
                    </div>
                  </div>

                  <div className="progress-item">
                    <div className="progress-info">
                      <span className="progress-name">Skills Assessment</span>
                      <span className="progress-percentage">{atsScoreVal > 0 ? "70%" : "0%"}</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ "--target-width": atsScoreVal > 0 ? "70%" : "0%" }}></div>
                    </div>
                  </div>

                  <div className="progress-item">
                    <div className="progress-info">
                      <span className="progress-name">Mock Interview</span>
                      <span className="progress-percentage">{interviewsDone === 0 ? "0%" : interviewsDone === 1 ? "50%" : "100%"}</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ "--target-width": interviewsDone === 0 ? "0%" : interviewsDone === 1 ? "50%" : "100%" }}></div>
                    </div>
                  </div>

                  <div className="progress-item">
                    <div className="progress-info">
                      <span className="progress-name">Mentor Connect</span>
                      <span className="progress-percentage">{mentorProgressPercentage}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ "--target-width": `${mentorProgressPercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Skills */}
              <div className="detail-card">
                <div className="card-header">
                  <h3 className="card-title">Your Skills</h3>
                  <p className="card-subtitle">Verified skills associated with your profile</p>
                </div>
                {user.skills && user.skills.length > 0 ? (
                  <div className="skills-container">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="skill-chip">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "4px" }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="no-skills-msg">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="no-skills-icon">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div>
                      <h4 style={{ color: "var(--text-primary)", marginBottom: "0.25rem" }}>No skills added yet</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Analyze your resume to extract skills automatically or add them manually below.</p>
                    </div>
                  </div>
                )}

                {/* Manual Add Skill form */}
                <form onSubmit={handleAddSkill} style={{ marginTop: "auto", display: "flex", gap: "0.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem" }}>
                  <input
                    type="text"
                    placeholder="Add skill manually (e.g. React)..."
                    value={manualSkillInput}
                    onChange={(e) => setManualSkillInput(e.target.value)}
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "6px",
                      padding: "0.5rem 0.75rem",
                      color: "var(--text-primary)",
                      fontSize: "0.85rem",
                      outline: "none"
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "var(--accent-purple)",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.5rem 1rem",
                      color: "white",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Add</span>
                  </button>
                </form>
              </div>
            </section>
          </>
        )}

        {/* TAB 2: Resume Analyzer */}
        {activeTab === "resume" && (
          <div className="resume-analyzer-tab" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>Resume ATS Analyzer</h1>
              <p style={{ color: "var(--text-secondary)" }}>Upload your resume in PDF or DOCX format to verify target role match, extract key skills, and discover skill gaps.</p>
            </div>

            <div className="details-grid" style={{ gridTemplateColumns: "1.2fr 0.8fr", alignItems: "stretch" }}>
              <div className="detail-card" style={{ minHeight: "auto", justifyContent: "flex-start" }}>
                <div className="card-header" style={{ marginBottom: "1rem" }}>
                  <h3 className="card-title">Upload Resume</h3>
                  <p className="card-subtitle">Select target job role and drop your document</p>
                </div>

                <div className="auth-form" style={{ gap: "1.5rem" }}>
                  <div className="auth-input-group">
                    <label className="auth-label">Target Career Role</label>
                    <select 
                      className="auth-input" 
                      value={selectedRole} 
                      onChange={(e) => setSelectedRole(e.target.value)}
                      disabled={analyzing}
                      style={{ cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23A0AEC0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1.25rem center", backgroundSize: "1.25rem" }}
                    >
                      <option value="Frontend Developer" style={{ backgroundColor: "#151532" }}>Frontend Developer</option>
                      <option value="Backend" style={{ backgroundColor: "#151532" }}>Backend Developer</option>
                      <option value="Full Stack" style={{ backgroundColor: "#151532" }}>Full Stack Developer</option>
                    </select>
                  </div>

                  {!resumeFile ? (
                    <div 
                      className={`resume-dropzone ${isDragging ? "dragging" : ""}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("resume-input-file").click()}
                    >
                      <input 
                        type="file" 
                        id="resume-input-file" 
                        accept=".pdf,.docx" 
                        style={{ display: "none" }} 
                        onChange={handleFileChange}
                      />
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "1rem", opacity: "0.8" }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: "600", marginBottom: "0.25rem" }}>Drag & drop your resume here</h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Supports PDF, DOCX (Max 5MB)</p>
                    </div>
                  ) : (
                    <div className="resume-file-selected">
                      <div className="file-info-header">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <div style={{ flexGrow: "1", textAlign: "left" }}>
                          <h5 style={{ fontSize: "0.95rem", fontWeight: "600", wordBreak: "break-all" }}>{resumeFile.name}</h5>
                          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button className="clear-file-btn" onClick={clearFile} disabled={analyzing}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <div className="auth-error-msg" style={{ marginTop: "0" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>{uploadError}</span>
                    </div>
                  )}

                  <button
                    onClick={handleAnalyzeResume}
                    className="auth-btn"
                    style={{ marginTop: "0", width: "100%" }}
                    disabled={!resumeFile || analyzing}
                  >
                    {analyzing ? (
                      <>
                        <div className="auth-spinner"></div>
                        <span>Parsing Resume Content...</span>
                      </>
                    ) : (
                      <span>Analyze Resume</span>
                    )}
                  </button>
                </div>
              </div>

              <div className="detail-card" style={{ minHeight: "auto", justifyContent: "center", alignItems: "center", textAlign: "center", borderStyle: "dashed" }}>
                {!analysisResult && !analyzing ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "1.5rem" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(108, 99, 255, 0.05)", display: "flex", alignItems: "center", justifycontent: "center", border: "1px solid rgba(108, 99, 255, 0.1)" }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </div>
                    <div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.25rem" }}>Awaiting Analysis</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Choose your career goal and upload a file. The analyzer will calculate keywords, score, and skill gaps.</p>
                    </div>
                  </div>
                ) : analyzing ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "1.5rem" }}>
                    <div style={{ width: "70px", height: "70px", borderRadius: "50%", border: "4px solid rgba(108,99,255,0.07)", borderTop: "4px solid var(--accent1)", animation: "spin 1s linear infinite" }}></div>
                    <div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.25rem" }}>Analyzing...</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Extracting file tokens, evaluating requirements, and matching database records...</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
                    <h4 style={{ fontSize: "1rem", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "1px", fontWeight: "600" }}>ATS Score Result</h4>
                    
                    <svg width="120" height="120" className="circular-progress-svg">
                      <circle
                        className="circle-bg"
                        cx="60"
                        cy="60"
                        r={resultRadius}
                        strokeWidth={resultStrokeWidth}
                      />
                      <circle
                        className="circle-fg"
                        cx="60"
                        cy="60"
                        r={resultRadius}
                        strokeWidth={resultStrokeWidth}
                        strokeDasharray={resultCircumference}
                        strokeDashoffset={resultStrokeDashoffset}
                        style={{ stroke: resultAtsScore >= 70 ? "var(--stat-green)" : "var(--accent1)" }}
                      />
                      <text
                        x="60"
                        y="66"
                        textAnchor="middle"
                        className="circle-text"
                        style={{ fontSize: "20px" }}
                        transform="rotate(90 60 60)"
                      >
                        {resultAtsScore}%
                      </text>
                    </svg>

                    <div style={{ backgroundColor: resultAtsScore >= 70 ? "var(--stat-green-bg)" : "rgba(108, 99, 255, 0.08)", border: `1px solid ${resultAtsScore >= 70 ? "rgba(16, 185, 129, 0.2)" : "rgba(108, 99, 255, 0.2)"}`, padding: "0.5rem 1rem", borderRadius: "30px", fontSize: "0.8rem", fontWeight: "600", color: resultAtsScore >= 70 ? "var(--stat-green)" : "var(--accent1)" }}>
                      {resultAtsScore >= 70 ? "Strong Placement Match" : "Improvement Needed"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {analysisResult && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", animation: "fadeIn 0.5s ease-out" }}>
                {isDemoMode && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1.25rem", background: "rgba(255, 214, 0, 0.08)", border: "1px solid rgba(255, 214, 0, 0.2)", borderRadius: "12px", color: "#FFD600", fontSize: "0.85rem" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <span><strong>Demo Mode Active:</strong> Server API connection failed. Simulating analysis locally with high-fidelity calculations.</span>
                  </div>
                )}

                <div className="details-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div className="detail-card" style={{ minHeight: "auto", padding: "1.5rem" }}>
                    <div className="progress-item" style={{ gap: "0.35rem" }}>
                      <div className="progress-info">
                        <span className="progress-name" style={{ fontWeight: "600" }}>Keywords Match Rate</span>
                        <span className="progress-percentage">{resultAtsScore}%</span>
                      </div>
                      <div className="progress-track" style={{ height: "10px" }}>
                        <div className="progress-fill" style={{ "--target-width": `${resultAtsScore}%`, background: "linear-gradient(90deg, #6C63FF 0%, #00D4AA 100%)" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-card" style={{ minHeight: "auto", padding: "1.5rem" }}>
                    <div className="progress-item" style={{ gap: "0.35rem" }}>
                      <div className="progress-info">
                        <span className="progress-name" style={{ fontWeight: "600" }}>Skills Coverage</span>
                        <span className="progress-percentage">{Math.min(resultAtsScore + 5, 100)}%</span>
                      </div>
                      <div className="progress-track" style={{ height: "10px" }}>
                        <div className="progress-fill" style={{ "--target-width": `${Math.min(resultAtsScore + 5, 100)}%`, background: "linear-gradient(90deg, #00B0FF 0%, #00D4AA 100%)" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="details-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div className="detail-card" style={{ minHeight: "220px" }}>
                    <div className="card-header" style={{ borderBottomColor: "rgba(16, 185, 129, 0.15)" }}>
                      <h3 className="card-title" style={{ color: "var(--stat-green)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Skills Found ({analysisResult.matched.length})
                      </h3>
                      <p className="card-subtitle">These target requirements were detected in your resume</p>
                    </div>

                    <div className="skills-container" style={{ marginTop: "1rem" }}>
                      {analysisResult.matched.length > 0 ? (
                        analysisResult.matched.map((skill, idx) => (
                          <span key={idx} className="skill-chip" style={{ backgroundColor: "var(--stat-green-bg)", borderColor: "rgba(16, 185, 129, 0.3)", color: "#7FEEC9" }}>
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p style={{ fontStyle: "italic", fontSize: "0.85rem", color: "var(--text-secondary)" }}>No matching target skills found.</p>
                      )}
                    </div>
                  </div>

                  <div className="detail-card" style={{ minHeight: "220px" }}>
                    <div className="card-header" style={{ borderBottomColor: "rgba(239, 68, 68, 0.15)" }}>
                      <h3 className="card-title" style={{ color: "var(--stat-red)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Missing Skills ({analysisResult.missing.length})
                      </h3>
                      <p className="card-subtitle">Add these missing skills to your profile and resume</p>
                    </div>

                    <div className="skills-container" style={{ marginTop: "1rem" }}>
                      {analysisResult.missing.length > 0 ? (
                        analysisResult.missing.map((skill, idx) => (
                          <span key={idx} className="skill-chip" style={{ backgroundColor: "var(--stat-red-bg)", borderColor: "rgba(239, 68, 68, 0.3)", color: "#FFA1A1" }}>
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p style={{ fontStyle: "italic", fontSize: "0.85rem", color: "var(--stat-green)" }}>Great! You match all requirements.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AI Mock Interview */}
        {activeTab === "interview" && (
          <div className="mock-interview-tab" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>AI Mock Interview</h1>
              <p style={{ color: "var(--text-secondary)" }}>Select a target job profile, generate tailored interview questions, and receive detailed scores, strengths, and feedback.</p>
            </div>

            <div className="detail-card" style={{ minHeight: "auto", padding: "2rem" }}>
              <div className="card-header" style={{ marginBottom: "1rem" }}>
                <h3 className="card-title">Select Interview Role</h3>
                <p className="card-subtitle">Choose a role to generate specific technical and behavioral questions</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {["Frontend Developer", "Backend Developer", "Full Stack", "Data Scientist", "DevOps"].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={`btn-secondary ${interviewRole === role ? "btn-active-purple" : ""}`}
                    disabled={generatingQuestions || evaluatingAnswers}
                    style={{
                      padding: "0.75rem 0.5rem",
                      fontSize: "0.85rem",
                      textAlign: "center",
                      backgroundColor: interviewRole === role ? "var(--accent-purple)" : "#FFFFFF",
                      borderColor: interviewRole === role ? "var(--accent-purple)" : "var(--border-color)",
                      color: interviewRole === role ? "#FFFFFF" : "var(--text-primary)"
                    }}
                  >
                    {role === "Backend Developer" ? "Backend Dev" : role === "Frontend Developer" ? "Frontend Dev" : role}
                  </button>
                ))}
              </div>

              {/* Difficulty and Experience Selectors */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }} className="details-grid">
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Difficulty Level</label>
                  <select
                    value={interviewDifficulty}
                    onChange={(e) => {
                      setInterviewDifficulty(e.target.value);
                      setEvaluationResults(null);
                    }}
                    disabled={generatingQuestions || evaluatingAnswers}
                    className="auth-input"
                    style={{ 
                      width: "100%", 
                      padding: "0.75rem 1rem", 
                      borderRadius: "8px", 
                      backgroundColor: "#FFFFFF", 
                      border: "1px solid var(--border-color)", 
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      outline: "none"
                    }}
                  >
                    <option value="Beginner" style={{ color: "var(--text-primary)" }}>Beginner</option>
                    <option value="Intermediate" style={{ color: "var(--text-primary)" }}>Intermediate</option>
                    <option value="Advanced" style={{ color: "var(--text-primary)" }}>Advanced</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Experience Level</label>
                  <select
                    value={interviewExperience}
                    onChange={(e) => {
                      setInterviewExperience(e.target.value);
                      setEvaluationResults(null);
                    }}
                    disabled={generatingQuestions || evaluatingAnswers}
                    className="auth-input"
                    style={{ 
                      width: "100%", 
                      padding: "0.75rem 1rem", 
                      borderRadius: "8px", 
                      backgroundColor: "#FFFFFF", 
                      border: "1px solid var(--border-color)", 
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      outline: "none"
                    }}
                  >
                    <option value="Fresher" style={{ color: "var(--text-primary)" }}>Fresher (0-1 Years)</option>
                    <option value="Mid-Level" style={{ color: "var(--text-primary)" }}>Mid-Level (1-3 Years)</option>
                    <option value="Senior" style={{ color: "var(--text-primary)" }}>Senior (3+ Years)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateQuestions}
                className="auth-btn"
                style={{ width: "100%", marginTop: "0" }}
                disabled={generatingQuestions || evaluatingAnswers}
              >
                {generatingQuestions ? (
                  <>
                    <div className="auth-spinner"></div>
                    <span>Generating Tailored Questions...</span>
                  </>
                ) : (
                  <span>Generate Questions</span>
                )}
              </button>
              {interviewQuestions.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                {/* Part 1: MCQs rendering */}
                {interviewMcqs.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--accent-purple)", textTransform: "uppercase", letterSpacing: "1px" }}>Part 1: Multiple Choice Questions</span>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>Test Your Core Concepts</h3>
                    </div>

                    {interviewMcqs.map((mcq, mcqIdx) => (
                      <div key={mcqIdx} className="detail-card" style={{ minHeight: "auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                          <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(108, 99, 255, 0.08)", border: "1px solid rgba(108, 99, 255, 0.2)", color: "#A8A2FF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "0.8rem", flexShrink: "0" }}>
                            {mcqIdx + 1}
                          </div>
                          <h4 style={{ fontSize: "1.05rem", fontWeight: "600", lineHeight: "1.4", margin: "0" }}>{mcq.question}</h4>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.5rem" }} className="details-grid">
                          {mcq.options.map((option, optIdx) => {
                            const optionCode = option.charAt(0);
                            const isSelected = mcqAnswers[mcqIdx] === optionCode;
                            
                            let borderStyle = "1px solid var(--border-color)";
                            let bgStyle = "transparent";
                            if (evaluationResults) {
                              const wasCorrect = mcq.correct === optionCode;
                              if (wasCorrect) {
                                borderStyle = "1px solid rgba(16, 185, 129, 0.4)";
                                bgStyle = "rgba(16, 185, 129, 0.05)";
                              } else if (isSelected) {
                                borderStyle = "1px solid rgba(239, 68, 68, 0.4)";
                                bgStyle = "rgba(239, 68, 68, 0.05)";
                              }
                            } else if (isSelected) {
                              borderStyle = "1px solid var(--accent-purple)";
                              bgStyle = "rgba(108, 99, 255, 0.05)";
                            }

                            return (
                              <label 
                                key={optIdx} 
                                style={{ 
                                  display: "flex", 
                                  alignItems: "center", 
                                  gap: "0.75rem", 
                                  padding: "0.85rem 1rem", 
                                  borderRadius: "8px", 
                                  border: borderStyle, 
                                  backgroundColor: bgStyle,
                                  cursor: evaluationResults ? "default" : "pointer",
                                  transition: "all 0.2s ease"
                                }}
                              >
                                <input 
                                  type="radio" 
                                  name={`mcq-${mcqIdx}`}
                                  checked={isSelected}
                                  disabled={evaluatingAnswers || evaluationResults}
                                  onChange={() => setMcqAnswers({ ...mcqAnswers, [mcqIdx]: optionCode })}
                                  style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--accent-purple)" }}
                                />
                                <span style={{ fontSize: "0.9rem", color: isSelected ? "#FFFFFF" : "var(--text-secondary)" }}>{option}</span>
                              </label>
                            );
                          })}
                        </div>

                        {evaluationResults && (
                          <div style={{ 
                            fontSize: "0.85rem", 
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            color: mcqAnswers[mcqIdx] === mcq.correct ? "var(--stat-green)" : "var(--stat-red)" 
                          }}>
                            {mcqAnswers[mcqIdx] === mcq.correct ? (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Correct</span>
                              </>
                            ) : (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                <span>Incorrect (Correct answer: {mcq.correct})</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Part 2: Theory rendering */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--accent-purple)", textTransform: "uppercase", letterSpacing: "1px" }}>Part 2: Technical & Conceptual Questions</span>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>Explain Core Architecture</h3>
                  </div>

                  {interviewQuestions.map((question, index) => (
                    <div key={index} className="detail-card" style={{ minHeight: "auto", padding: "2rem", gap: "1.25rem" }}>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "var(--accent-purple-light)", border: "1px solid var(--accent-purple-border)", color: "#A8A2FF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "0.9rem", flexShrink: "0" }}>
                          {index + 1}
                        </div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: "600", lineHeight: "1.5", marginTop: "0.2rem" }}>{question}</h4>
                      </div>

                      <div className="auth-input-group">
                        <textarea
                          rows="4"
                          placeholder="Type your answer here... (minimum 15 characters recommended for detailed analysis)"
                          className="auth-input"
                          value={interviewAnswers[index]}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          disabled={evaluatingAnswers || evaluationResults}
                          style={{ resize: "vertical", fontFamily: "var(--font-sans)", lineHeight: "1.5", padding: "1rem" }}
                        />
                      </div>

                      {evaluationResults && evaluationResults.evaluations[index] && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "rgba(255,255,255,0.01)", marginTop: "0.5rem", animation: "fadeIn 0.4s ease" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.5px" }}>Assessment</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: "700", color: evaluationResults.evaluations[index].score >= 70 ? "var(--stat-green)" : "var(--accent-purple)" }}>
                              Score: {evaluationResults.evaluations[index].score}/100
                            </div>
                          </div>

                          <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)", lineHeight: "1.5" }}>
                            <strong>Feedback:</strong> {evaluationResults.evaluations[index].feedback}
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.85rem", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "0.75rem" }}>
                            <div>
                              <span style={{ color: "var(--stat-green)", fontWeight: "600", display: "block", marginBottom: "0.15rem" }}>✓ Key Strengths</span>
                              <span style={{ color: "var(--text-secondary)", lineHeight: "1.4" }}>{evaluationResults.evaluations[index].strengths}</span>
                            </div>
                            <div>
                              <span style={{ color: "#FF9100", fontWeight: "600", display: "block", marginBottom: "0.15rem" }}>⚙ Areas for Improvement</span>
                              <span style={{ color: "var(--text-secondary)", lineHeight: "1.4" }}>{evaluationResults.evaluations[index].improvements}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {interviewFeedbackError && (
                  <div className="auth-error-msg" style={{ margin: "0" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{interviewFeedbackError}</span>
                  </div>
                )}

                {!evaluationResults ? (
                  <button
                    onClick={handleSubmitAllAnswers}
                    className="auth-btn"
                    style={{ width: "100%", padding: "1.1rem", fontSize: "1.05rem" }}
                    disabled={evaluatingAnswers}
                  >
                    {evaluatingAnswers ? (
                      <>
                        <div className="auth-spinner"></div>
                        <span>Evaluating Answers...</span>
                      </>
                    ) : (
                      <span>Submit All Answers</span>
                    )}
                  </button>
                ) : (
                  <div className="detail-card" style={{ minHeight: "auto", padding: "2.5rem", alignItems: "center", textAlign: "center", border: "2px solid var(--accent-purple)", background: "linear-gradient(135deg, rgba(108, 99, 255, 0.08) 0%, rgba(0, 212, 170, 0.03) 100%)", gap: "1.5rem" }}>
                    <h3 style={{ fontSize: "1.25rem", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "1.5px", fontWeight: "600" }}>Overall Mock Interview Result</h3>
                    <div style={{ fontSize: "4.5rem", fontWeight: "800", color: evaluationResults.averageScore >= 70 ? "var(--stat-green)" : "var(--accent-purple)", lineHeight: "1" }}>
                      {evaluationResults.averageScore}%
                    </div>
                    
                    <div style={{ display: "flex", gap: "2rem", margin: "0.5rem 0" }} className="details-grid">
                      <div>
                        <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--stat-green)" }}>{evaluationResults.correctCount}/{evaluationResults.totalMcqs}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>MCQs Correct</div>
                      </div>
                      <div style={{ borderRight: "1px solid var(--border-color)" }}></div>
                      <div>
                        <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--accent-purple)" }}>{evaluationResults.theoryScore}%</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Theory Score</div>
                      </div>
                    </div>

                    <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                      {evaluationResults.averageScore >= 80 ? "Excellent Performance!" : evaluationResults.averageScore >= 65 ? "Good start! Keep improving." : "Needs core conceptual revisions."}
                    </div>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "550px" }}>
                      We updated your interviews metric. Generate questions again or select a new profile to continue practicing!
                    </p>
                    <button
                      onClick={handleGenerateQuestions}
                      className="btn-accent"
                      style={{ marginTop: "1rem" }}
                    >
                      Start New Practice
                    </button>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        )}

        {/* TAB 4: Find Mentors Section */}
        {activeTab === "mentors" && (
          <div className="find-mentors-tab" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>Connect with Mentors</h1>
              <p style={{ color: "var(--text-secondary)" }}>Book one-on-one preparation sessions with verified industry experts and placement alumni.</p>
            </div>

            <div className="details-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {MENTORS_DATA.map((mentor, index) => (
                <div key={index} className="detail-card mentor-card" style={{ minHeight: "auto", padding: "1.75rem", flexDirection: "row", gap: "1.25rem", alignItems: "center" }}>
                  <div className="mentor-avatar" style={{ backgroundColor: mentor.avatarBg }}>
                    {mentor.initials}
                  </div>
                  
                  <div style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "0.25rem", textAlign: "left" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4 style={{ fontSize: "1.15rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {mentor.name}
                        {mentor.linkedin && (
                          <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "#0A66C2", display: "inline-flex", transition: "opacity 0.2s" }} className="mentor-linkedin-link">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                      </h4>
                      <span style={{ color: "var(--stat-gold)", fontSize: "0.9rem", fontWeight: "700" }}>★ {mentor.rating}</span>
                    </div>

                    <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: "500" }}>{mentor.role} <span style={{ color: "var(--text-secondary)", fontWeight: "400" }}>at</span> {mentor.company}</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{mentor.experience} Years Experience</p>

                    <div className="skills-container" style={{ gap: "0.4rem", marginTop: "0.5rem" }}>
                      {mentor.skills.map((skill, idx) => (
                        <span key={idx} className="skill-chip" style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", backgroundColor: "rgba(255, 255, 255, 0.03)", borderColor: "rgba(255, 255, 255, 0.08)", color: "var(--text-secondary)" }}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleConnectMentor(mentor.name)}
                      className="btn-primary"
                      disabled={connectedMentors.includes(mentor.name)}
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.5rem 1rem",
                        marginTop: "1rem",
                        width: "fit-content",
                        alignSelf: "flex-start",
                        backgroundColor: connectedMentors.includes(mentor.name) ? "rgba(0, 212, 170, 0.15)" : "var(--accent-purple)",
                        borderColor: connectedMentors.includes(mentor.name) ? "rgba(0, 212, 170, 0.3)" : "var(--accent-purple)",
                        color: connectedMentors.includes(mentor.name) ? "var(--stat-green)" : "#FFFFFF",
                        cursor: connectedMentors.includes(mentor.name) ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem"
                      }}
                    >
                      {connectedMentors.includes(mentor.name) ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Requested</span>
                        </>
                      ) : (
                        <span>Connect</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Resources Section */}
        {activeTab === "resources" && (
          <div className="resources-tab" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>Learning Resources</h1>
              <p style={{ color: "var(--text-secondary)" }}>Boost your placement readiness by studying official documentations, roadmaps, and coding challenges.</p>
            </div>

            <div className="details-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {RESOURCES_DATA.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-card resource-card-link"
                  style={{ textDecoration: "none", minHeight: "auto", padding: "1.75rem", flexDirection: "row", gap: "1.25rem", alignItems: "center", cursor: "pointer", transition: "transform 0.2s ease, border-color 0.2s ease" }}
                >
                  <div className="resource-icon-circle" style={{ backgroundColor: `${resource.color}15`, border: `1px solid ${resource.color}35`, color: resource.color }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>

                  <div style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "0.25rem", textAlign: "left" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-primary)" }}>{resource.title}</h4>
                      <span className="resource-badge-free">FREE</span>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.5", marginTop: "0.25rem" }}>{resource.subtitle}</p>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: resource.color, fontSize: "0.8rem", fontWeight: "600", marginTop: "0.75rem" }}>
                      <span>View Documentation</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: JD Matcher Section */}
        {activeTab === "jd_matcher" && (
          <div className="jd-matcher-tab" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", letterSpacing: "1.5px", color: "var(--stat-green)", textTransform: "uppercase" }}>Job Description Matcher</span>
              <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>See How Well You Match Any Job</h1>
            </div>

            <div className="detail-card" style={{ minHeight: "auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="card-header" style={{ marginBottom: "0.5rem" }}>
                <p className="card-subtitle" style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  Paste a job description from LinkedIn, Naukri, or any company page to automatically extract target technical keywords, match them against your profile, and identify skill gaps.
                </p>
              </div>

              <div className="auth-input-group">
                <textarea
                  rows="8"
                  placeholder="Paste the full job description here... (from LinkedIn, Naukri, or any company website)"
                  className="auth-input"
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  disabled={jdAnalyzing}
                  style={{
                    minHeight: "180px",
                    resize: "vertical",
                    fontFamily: "var(--font-sans)",
                    lineHeight: "1.6",
                    padding: "1.25rem",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    outline: "none",
                    borderRadius: "8px",
                    width: "100%",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {jdError && (
                <div style={{ color: "var(--stat-red)", fontSize: "0.85rem", fontWeight: "500" }}>
                  {jdError}
                </div>
              )}

              <button
                onClick={handleAnalyzeJD}
                className="auth-btn"
                disabled={jdAnalyzing}
                style={{
                  width: "fit-content",
                  padding: "0.8rem 2rem",
                  background: "linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  borderRadius: "8px",
                  color: "white"
                }}
              >
                {jdAnalyzing ? (
                  <>
                    <div className="auth-spinner"></div>
                    <span>Analyzing Job Description...</span>
                  </>
                ) : (
                  <span>Analyze Match →</span>
                )}
              </button>
            </div>

            {jdResult && (
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem", animation: "fadeIn 0.5s ease-out" }}>

                <div className="details-grid" style={{ gridTemplateColumns: "0.9fr 1.1fr", gap: "1.5rem" }}>
                  {/* Circle progress ring match score */}
                  <div className="detail-card" style={{ minHeight: "auto", padding: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.25rem", textAlign: "center" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>Match Rate</span>
                    
                    <div style={{ position: "relative", width: "120px", height: "120px" }}>
                      <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="transparent"
                          stroke="rgba(255,255,255,0.03)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="transparent"
                          stroke={jdResult.matchScore >= 70 ? "var(--stat-green)" : jdResult.matchScore >= 50 ? "var(--stat-gold)" : "var(--stat-red)"}
                          strokeWidth="8"
                          strokeDasharray={282.7}
                          strokeDashoffset={282.7 * (1 - jdResult.matchScore / 100)}
                          style={{ transition: "stroke-dashoffset 1s ease" }}
                        />
                      </svg>
                      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "1.75rem", fontWeight: "800", color: "var(--text-primary)" }}>
                        {jdResult.matchScore}%
                      </div>
                    </div>

                    <div style={{ fontSize: "1.2rem", fontWeight: "700", color: jdResult.matchScore >= 70 ? "var(--stat-green)" : jdResult.matchScore >= 50 ? "var(--stat-gold)" : "var(--stat-red)" }}>
                      {jdResult.matchScore >= 70 ? "Strong Match!" : jdResult.matchScore >= 50 ? "Partial Match" : "Low Match"}
                    </div>
                  </div>

                  {/* side by side list have and need */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                    <div className="detail-card" style={{ minHeight: "220px", padding: "1.5rem" }}>
                      <div className="card-header" style={{ borderBottom: "1px solid rgba(16, 185, 129, 0.15)", paddingBottom: "0.5rem" }}>
                        <h4 style={{ color: "var(--stat-green)", display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "1rem", fontWeight: "700" }}>
                          You Have ✓
                        </h4>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Detected matching skills</p>
                      </div>

                      <div className="skills-container" style={{ marginTop: "1rem" }}>
                        {jdResult.matched.length > 0 ? (
                          jdResult.matched.map((skill, idx) => (
                            <span key={idx} className="skill-chip" style={{ color: "var(--stat-green)", backgroundColor: "var(--stat-green-bg)", borderColor: "rgba(16, 185, 129, 0.25)", fontSize: "0.75rem" }}>
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontStyle: "italic" }}>None matched yet</span>
                        )}
                      </div>
                    </div>

                    <div className="detail-card" style={{ minHeight: "220px", padding: "1.5rem" }}>
                      <div className="card-header" style={{ borderBottom: "1px solid rgba(239, 68, 68, 0.15)", paddingBottom: "0.5rem" }}>
                        <h4 style={{ color: "var(--stat-red)", display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "1rem", fontWeight: "700" }}>
                          You Need ✗
                        </h4>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Missing qualifications</p>
                      </div>

                      <div className="skills-container" style={{ marginTop: "1rem" }}>
                        {jdResult.missing.length > 0 ? (
                          jdResult.missing.map((skill, idx) => (
                            <span key={idx} className="skill-chip" style={{ color: "var(--stat-red)", backgroundColor: "var(--stat-red-bg)", borderColor: "rgba(239, 68, 68, 0.25)", fontSize: "0.75rem" }}>
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontStyle: "italic" }}>All skills matched!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* recommendation box */}
                <div className="detail-card" style={{ minHeight: "auto", padding: "1.75rem", borderLeft: `4px solid ${jdResult.matchScore >= 70 ? "var(--stat-green)" : jdResult.matchScore >= 50 ? "var(--stat-gold)" : "var(--stat-red)"}`, backgroundColor: "rgba(255,255,255,0.01)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "700", letterSpacing: "1px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Preparation Strategy</span>
                    <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: "1.6", margin: "0" }}>
                      {jdResult.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: Cover Letter Section */}
        {activeTab === "cover_letter" && (
          <div className="cover-letter-tab" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", letterSpacing: "1.5px", color: "var(--stat-green)", textTransform: "uppercase" }}>AI Cover Letter Generator</span>
              <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>Write the Perfect Cover Letter</h1>
            </div>

            <div className="detail-card" style={{ minHeight: "auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="card-header" style={{ marginBottom: "0.5rem" }}>
                <p className="card-subtitle" style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  Enter the company details and position you are applying for. The generator will customize a 3-paragraph letter incorporating the skills on your profile.
                </p>
              </div>

              {/* Form Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div className="auth-input-group">
                  <label className="auth-label">Company Name</label>
                  <input 
                    type="text"
                    className="auth-input"
                    placeholder="Google, Infosys, TCS..."
                    value={clCompany}
                    onChange={(e) => setClCompany(e.target.value)}
                    disabled={clGenerating}
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                </div>
                <div className="auth-input-group">
                  <label className="auth-label">Job Role</label>
                  <input 
                    type="text"
                    className="auth-input"
                    placeholder="Frontend Developer, Software Engineer..."
                    value={clRole}
                    onChange={(e) => setClRole(e.target.value)}
                    disabled={clGenerating}
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                </div>
                <div className="auth-input-group">
                  <label className="auth-label">Your Experience</label>
                  <select
                    className="auth-input"
                    value={clExperience}
                    onChange={(e) => setClExperience(e.target.value)}
                    disabled={clGenerating}
                    style={{ cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23A0AEC0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1.25rem center", backgroundSize: "1.25rem", width: "100%", boxSizing: "border-box" }}
                  >
                    <option value="Fresher" style={{ backgroundColor: "#151532" }}>Fresher</option>
                    <option value="0-1 years" style={{ backgroundColor: "#151532" }}>0-1 years</option>
                    <option value="1-2 years" style={{ backgroundColor: "#151532" }}>1-2 years</option>
                    <option value="2-3 years" style={{ backgroundColor: "#151532" }}>2-3 years</option>
                  </select>
                </div>
                <div className="auth-input-group">
                  <label className="auth-label">Tone</label>
                  <select
                    className="auth-input"
                    value={clTone}
                    onChange={(e) => setClTone(e.target.value)}
                    disabled={clGenerating}
                    style={{ cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23A0AEC0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1.25rem center", backgroundSize: "1.25rem", width: "100%", boxSizing: "border-box" }}
                  >
                    <option value="Professional" style={{ backgroundColor: "#151532" }}>Professional</option>
                    <option value="Enthusiastic" style={{ backgroundColor: "#151532" }}>Enthusiastic</option>
                    <option value="Creative" style={{ backgroundColor: "#151532" }}>Creative</option>
                  </select>
                </div>
              </div>

              {clError && (
                <div style={{ color: "var(--stat-red)", fontSize: "0.85rem", fontWeight: "500" }}>
                  {clError}
                </div>
              )}

              <button
                onClick={handleGenerateCoverLetter}
                className="auth-btn"
                disabled={clGenerating}
                style={{
                  width: "fit-content",
                  padding: "0.8rem 2rem",
                  background: "linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  borderRadius: "8px",
                  color: "white"
                }}
              >
                {clGenerating ? (
                  <>
                    <div className="auth-spinner"></div>
                    <span>Generating Cover Letter...</span>
                  </>
                ) : (
                  <span>Generate Cover Letter →</span>
                )}
              </button>
            </div>

            {clResult && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", animation: "fadeIn 0.5s ease-out" }}>

                <div className="detail-card" style={{ minHeight: "auto", padding: "2rem", position: "relative", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Top-Right Copy Button */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(clResult);
                      triggerToast("Copied to clipboard!", "success");
                    }}
                    style={{
                      position: "absolute",
                      top: "1.5rem",
                      right: "1.5rem",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "6px",
                      padding: "0.5rem 0.75rem",
                      color: "var(--text-secondary)",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      transition: "background 0.2s ease, color 0.2s ease"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"; e.currentTarget.style.color = "#FFFFFF"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Copy</span>
                  </button>

                  <div className="card-header" style={{ marginBottom: "0.5rem", paddingRight: "5rem" }}>
                    <h3 className="card-title">Generated Cover Letter</h3>
                    <p className="card-subtitle">Customized for {clCompany} - {clRole}</p>
                  </div>

                  {/* Cover Letter Content Display */}
                  <div style={{
                    maxHeight: "500px",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    fontFamily: "var(--font-sans)",
                    lineHeight: "1.7",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    textAlign: "left",
                    padding: "1.25rem",
                    backgroundColor: "var(--bg-primary)",
                    borderRadius: "6px",
                    border: "1px solid var(--border-color)",
                    boxSizing: "border-box",
                    width: "100%"
                  }}>
                    {clResult}
                  </div>

                  {/* Bottom Actions */}
                  <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
                    <button
                      onClick={handleGenerateCoverLetter}
                      className="btn-accent"
                      disabled={clGenerating}
                      style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" />
                        <polyline points="1 20 1 14 7 14" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                      </svg>
                      <span>Regenerate</span>
                    </button>

                    <button
                      onClick={() => {
                        const element = document.createElement("a");
                        const file = new Blob([clResult], {type: 'text/plain'});
                        element.href = URL.createObjectURL(file);
                        element.download = `Cover_Letter_${clCompany.replace(/\s+/g, '_')}.txt`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                        triggerToast("Downloaded Cover Letter!", "success");
                      }}
                      className="btn-secondary"
                      style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <span>Download as TXT</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: Profile Setup Section */}
        {activeTab === "profile_setup" && user && (
          <div className="profile-setup-tab" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", letterSpacing: "1.5px", color: "var(--stat-green)", textTransform: "uppercase" }}>Profile Customization</span>
              <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>Manage Your Shareable Portfolio</h1>
            </div>

            <div className="detail-card" style={{ minHeight: "auto", padding: "2.5rem" }}>
              <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                
                <div className="auth-input-group">
                  <label className="auth-label" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Choose Username</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: "normal" }}>Letters, numbers, underscores only</span>
                  </label>
                  <input 
                    type="text"
                    className="auth-input"
                    placeholder="e.g. johndoe_dev"
                    value={pfUsername}
                    onChange={(e) => setPfUsername(e.target.value)}
                    disabled={pfSaving}
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.5rem", marginBottom: "0" }}>
                    Your portfolio will be live at: <strong style={{ color: "var(--accent-purple)" }}>localhost:3000/profile/{pfUsername || "[username]"}</strong>
                  </p>
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">Target Career Role</label>
                  <select
                    className="auth-input"
                    value={pfTargetRole}
                    onChange={(e) => setPfTargetRole(e.target.value)}
                    disabled={pfSaving}
                    style={{ cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23A0AEC0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1.25rem center", backgroundSize: "1.25rem", width: "100%", boxSizing: "border-box" }}
                  >
                    <option value="Frontend Developer" style={{ backgroundColor: "#151532" }}>Frontend Developer</option>
                    <option value="Backend" style={{ backgroundColor: "#151532" }}>Backend Developer</option>
                    <option value="Full Stack" style={{ backgroundColor: "#151532" }}>Full Stack Developer</option>
                  </select>
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">Short Biography</label>
                  <textarea
                    rows="4"
                    placeholder="Write a short bio about yourself..."
                    className="auth-input"
                    value={pfBio}
                    onChange={(e) => setPfBio(e.target.value)}
                    disabled={pfSaving}
                    style={{ resize: "vertical", fontFamily: "var(--font-sans)", lineHeight: "1.5", padding: "1rem", width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.5rem 0" }}>
                  <input 
                    type="checkbox" 
                    id="make-public-toggle"
                    checked={pfIsPublic}
                    onChange={(e) => setPfIsPublic(e.target.checked)}
                    disabled={pfSaving}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <label htmlFor="make-public-toggle" style={{ color: "var(--text-primary)", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer" }}>
                    Make profile public (visible to anyone with your link)
                  </label>
                </div>

                {pfError && (
                  <div style={{ color: "var(--stat-red)", fontSize: "0.85rem", fontWeight: "500" }}>
                    {pfError}
                  </div>
                )}

                <button
                  type="submit"
                  className="auth-btn"
                  disabled={pfSaving}
                  style={{
                    width: "fit-content",
                    padding: "0.8rem 2.5rem",
                    background: "linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer",
                    borderRadius: "8px",
                    color: "white"
                  }}
                >
                  {pfSaving ? (
                    <>
                      <div className="auth-spinner"></div>
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <span>Save Profile</span>
                  )}
                </button>
              </form>
            </div>

            {pfSavedLink && (
              <div className="detail-card" style={{ minHeight: "auto", padding: "2rem", border: "1px solid rgba(16, 185, 129, 0.2)", background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(0, 0, 0, 0) 100%)", display: "flex", flexDirection: "column", gap: "1.25rem", animation: "fadeIn 0.4s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--stat-green)", fontWeight: "700" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Profile Live!</span>
                </div>
                
                <p style={{ margin: "0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  Your portfolio is live and shareable. Share this link with employers, recruiters, or friends:
                </p>

                <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                  <input 
                    type="text"
                    className="auth-input"
                    readOnly
                    value={pfSavedLink}
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)", cursor: "default" }}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pfSavedLink);
                      triggerToast("Link copied to clipboard!", "success");
                    }}
                    className="btn-accent"
                    style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0 1.5rem" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Copy Link</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 9: LinkedIn Analyzer Section */}
        {activeTab === "linkedin_analyzer" && user && (
          <div className="linkedin-analyzer-tab" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", letterSpacing: "1.5px", color: "var(--stat-green)", textTransform: "uppercase" }}>LinkedIn Profile Analyzer</span>
              <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>Optimize Your LinkedIn Profile</h1>
            </div>

            <div style={{ 
              backgroundColor: "rgba(108, 99, 255, 0.08)", 
              border: "1px solid rgba(108, 99, 255, 0.2)", 
              borderRadius: "12px", 
              padding: "1.5rem", 
              color: "var(--text-primary)"
            }}>
              <h4 style={{ margin: "0 0 0.75rem 0", color: "#A8A2FF", fontWeight: "700", fontSize: "1.05rem" }}>How to analyze your profile for free:</h4>
              <ul style={{ margin: "0", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem", lineHeight: "1.5" }}>
                <li><strong>Step 1:</strong> Open your LinkedIn profile in your web browser.</li>
                <li><strong>Step 2:</strong> Press <kbd style={{ background: "rgba(255,255,255,0.1)", padding: "0.2rem 0.4rem", borderRadius: "4px" }}>Ctrl + A</kbd> (to select all) and then <kbd style={{ background: "rgba(255,255,255,0.1)", padding: "0.2rem 0.4rem", borderRadius: "4px" }}>Ctrl + C</kbd> (to copy everything).</li>
                <li><strong>Step 3:</strong> Paste the copied text inside the input box below and click <strong>Analyze My LinkedIn</strong>.</li>
              </ul>
            </div>

            <div className="detail-card" style={{ minHeight: "auto", padding: "2.5rem" }}>
              <form onSubmit={handleAnalyzeLinkedIn} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div className="auth-input-group">
                  <label className="auth-label">Pasted Profile Text</label>
                  <textarea
                    rows="8"
                    placeholder="Paste your full LinkedIn profile text here..."
                    className="auth-input"
                    value={liText}
                    onChange={(e) => setLiText(e.target.value)}
                    disabled={liAnalyzing}
                    style={{ 
                      minHeight: "200px", 
                      resize: "vertical", 
                      fontFamily: "var(--font-sans)", 
                      lineHeight: "1.5", 
                      padding: "1rem", 
                      width: "100%", 
                      boxSizing: "border-box" 
                    }}
                  />
                </div>

                {liError && (
                  <div style={{ color: "var(--stat-red)", fontSize: "0.85rem", fontWeight: "500" }}>
                    {liError}
                  </div>
                )}

                <button
                   type="submit"
                   className="auth-btn"
                   disabled={liAnalyzing}
                   style={{
                     width: "fit-content",
                     padding: "0.8rem 2.5rem",
                     background: "linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)",
                     border: "none",
                     fontWeight: "600",
                     cursor: "pointer",
                     borderRadius: "8px",
                     color: "white"
                   }}
                >
                  {liAnalyzing ? (
                    <>
                      <div className="auth-spinner"></div>
                      <span>Analyzing Profile...</span>
                    </>
                  ) : (
                    <span>Analyze My LinkedIn →</span>
                  )}
                </button>
              </form>
            </div>




            {liResult && (
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem", animation: "fadeIn 0.5s ease" }}>
                
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: "1.5rem" }} className="details-grid">
                  
                  <div className="detail-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "2rem", textAlign: "center" }}>
                    <h3 style={{ margin: "0", fontSize: "1.1rem", fontWeight: "700" }}>Profile Strength</h3>
                    <div style={{ position: "relative", width: "150px", height: "150px" }}>
                      <svg width="150" height="150" style={{ transform: "rotate(-90deg)" }}>
                        <circle
                          cx="75"
                          cy="75"
                          r="60"
                          fill="transparent"
                          stroke="rgba(255,255,255,0.03)"
                          strokeWidth="10"
                        />
                        <circle
                          cx="75"
                          cy="75"
                          r="60"
                          fill="transparent"
                          stroke={liResult.overallScore >= 75 ? "#00D4AA" : liResult.overallScore >= 50 ? "#FFA116" : "#EF4444"}
                          strokeWidth="10"
                          strokeDasharray={2 * Math.PI * 60}
                          strokeDashoffset={(2 * Math.PI * 60) * (1 - liResult.overallScore / 100)}
                          style={{ strokeLinecap: "round", transition: "stroke-dashoffset 1s ease-out" }}
                        />
                      </svg>
                      <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "2.25rem",
                        fontWeight: "800",
                        color: "var(--text-primary)"
                      }}>
                        {liResult.overallScore}
                      </div>
                    </div>
                    <span style={{ 
                      color: liResult.overallScore >= 75 ? "#00D4AA" : liResult.overallScore >= 50 ? "#FFA116" : "#EF4444",
                      fontWeight: "700",
                      fontSize: "0.95rem"
                    }}>
                      {liResult.overallScore >= 75 ? "Excellent Profile" : liResult.overallScore >= 50 ? "Needs Improvement" : "Weak Profile"}
                    </span>
                  </div>

                  <div className="detail-card" style={{ display: "flex", flexDirection: "column", gap: "1.15rem", padding: "2rem" }}>
                    <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: "700" }}>Section Breakdown</h3>
                    {[
                      { label: "Headline", score: liResult.headlineScore },
                      { label: "About Section", score: liResult.aboutScore },
                      { label: "Skills", score: liResult.skillsScore },
                      { label: "Experience", score: liResult.experienceScore },
                      { label: "Projects", score: liResult.projectsScore },
                      { label: "Education", score: liResult.educationScore },
                      { label: "Certifications", score: liResult.certificationsScore }
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "600" }}>
                          <span style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                          <span style={{ color: item.score >= 75 ? "#00D4AA" : item.score >= 50 ? "#FFA116" : "#EF4444" }}>{item.score}%</span>
                        </div>
                        <div style={{ height: "6px", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ 
                            width: `${item.score}%`, 
                            height: "100%", 
                            backgroundColor: item.score >= 75 ? "#00D4AA" : item.score >= 50 ? "#FFA116" : "#EF4444",
                            borderRadius: "4px",
                            transition: "width 0.8s ease" 
                          }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="details-grid">
                  
                  <div className="detail-card" style={{ 
                    border: "1px solid rgba(239, 68, 68, 0.2)", 
                    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(0, 0, 0, 0) 100%)", 
                    padding: "2rem" 
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#EF4444", fontWeight: "700", marginBottom: "1.25rem" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>Issues to Fix</span>
                    </div>
                    <ul style={{ margin: "0", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                      {liResult.issues && liResult.issues.length > 0 ? (
                        liResult.issues.map((issue, idx) => (
                          <li key={idx}>{issue}</li>
                        ))
                      ) : (
                        <li>No significant issues found! Looking good.</li>
                      )}
                    </ul>
                  </div>

                  <div className="detail-card" style={{ 
                    border: "1px solid rgba(16, 185, 129, 0.2)", 
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(0, 0, 0, 0) 100%)", 
                    padding: "2rem" 
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10B981", fontWeight: "700", marginBottom: "1.25rem" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>What is Good</span>
                    </div>
                    <ul style={{ margin: "0", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                      {liResult.strengths && liResult.strengths.length > 0 ? (
                        liResult.strengths.map((strength, idx) => (
                          <li key={idx}>{strength}</li>
                        ))
                      ) : (
                        <li>No strengths highlighted yet. Try adding more profile sections.</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  
                  <div className="detail-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#A8A2FF", textTransform: "uppercase", letterSpacing: "1px" }}>AI Suggested Headline</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(liResult.suggestedHeadline);
                          triggerToast("Headline copied!", "success");
                        }}
                        className="btn-accent"
                        style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 1rem", fontSize: "0.8rem", borderRadius: "6px" }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copy</span>
                      </button>
                    </div>
                    <div style={{ 
                      backgroundColor: "var(--bg-primary)", 
                      border: "1px solid var(--border-color)", 
                      borderRadius: "8px", 
                      padding: "1.25rem", 
                      fontSize: "1.1rem", 
                      fontWeight: "600",
                      lineHeight: "1.4",
                      color: "var(--text-primary)"
                    }}>
                      {liResult.suggestedHeadline}
                    </div>
                  </div>

                  <div className="detail-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>AI Suggested About Section</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(liResult.suggestedAbout);
                          triggerToast("About section copied!", "success");
                        }}
                        className="btn-accent"
                        style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 1rem", fontSize: "0.8rem", borderRadius: "6px" }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copy</span>
                      </button>
                    </div>
                    <div style={{ 
                      backgroundColor: "var(--bg-primary)", 
                      border: "1px solid var(--border-color)", 
                      borderRadius: "8px", 
                      padding: "1.25rem", 
                      fontSize: "0.95rem", 
                      lineHeight: "1.6",
                      color: "var(--text-primary)"
                    }}>
                      {liResult.suggestedAbout}
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default Dashboard;