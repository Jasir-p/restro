import { logout } from "../api/Logout";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ title, children }) => {
  const navigate = useNavigate(); // ✅ correct place

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true }); // 🔒 prevents back navigation
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-xl font-bold">{title}</h1>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
