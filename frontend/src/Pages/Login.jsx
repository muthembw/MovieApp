import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { useState, useContext } from 'react';
import api from '../services/localApi';
import "../css/AuthForm.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle input changes for email and password
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await api.post("api/auth/login", form);
        const { token, user } = res.data;
        console.log("Login Response:", res.data);

        const userData = {
          _id: user._id,
          name:user.name,
          email:user.email
        }

        // Store user data and token in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userId", user._id);

        //console.log("Stored user in localStorage:", localStorage.getItem("user"));
        //console.log("Stored token in localStorage:", localStorage.getItem("token"));

        setUser(userData);
        setToken(token);

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        navigate("/");

    } catch (err) {
        console.error("Login error:", err);

        if (err.response) {
            // This will log more detailed error information
            console.error("Error response:", err.response);
            alert("Login failed: " + (err.response.data?.message || "Invalid credentials"));
        } else if (err.request) {
            alert("No response from server. Please check if the backend is running.");
        } else {
            alert("Login error: " + err.message);
        }
    }
};

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login to Your Account</h2>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        <div className="switch-link">
          Don't have an account?
          <a href="/register">Register here</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
