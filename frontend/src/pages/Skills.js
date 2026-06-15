import { useState, useEffect } from "react";

function Skills() {
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const savedSkills = JSON.parse(localStorage.getItem("skills")) || [];
    setSkills(savedSkills);
  }, []);

  const addSkill = () => {
    if (skill.trim() === "") return;

    const updatedSkills = [...skills, skill];

    setSkills(updatedSkills);
    localStorage.setItem("skills", JSON.stringify(updatedSkills));

    setSkill("");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Add Your Skills</h1>

      <input
        type="text"
        placeholder="Enter a skill"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginRight: "10px",
        }}
      />

      <button onClick={addSkill}>
        Add Skill
      </button>

      <h2>Your Skills</h2>

      <ul>
        {skills.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default Skills;