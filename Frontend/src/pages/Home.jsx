import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaProjectDiagram, FaUsers, FaUserCircle, FaTasks } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2";
import { GiHamburgerMenu } from "react-icons/gi";
import "../styles/Home.css";
import { handleLogout } from "../api/commonApi";

const Home = () => {
  const { name, role, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  const onLogoutClick = () => {
    handleLogout(dispatch, navigate, token);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarVisible(!mobile); // full by default on desktop, collapsed on mobile
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".hamburger-icon")
      ) {
        if (isMobile) setSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile]);

  const basePath =
    role === "ADMIN" ? "/admin" : role === "PROJECT_MANAGER" ? "/manager" : "/member";

  return (
    <div className="home-wrapper">
      <nav className="home-navbar">
        <div className="home-navbar-left">
          <GiHamburgerMenu
            size={24}
            className="hamburger-icon"
            onClick={() => setSidebarVisible(!sidebarVisible)}
          />
          <NavLink to={basePath} className="home-navbar-title">PM Flow</NavLink>
        </div>
        <div className="home-navbar-right">
          <span className="home-welcome">Welcome, {name}</span>
          <div className="home-profile" ref={dropdownRef}>
            <FaUserCircle size={30} onClick={() => setDropdownOpen(!dropdownOpen)} />
            {dropdownOpen && (
              <div className="home-dropdown">
                <button onClick={onLogoutClick}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isMobile && sidebarVisible && <div className="sidebar-overlay" />}

      <div className="home-body">
        <aside
          className={`home-sidebar ${isMobile
              ? sidebarVisible
                ? "sidebar-open sidebar-mobile"
                : "sidebar-collapsed sidebar-mobile"
              : sidebarVisible
                ? "sidebar-open"
                : "sidebar-collapsed"
            }`}
          ref={sidebarRef}
        >
          <ul>
            <li>
              <NavLink to="." end className={({ isActive }) => isActive ? "home-active" : ""}>
                <TbLayoutDashboardFilled />
                <span>Dashboard</span>
              </NavLink>

              {role === "ADMIN" && (
                <>
                  <NavLink to="users" className={({ isActive }) => isActive ? "home-active" : ""}>
                    <HiMiniUsers />
                    <span>Users</span>
                  </NavLink>
                  <NavLink to="projects" className={({ isActive }) => isActive ? "home-active" : ""}>
                    <FaProjectDiagram />
                    <span>Projects</span>
                  </NavLink>
                </>
              )}

              {role === "PROJECT_MANAGER" && (
                <>
                  <NavLink to="projects" className={({ isActive }) => isActive ? "home-active" : ""}>
                    <FaProjectDiagram />
                    <span>Projects</span>
                  </NavLink>
                  <NavLink to="collaboration" className={({ isActive }) => isActive ? "home-active" : ""}>
                    <FaUsers />
                    <span>Collaboration</span>
                  </NavLink>
                </>
              )}

              {role === "MEMBER" && (
                <>
                  <NavLink to="assigned-tasks" className={({ isActive }) => isActive ? "home-active" : ""}>
                    <FaTasks />
                    <span>Task Assigned</span>
                  </NavLink>
                  <NavLink to="collaboration" className={({ isActive }) => isActive ? "home-active" : ""}>
                    <FaUsers />
                    <span>Collaboration</span>
                  </NavLink>
                </>
              )}
            </li>
          </ul>
        </aside>

        <main className="home-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Home;
