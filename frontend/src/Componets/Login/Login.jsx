// LoginPage.js

import React, { useState } from "react";
import "./Login.css"; // CSS file for styling

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = "http://localhost:3000/user/signin"; // TODO: enter server url

    const requestBody = {
      email: username,
      password: password,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Handle response here (e.g., check status, redirect, etc.)
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      const token = responseData.token;

      // Store the token in localStorage
      localStorage.setItem("token", token);
      console.log("Response Data:", responseData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
