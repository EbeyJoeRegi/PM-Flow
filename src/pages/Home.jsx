import { useRef, useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/userSlice"; 
import { FaUserCircle, FaProjectDiagram, FaUsers, FaBars } from "react-icons/fa";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { HiMiniUsers } from "react-icons/hi2";
import "../styles/Home.css"

export default function Home() {
  const { name, role } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dropdownRef = useRef();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sidebar links based on role
  const getSidebarLinks = () => {
    switch (role) {
      case "ADMIN":
        return [
          { to: ".", icon: <TbLayoutDashboardFilled />, label: "Dashboard" },
          { to: "users", icon: <HiMiniUsers />, label: "Users" },
          { to: "projects", icon: <FaProjectDiagram />, label: "Projects" },
        ];
      case "PROJECT_MANAGER":
        return [
          { to: ".", icon: <TbLayoutDashboardFilled />, label: "Dashboard" },
          { to: "projects", icon: <FaProjectDiagram />, label: "Projects" },
          { to: "collaboration", icon: <FaUsers />, label: "Collaboration" },
        ];
      case "MEMBER":
        return [
          { to: ".", icon: <TbLayoutDashboardFilled />, label: "Dashboard" },
          { to: "assigned-tasks", icon: <FaProjectDiagram />, label: "Assigned Tasks" },
          { to: "collaboration", icon: <FaUsers />, label: "Collaboration" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="role-layout-wrapper">
      <nav className="role-navbar">
        <div className="role-navbar-left">
          <FaBars
            className="menu-icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <NavLink to={`/${role.toLowerCase()}`} className="role-navbar-title">
            PM Flow
          </NavLink>
        </div>
        <div className="role-navbar-right" ref={dropdownRef}>
          <span className="navbar-welcome">Welcome, {name}</span>
          <FaUserCircle
            className="profile-icon"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="dropdown">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      <div className="role-body">
        <aside className={`role-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
          <ul>
            {getSidebarLinks().map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  end={link.to === "."}
                >
                  {link.icon} <span className="link-text">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>

        <main className="role-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
