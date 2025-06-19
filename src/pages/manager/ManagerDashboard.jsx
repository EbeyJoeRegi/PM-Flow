import { useSelector } from "react-redux";

const ManagerDashboard = () => {
  const { name, role } = useSelector((state) => state.user);

  return (
    <div className="dashboard">
      <h1>Hi {name},</h1>
      <p>Role = {role}</p>
      <h2>Welcome to the Manager Dashboard</h2>
    </div>
  );
};

export default ManagerDashboard;
