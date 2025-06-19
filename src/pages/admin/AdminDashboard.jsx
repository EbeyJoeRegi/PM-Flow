import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const { name, role } = useSelector((state) => state.user);

  return (
    <div className="dashboard">
      <h1>Hi {name},</h1>
      <p>Role = {role}</p>
      <h2>Welcome to the Admin Dashboard</h2>
    </div>
  );
};

export default AdminDashboard;
