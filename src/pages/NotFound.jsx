import "../styles/notfound.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../api/commonApi";

const NotFound = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  const onLogoutClick = () => {
    handleLogout(dispatch, navigate, token);
  };

  return (
    <div className="notfound-container">
      <div className="notfound-box">
        <h1 className="notfound-code">404</h1>
        <p className="notfound-message">Oops! The page you’re looking for doesn’t exist.</p>
        <div className="notfound-actions">
          <button className="notfound-btn danger" onClick={onLogoutClick}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
