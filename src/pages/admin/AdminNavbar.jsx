import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/userSlice";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { HiMiniUsers } from "react-icons/hi2";
import {
  FaUserCircle,
  FaProjectDiagram,
  FaBars
} from 'react-icons/fa';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../../styles/AdminNavbar.css';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name } = useSelector((state) => state.user);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar-header">
        <div className="navbar-left">
          <FaBars className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)} />
          <NavLink to="/admin" className="navbar-title">PM Flow</NavLink>
        </div>
        <div className="navbar-right" ref={dropdownRef}>
          <span className="navbar-welcome">Welcome, {name}</span>
          <FaUserCircle className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)} />
          {dropdownOpen && (
            <div className="dropdown">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      <div className="navbar-body">
        <aside className={`navbar-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <ul>
            <li>
              <NavLink to="." end className={({ isActive }) => isActive ? 'active' : ''}>
                <TbLayoutDashboardFilled /> <span className="link-text">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="users" className={({ isActive }) => isActive ? 'active' : ''}>
                <HiMiniUsers /> <span className="link-text">Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="projects" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaProjectDiagram /> <span className="link-text">Projects</span>
              </NavLink>
            </li>
          </ul>
        </aside>
        <main className="navbar-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
