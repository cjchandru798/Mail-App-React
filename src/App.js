import React, { useState } from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [toEmail, setToEmail] = useState(""); // 🔄 dynamic recipient
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // 🌀 loading state

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email",
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        setToken(tokenResponse.access_token);

        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        setEmail(res.data.email);
      } catch (err) {
        console.error("❌ Failed to fetch user info", err);
        toast.error("Failed to fetch user info");
      }
    },
    onError: () => toast.error("Login failed. Please try again."),
  });

  const sendMail = async () => {
    if (!toEmail || !file || !subject || !message || !token) {
      toast.warn("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("to", toEmail); // 💌 send dynamic recipient

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/mail/send`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data || "Email sent!");
      setSubject("");
      setMessage("");
      setFile(null);
      setToEmail("");
    } catch (err) {
      console.error("❌ Failed to send email:", err);
      toast.error("Failed to send: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">📧 Gmail Sender App</h1>
      <ToastContainer />

      {!token ? (
        <div className="login-box">
          <button onClick={login} className="send-btn">
            🔐 Sign in with Google
          </button>
        </div>
      ) : (
        <div className="form-box">
          <p className="welcome-msg">Welcome, {email}</p>

          <label>To</label>
          <input
            type="email"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            placeholder="Recipient email"
            required
          />

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

          <button onClick={sendMail} className="send-btn" disabled={loading}>
            {loading ? "Sending..." : "🚀 Send Email"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
