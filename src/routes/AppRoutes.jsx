import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Manager from "../pages/manager/Manager";
import MemberDashboard from "../pages/member/MemberDashboard";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";
import ManagerDashboard from "../pages/manager/ManagerDashboard.jsx";
import ManagerProjects from "../pages/manager/managerProjects";
import ManagerTaskDetail from "../pages/manager/managerTaskDetail.jsx";
import ManagerProjectDetail from "../pages/manager/managerProjectDetail.jsx"
import ProjectChatPage from "../pages/manager/ProjectChatPage.jsx";
import CollaborationProjects from "../pages/manager/CollaborationProjects.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <Manager />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
        <Route path="projects" element={<ManagerProjects />} />
        <Route path="projects/:projectName/tasks/:taskname" element={<ManagerTaskDetail />} />
        <Route path="collaboration" element={<CollaborationProjects />} />
        <Route path="projects/:projectName" element={<ManagerProjectDetail />} />
        <Route path="collaboration/:id" element={<ProjectChatPage />} />

      </Route>

      <Route
        path="/member-dashboard"
        element={
          <ProtectedRoute allowedRoles={['member']}>
            <MemberDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
