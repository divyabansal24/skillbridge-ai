import React from "react";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "40px" }}>
      <h1>My Profile</h1>

      <h3>Name: {user?.name}</h3>
      <h3>Email: {user?.email}</h3>

      <h2>Skills</h2>

      <ul>
        <li>React.js</li>
        <li>Python</li>
        <li>Computer Networks</li>
      </ul>
    </div>
  );
}

export default Profile;