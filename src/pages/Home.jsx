import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/userSlice";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaProjectDiagram, FaUsers, FaUserCircle } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2";
import { GiHamburgerMenu } from "react-icons/gi";
import "../styles/Home.css";

const Home = () => {
  const { name, role } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".hamburger-icon")
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const basePath = role === "ADMIN" ? "/admin" : role === "PROJECT_MANAGER" ? "/manager" : "/member";

  return (
    <div className="manager-wrapper">
      <nav className="manager-navbar">
        <div className="manager-navbar-left">
          <GiHamburgerMenu
            size={24}
            className="hamburger-icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <NavLink to={basePath} className="manager-navbar-title">PM Flow</NavLink>
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

      {sidebarOpen && <div className="sidebar-overlay" />}

      <div className="manager-body">
        <aside
          className={`manager-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
          ref={sidebarRef}
        >
          <ul>
            <li>
              <NavLink
                to="."
                end
                className={({ isActive }) => isActive ? "manager-active" : ""}
              >
                <TbLayoutDashboardFilled /> Dashboard
              </NavLink>

              {role === "ADMIN" && (
                <>
                  <NavLink
                    to="users"
                    className={({ isActive }) => isActive ? "manager-active" : ""}
                  >
                    <HiMiniUsers /> Users
                  </NavLink>
                  <NavLink
                    to="projects"
                    className={({ isActive }) => isActive ? "manager-active" : ""}
                  >
                    <FaProjectDiagram /> Projects
                  </NavLink>
                </>
              )}

              {role === "PROJECT_MANAGER" && (
                <>
                  <NavLink
                    to="projects"
                    className={({ isActive }) => isActive ? "manager-active" : ""}
                  >
                    <FaProjectDiagram /> Projects
                  </NavLink>
                  <NavLink
                    to="collaboration"
                    className={({ isActive }) => isActive ? "manager-active" : ""}
                  >
                    <FaUsers /> Collaboration
                  </NavLink>
                </>
              )}

              {role === "MEMBER" && (
                <>
                  <NavLink
                    to="assigned-tasks"
                    className={({ isActive }) => isActive ? "manager-active" : ""}
                  >
                    <FaProjectDiagram /> Assigned Tasks
                  </NavLink>
                  <NavLink
                    to="collaboration"
                    className={({ isActive }) => isActive ? "manager-active" : ""}
                  >
                    <FaUsers /> Collaboration
                  </NavLink>
                </>
              )}
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

export default Home;
