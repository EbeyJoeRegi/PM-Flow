import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";
import ManagerDashboard from "../pages/manager/ManagerDashboard.jsx";
import ManagerProjects from "../pages/manager/managerProjects";
import ManagerTaskDetail from "../pages/manager/managerTaskDetail.jsx";
import ManagerProjectDetail from "../pages/manager/managerProjectDetail.jsx"
import ProjectChatPage from "../pages/ProjectChatPage.jsx";
import CollaborationProjects from "../pages/CollaborationProjects.jsx";
import MemberDashboard from '../pages/member/MemberDashboard';
import AssignedTasks from '../pages/member/AssignedTasks';
import ProjectCollaboration from '../pages/member/ProjectCollaboration';
import Home from "../pages/Home.jsx"
import AdminDashboard from "../pages/admin/AdminDashboard";
import Users from '../pages/admin/Users';
import Projects from '../pages/admin/Projects';
import ProjectDetails from '../pages/admin/ProjectDetails'
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
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
          <ProtectedRoute allowedRoles={["PROJECT_MANAGER"]}>
            <Home />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
        <Route path="projects" element={<ManagerProjects />} />
        <Route path="projects/:projectName" element={<ManagerProjectDetail />} />
        <Route path="projects/:projectName/tasks/:taskID" element={<ManagerTaskDetail />} />
        <Route path="collaboration" element={<CollaborationProjects />} />
        <Route path="collaboration/:ProjectID" element={<ProjectChatPage />} />
      </Route>

      <Route
        path="/member"
        element={
          <ProtectedRoute allowedRoles={["MEMBER"]}>
            <Home />
          </ProtectedRoute>
        }
      >
        <Route index element={<MemberDashboard />} />
        <Route path="assigned-tasks" element={<AssignedTasks />} />
        <Route path="collaboration" element={<CollaborationProjects />} />
        <Route path="collaboration/:ProjectID" element={<ProjectChatPage />} />
        <Route path="project/:projectId/collaboration" element={<ProjectCollaboration />} />
      </Route>



      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
