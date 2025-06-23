import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/userSlice";
import { useEffect, useRef, useState } from "react";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaUsers,
  FaUserCircle
} from "react-icons/fa";
import "../../styles/manager.css";

const Manager = () => {
  const { name } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="manager-wrapper">
      <nav className="manager-navbar">
        <div className="manager-navbar-left">
          <span className="manager-navbar-title">PM Flow</span>
        </div>
        <div className="manager-navbar-right">
          <span className="manager-welcome">Welcome, {name}</span>
          <div className="manager-profile" ref={dropdownRef}>
            <FaUserCircle size={30} onClick={() => setDropdownOpen(!dropdownOpen)} />
            {dropdownOpen && (
              <div className="manager-dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="manager-body">
        <aside className="manager-sidebar">
          <ul>
            <li>
              <NavLink to="" end className={({ isActive }) => isActive ? 'manager-active' : ''}>
                <FaTachometerAlt /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="projects" className={({ isActive }) => isActive ? 'manager-active' : ''}>
                <FaProjectDiagram /> Projects
              </NavLink>
            </li>
            <li>
              <NavLink to="collaboration" className={({ isActive }) => isActive ? 'manager-active' : ''}>
                <FaUsers /> Collaboration
              </NavLink>
            </li>
          </ul>
        </aside>

        <main className="manager-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Manager;
