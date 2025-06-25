import React from 'react';
import MemberNavbar from './MemberNavbar';
import { Outlet } from 'react-router-dom';

export default function MemberLayout() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const employeeName = localStorage.getItem('employeeName') || 'Employee';

  return (
    <MemberNavbar name={employeeName} onLogout={handleLogout} />
  );
}
