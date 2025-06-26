import React, { useRef, useState, useEffect } from 'react'
import {
  FaUserCircle,
  FaTachometerAlt,
  FaUsers,
  FaProjectDiagram,
  FaBars
} from 'react-icons/fa'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import '../../styles/AdminNavbar.css'

export default function Navbar({ name = 'Admin', onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const dropdownRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    if (onLogout) onLogout()
    else navigate('/')
  }

  return (
    <div className="navbar-wrapper">
      <nav className="navbar-header">
        <div className="navbar-left">
          <FaBars className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)} />
          <h4 className="navbar-title">PM Flow</h4>
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
                <FaTachometerAlt /> <span className="link-text">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="users" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaUsers /> <span className="link-text">Users</span>
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
  )
}
