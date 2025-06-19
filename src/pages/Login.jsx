import '../styles/login.css';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

import { loginUser } from '../api/commonApi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const result = await loginUser(email, password);
      const { name, id, role } = result;

      dispatch(setUser({ id, name, role }));

    if (role === "admin") {
      navigate("/admin-dashboard");
    } 
    else if (role === "manager") {
      navigate("/manager-dashboard");
    } 
    else if(role === "member"){
      navigate("/member-dashboard");
    }

    } catch (error) {
      setErrorMsg(error.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src="/logo/PM Flow.png" alt="PM Flow Logo" className="login-logo" />

        <h2 className="login-title">Login</h2>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password" 
            required 
          />
        </div>

        {errorMsg && <p className="error-message">{errorMsg}</p>}

        <button type="submit" className="login-btn">Login</button>

        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
