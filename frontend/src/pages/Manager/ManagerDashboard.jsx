import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { fetchTables } from "../../api/TablesApi";
import { useStatusSocket } from "../../hooks/useWebsocket";

/* ---------- Manager Dashboard ---------- */

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useStatusSocket(setTables)

  useEffect(() => {
    const loadTables = async () => {
      try {
        setLoading(true);
        const response = await fetchTables();


        setTables(response);
        console.log(response);
        
      } catch (err) {
        setError("Failed to load tables");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTables();
  }, []);

  /* ---------- Stats ---------- */
  const stats = {
    total: tables.length,
    occupied: tables.filter(t => t.status === "occupied").length,
    billRequested: tables.filter(t => t.status === "bill_requested").length,
  };

  /* ---------- UI helpers ---------- */
  const statusStyles = {
    available: "bg-green-100 text-green-800 border-green-300",
    occupied: "bg-blue-100 text-blue-800 border-blue-300",
    bill_requested: "bg-yellow-100 text-yellow-800 border-yellow-300",
    closed: "bg-gray-100 text-gray-600 border-gray-300",
  };

  const formatStatus = (status) =>
    status
      .replace("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <DashboardLayout title="Manager Dashboard">
      {/* 📊 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Tables" value={stats.total} />
        <StatCard title="Occupied Tables" value={stats.occupied} />
        <StatCard title="Bill Requested" value={stats.billRequested} />
      </div>

      {/* 🪑 Table Overview */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Table Overview</h2>

        {loading && (
          <p className="text-gray-500">Loading tables...</p>
        )}

        {error && (
          <p className="text-red-600">{error}</p>
        )}

        {!loading && !error && tables.length === 0 && (
          <p className="text-gray-500">No tables found.</p>
        )}

        {!loading && !error && tables.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`border-2 rounded-lg p-4 text-center ${
                  statusStyles[table.status]
                }`}
              >
                <p className="text-xl font-bold">
                  T{table.table_number}
                </p>
                <p className="text-xs mt-1 font-medium">
                  {formatStatus(table.status)}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {table.capacity} seats
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ⚙ Manager Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard
          title="Menu Management"
          description="Add, update, or disable menu items"
          button="Manage Menu"
          onClick={() => navigate("/dashboard/manager/menuitems")}
        />

        <ActionCard
          title="Table Management"
          description="Create or update restaurant tables"
          button="Manage Tables"
          onClick={() => navigate("/dashboard/manager/tables")}
        />
      </div>
    </DashboardLayout>
  );
};

/* ---------- Helper Components ---------- */

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const ActionCard = ({ title, description, button, onClick }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="font-semibold mb-1">{title}</h3>
    <p className="text-sm text-gray-500 mb-4">{description}</p>
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      onClick={onClick}
    >
      {button}
    </button>
  </div>
);

export default ManagerDashboard;
