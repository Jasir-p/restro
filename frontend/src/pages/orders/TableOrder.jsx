import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { fetchOrderbyTable, updateOrderStatusApi } from "../../api/OrderApi";
import { showError, showSuccess } from "../../../utils/toast";
import { requestBill as requestBillApi } from "../../api/BillingApi";

const TableOrders = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const getOrder = async () => {
      try {
        setLoading(true);
        const response = await fetchOrderbyTable(tableId);
        setOrder(response.data.orders);
      } catch (error) {
        setOrder(null);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, [tableId, refresh]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatusApi(orderId, status);
      showSuccess("Status updated");
      setRefresh(prev => !prev);
    } catch (error) {
      showError("Failed to update status");
    }
  };

  const handleRequestBill = async (tableId) => {
    try {
      await requestBillApi(tableId);
      showSuccess("Bill requested successfully");
      // Removed setRefresh call to prevent automatic refetch
      // The order data will remain as-is after bill request
    } catch (error) {
      showError("Failed to request bill");
    }
  };

  if (!tableId) {
    return (
      <DashboardLayout title="Invalid Table">
        <p className="text-red-600">Table not found.</p>
      </DashboardLayout>
    );
  }

  const table = order?.table;
  console.log(order);

  return (
    <DashboardLayout
      title={`Orders - Table ${table?.table_number ?? ""}`}
    >
      {/* Create Order (only if no active order) */}
      {!order && (
        <button
          onClick={() =>
            navigate(`/dashboard/waiter/tables/${tableId}/order/new`)
          }
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Order
        </button>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">Loading order...</p>
      )}

      {/* No order */}
      {!loading && !order && (
        <p className="text-gray-500 italic">
          No active order for this table.
        </p>
      )}

      {/* Active Order */}
      {order && (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h4 className="font-semibold text-lg">
            Order {order.order_number}
          </h4>

          <p className="text-sm text-gray-600">
            Status: <b>{order.status.replace("_", " ").toUpperCase()}</b>
          </p>

          <div className="flex gap-2 mt-3">
            {order.status === "placed" && (
              <button
                onClick={() => updateOrderStatus(order.id, "in_kitchen")}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Send to Kitchen
              </button>
            )}

            {order.status === "in_kitchen" && (
              <button
                onClick={() => updateOrderStatus(order.id, "served")}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                Mark as Served
              </button>
            )}
          </div>

          <p className="text-sm text-gray-600">
            Total: ₹{order.total_amount}
          </p>

          {order.status !== "served" && (
            <button
              onClick={() =>
                navigate(
                  `/dashboard/waiter/tables/${tableId}/order/${order.id}`
                )
              }
              className="mt-3 bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
            >
              Edit Order
            </button>
          )}

          {order.status === "served" && (
            <button
              onClick={() => handleRequestBill(tableId)}
              className="mt-3 ml-3 bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
            >
              Request Bill
            </button>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default TableOrders;