import '../styles/login.css';
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="login-container">
      <form className="login-form">
        <img 
          src="/logo/PM Flow.png" 
          alt="PM Flow Logo" 
          className="login-logo"
        />

        <h2 className="login-title">Login</h2>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email" required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" required />
        </div>

        <button type="submit" className="login-btn">Login</button>

        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
