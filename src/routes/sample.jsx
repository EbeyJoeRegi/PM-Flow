import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Manager from "../pages/manager/Manager";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";
import ManagerDashboard from "../pages/manager/ManagerDashboard.jsx";
import ManagerProjects from "../pages/manager/managerProjects";
import ManagerTaskDetail from "../pages/manager/managerTaskDetail.jsx";
import ManagerProjectDetail from "../pages/manager/managerProjectDetail.jsx"
import ProjectChatPage from "../pages/manager/ProjectChatPage.jsx";
import CollaborationProjects from "../pages/manager/CollaborationProjects.jsx";
import MemberLayout from '../pages/member/MemberLayout.jsx';
import MemberDashboard from '../pages/member/MemberDashboard';
import AssignedTasks from '../pages/member/AssignedTasks';
import ProjectCollaboration from '../pages/member/ProjectCollaboration';
import MemberCollaboration from '../pages/member/MemberCollaboration';
import MemberCollaborationProjects from '../pages/member/MemberCollaborationProjects';

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminNavbar from '../pages/admin/AdminNavbar';
import Users from '../pages/admin/Users';
import Projects from '../pages/admin/Projects';
import ProjectDetails from '../pages/admin/ProjectDetails'
import Home from "../pages/Home.jsx";

const AppRoutess = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Home />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="users" element={<Users />} />
        <Route path="project/:id" element={<ProjectDetails />} />
      </Route>

      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={['PROJECT_MANAGER']}>
            <Home />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
        <Route path="projects" element={<ManagerProjects />} />
        <Route path="projects/:projectName" element={<ManagerProjectDetail />} />
        <Route path="projects/:projectName/tasks/:taskID" element={<ManagerTaskDetail />} />
        <Route path="collaboration" element={<CollaborationProjects />} />
        <Route path="collaboration/:id" element={<ProjectChatPage />} />
      </Route>

      <Route
        path="/member"
        element={
          <ProtectedRoute allowedRoles={['MEMBER']}>
            <Home />
          </ProtectedRoute>
        }
      >
        <Route index element={<MemberDashboard />} />
        <Route path="assigned-tasks" element={<AssignedTasks />} />
        <Route path="collaboration" element={<MemberCollaborationProjects />} />
        <Route path="collaboration/:projectId" element={<MemberCollaboration />} />
        <Route path="project/:projectId/collaboration" element={<ProjectCollaboration />} />
      </Route>



      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutess;
