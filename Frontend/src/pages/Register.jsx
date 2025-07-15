import React, { useState } from "react";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from '../api/commonApi';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (email) => {
    return email.endsWith("@incture.com");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;

    if (!validateEmail(email)) {
      setError("Invalid Email address.");
      console.log("Email Should end with @incture.com")
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and include an uppercase letter, a number, and a special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { username, firstName, lastName } = formData;
      await registerUser({ username, email, password, firstName, lastName });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err || "Registration failed.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <img src="/logo/PM Flow.png" alt="PM Flow Logo" className="register-logo" />
        <h2 className="register-title">Register</h2>

        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" required onChange={handleChange} />
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="register-btn">Register</button>

        <p className="login-link">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
