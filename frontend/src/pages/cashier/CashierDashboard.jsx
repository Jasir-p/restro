import { useState,useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { fetchTables } from "../../api/TablesApi";
import { showError,showSuccess } from "../../../utils/toast";
import { useStatusSocket } from "../../hooks/useWebsocket";
import GenerateBillModal from "../bills/GenerateBillModal";
import { fetchOrderbyTable } from "../../api/OrderApi";
import { fetchTodayBill,billStatusChaneg } from "../../api/BillingApi";
import { useNavigate } from "react-router-dom";


const CashierDashboard = () => {

  const [tables, setTables] = useState([])
  const [tableId,setTableId] = useState(null)
  useStatusSocket(setTables)
  const[refreshBill, setRefreshBill] = useState(false)
  const [selected, setSelected] = useState(null)
  const [bills, setBills] = useState([]);
  const navigate = useNavigate();


  const billedTableIds = new Set(
    bills.map(bill => bill.table)
  );
  console.log(billedTableIds);
  

  const billRequestTables = tables.filter(
    table =>
      table.status === "bill_requested" &&
      !billedTableIds.has(table.id)
  );

  // fetch bills
    useEffect(() => {
      const getBills = async () => {
        try {
          
          const response = await fetchTodayBill()
          console.log(response);
          
          setBills(response) 
        } catch (error) {
          showError("Failed to load bills")
          console.error(error)
        } finally {
         
        }
      }
      getBills()
  }, [refreshBill])

  const statusStyle = {
    not_generated: "text-gray-700 bg-gray-100",
    pending: "text-yellow-700 bg-yellow-100",
    paid: "text-green-700 bg-green-100",
  };
  useEffect(() => {
    const getTables = async () => {
      try {
        
        const response = await fetchTables()
        setTables(response)
        console.log(response);
         
      } catch (error) {
        showError("Failed to load tables")
        console.error(error)
      } 
    }
    getTables()
  },[])

  useEffect(() => {
    const getData = async () => {
      try {
        
        const response = await fetchOrderbyTable(tableId)
       setSelected(response.data.orders)

         
      } catch (error) {
        showError("Failed to load")
        console.error(error)
      } 
    }
    if (tableId){
      getData()
    }
  },[tableId])
  // const handleGenerateBill = (id) => {
  //   // later: call Django API
  //   setBills((prev) =>
  //     prev.map((bill) =>
  //       bill.id === id
  //         ? { ...bill, amount: 950, status: "pending" }
  //         : bill
  //     )
  //   );
  // };
  
  const handleCloseModal = () => {
  setTableId(null);
  setSelected(null);
};

  const handleMarkPaid = async(id) => {
    try{
      const response = await billStatusChaneg(id,'paid')
      setRefreshBill((prev)=>!prev)
      showSuccess("Updated successfully")
    }catch(error){
      showError(error.response?.data?.detail)
    }
    
    
  };

  return (
    <DashboardLayout title="Cashier Dashboard">
      {/* 🔔 Tables Requesting Bill */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Tables Requesting Bill
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {billRequestTables
            .filter((t) => t.status === "bill_requested")
            .map((table) => (
              <button
                key={table.id}
                className="border-2 border-yellow-300 bg-yellow-100 text-yellow-800 rounded-lg p-4 text-center"
                onClick={()=>setTableId(table.id)}
              >
                <p className="text-xl font-bold">{table.table_number}</p>
                <p className="text-sm font-medium mt-1">
                  Bill Requested
                </p>
              </button>
            ))}
        </div>

        {tables.filter((t) => t.status === "bill_requested").length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-4">
            No bill requests right now
          </p>
        )}
      </div>

      {/* 💳 Billing Queue */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Billing Queue</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="pb-2">Table</th>
              <th className="pb-2">Total</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id} className="border-b last:border-none">
                <td className="py-3 font-medium">{bill.table}</td>

                <td className="py-3">
                  {bill.total_amount ? `₹${bill.total_amount}` : "--"}
                </td>

                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${statusStyle[bill.status]}`}
                  >
                    {bill.status.replace("_", " ").toUpperCase()}
                  </span>
                </td>

                <td className="py-3">
                  {/* {bill.status === "not_generated" && (
                    <button
                      onClick={() => handleGenerateBill(bill.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Generate Bill
                    </button>
                  )} */}

                  {bill.status === "pending" && (
                    <button
                      onClick={() => handleMarkPaid(bill.id)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
                <td
                    className="py-3 text-blue-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/dashboard/cashier/bills/${bill.id}`)}
                  >
                    Detail
                  </td>

              </tr>
            ))}
          </tbody>
        </table>

        {bills.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-6">
            No bills available
          </p>
        )}
      </div>
      {tableId && selected && (
        <GenerateBillModal
          data={selected}
          onClose={handleCloseModal}
          refresh ={setRefreshBill}
        />
      )}
    </DashboardLayout>
  );
};

export default CashierDashboard;
