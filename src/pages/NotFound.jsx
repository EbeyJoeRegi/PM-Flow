import { Link } from "react-router-dom";
import "../styles/notfound.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="home-link">Go to Login</Link>
    </div>
  );
};

export default NotFound;
