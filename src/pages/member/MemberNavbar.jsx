import React, { useRef, useState, useEffect } from 'react'
import { FaUserCircle, FaTachometerAlt, FaUsers, FaBars } from 'react-icons/fa'
import { NavLink, Outlet } from 'react-router-dom'
import '../../styles/MemberNavbar.css'

export default function MemberNavbar({ name, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dropdownRef = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="member-wrapper">
      <nav className="member-navbar">
        <div className="navbar-title d-flex align-items-center gap-3">
          <FaBars
            size={22}
            className="text-white"
            style={{ cursor: 'pointer' }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <h4 className="m-0 text-white">PM Flow</h4>
        </div>

        <div className="navbar-user d-flex align-items-center gap-3">
          <span className="text-white fw-semibold">Welcome, {name}</span>
          <div className="position-relative" ref={dropdownRef}>
            <FaUserCircle
              size={28}
              className="text-white"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ cursor: 'pointer' }}
            />
            {dropdownOpen && (
              <div className="dropdown-menu show position-absolute end-0 mt-2 p-2 shadow" style={{ minWidth: '120px' }}>
                <button className="dropdown-item" onClick={onLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="member-body">
        <aside className={`member-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
          <ul>
            <li>
              <NavLink
                to="."
                end
                className={({ isActive }) => isActive ? 'member-active' : ''}
                onClick={() => setSidebarOpen(false)}
              >
                <FaTachometerAlt /> <span className="link-text">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="collaboration"
                className={({ isActive }) => isActive ? 'member-active' : ''}
                onClick={() => setSidebarOpen(false)}
              >
                <FaUsers /> <span className="link-text">Collaboration</span>
              </NavLink>
            </li>
          </ul>
        </aside>

        <main className="member-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
