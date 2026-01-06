import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { fetchTables } from "../../api/TablesApi";
import { useStatusSocket } from "../../hooks/useWebsocket";
import { useState,useEffect } from "react";


const WaiterDashboard = () => {

  const navigate = useNavigate();

  const [tables, setTables] = useState([])

  const [loading, setLoading] = useState(false)
  useStatusSocket(setTables)
  useEffect(() => {
      const getTables = async () => {
        try {
          setLoading(true)
          const response = await fetchTables()
          const activeTables = response.filter(
              (table) => table.status !== "closed");
          setTables(activeTables);
        } catch (error) {
          showError("Failed to load tables")
          console.error(error)
        } finally {
          setLoading(false)
        }
      }
  
      getTables()
    }, [])

  const statusStyles = {
    available: "bg-green-100 border-green-300",
    occupied: "bg-blue-100 border-blue-300",
    bill_requested: "bg-yellow-100 border-yellow-300",
    closed: "bg-gray-200 border-gray-300",
  };

  return (
    <DashboardLayout title="Waiter Dashboard">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tables.map((table) => (
          <button
            disabled={
              table.status === "bill_requested" ||
              table.status === "closed"
            }
            onClick={() => navigate(`/dashboard/waiter/tables/${table.id}`)}
            className={`border-2 p-4 rounded-lg ${
              statusStyles[table.status]
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none`}
          >

            <h3 className="text-xl font-bold">T{table.table_number}</h3>
            <p className="text-sm">{table.capacity} seats</p>
            <p className="text-sm capitalize mt-1">{table.status}</p>
          </button>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default WaiterDashboard;
