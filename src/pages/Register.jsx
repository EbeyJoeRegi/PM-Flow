import React, { useState } from "react";
import "../styles/Register.css";
import { Link } from "react-router-dom";

const Register = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;

    if (!validateEmail(email)) {
      setError("Invalid Email address.");
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

    // Proceed with API submission here
    console.log("Registration Data:", formData);
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <img 
          src="/logo/PM Flow.png" 
          alt="PM Flow Logo" 
          className="register-logo" 
        />

        <h2 className="register-title">Register</h2>

        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" required onChange={handleChange} />
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

        <div className="form-group">
          <label>Age</label>
          <input type="number" name="age" required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" required onChange={handleChange}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" required onChange={handleChange} />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="register-btn">Register</button>

        <p className="login-link">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
