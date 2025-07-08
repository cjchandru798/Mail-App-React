import React, { useState } from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

<<<<<<< HEAD
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const login = useGoogleLogin({
    scope:
      "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email",
    flow: "implicit",
=======
  // Correct access-token based login flow
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email",
    flow: "implicit", // optional but safe to keep
>>>>>>> cbe4c73edf25e3bc3152c3c73bfce6824b96a78a
    onSuccess: async (tokenResponse) => {
      try {
        setToken(tokenResponse.access_token);

<<<<<<< HEAD
=======
        // Get user email from token
>>>>>>> cbe4c73edf25e3bc3152c3c73bfce6824b96a78a
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        setEmail(res.data.email);
      } catch (err) {
        alert("Failed to fetch user info");
      }
    },
    onError: () => alert("Login failed. Please try again."),
  });

  const sendMail = async () => {
    if (!file || !subject || !message || !token) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("message", message);

    try {
<<<<<<< HEAD
      const res = await axios.post(`${API_BASE_URL}/api/mail/send`, formData, {
=======
      const res = await axios.post("http://localhost:8081/api/mail/send", formData, {
>>>>>>> cbe4c73edf25e3bc3152c3c73bfce6824b96a78a
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert(res.data);
    } catch (err) {
      alert("Failed to send email: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="container">
      <h1 className="title">📧 Gmail Sender App</h1>

      {!token ? (
        <div className="login-box">
<<<<<<< HEAD
          <button onClick={login} className="send-btn">
=======
          <button onClick={() => login()} className="send-btn">
>>>>>>> cbe4c73edf25e3bc3152c3c73bfce6824b96a78a
            🔐 Sign in with Google
          </button>
        </div>
      ) : (
        <div className="form-box">
          <p className="welcome-msg">Welcome, {email}</p>

          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <label>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <label>Attach a File</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          <button onClick={sendMail} className="send-btn">
            🚀 Send Email
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
