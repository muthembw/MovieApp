import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import api from '../services/localApi';
import "../css/AuthForm.css"; 

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      alert("Password should be at least 6 characters long");
      return;
    }

    try {
      const res = await api.post("api/auth/register", form);

      if (res.data) {
        const { user_id, name, email } = res.data; 

        localStorage.setItem("user", JSON.stringify({ name, email, user_id }));

        setUser({ name, email, _id: user_id });

        navigate("/login");
      } else {
        alert("Registration failed! Please try again.");
      }
    } catch (err) {
      console.error("Registration Error:", err);

      if (err.response) {
        alert("Registration failed: " + (err.response.data?.message || "Unknown error"));
      } else if (err.request) {
        alert("No response from server. Please check if the backend is running.");
      } else {
        alert("Unexpected error: " + err.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Create an Account</h2>

        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
          required
        />

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
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>

        <div className="switch-link">
          Already have an account?
          <a href="/login">Login here</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
