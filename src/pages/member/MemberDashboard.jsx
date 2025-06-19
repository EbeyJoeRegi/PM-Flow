import { useSelector } from "react-redux";

const MemberDashboard = () => {
  const { name, role } = useSelector((state) => state.user);

  return (
    <div className="dashboard">
      <h1>Hi {name},</h1>
      <p>Role = {role}</p>
      <h2>Welcome to the User Dashboard</h2>
    </div>
  );
};

export default MemberDashboard;
