import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  createOrder,
  fetchOrderItems,
  updateOrderItems,
} from "../../api/OrderApi";
import { fetchMenuItems } from "../../api/MenuApi";
import { showError, showSuccess } from "../../../utils/toast";

const OrderEditor = () => {
  const { orderId, tableId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(orderId);

  const [menuItems, setMenuItems] = useState([]);
  const [items, setItems] = useState([]);
  const [draftQty, setDraftQty] = useState({});
  const [loading, setLoading] = useState(false);

  /* ---------------- CREATE MODE: LOAD MENU ---------------- */
  useEffect(() => {
    if (!isEditMode) {
      fetchMenuItems()
        .then(setMenuItems)
        .catch(() => showError("Failed to load menu items"));
    }
  }, [isEditMode]);

  /* ---------------- EDIT MODE: LOAD ORDER ITEMS ---------------- */
  const loadOrderItems = async () => {
    try {
      setLoading(true);
      const res = await fetchOrderItems(orderId);

      const normalized = res.order_items.map((oi) => ({
        orderItemId: oi.id, 
        menuItemId: oi.menu_item.id,
        name: oi.menu_item.name,
        price: oi.menu_item.price,
        quantity: oi.quantity,
      }));

      setItems(normalized);
    } catch {
      showError("Failed to load order items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      loadOrderItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, orderId]);

  /* ---------------- ADD ITEM (CREATE MODE) ---------------- */
  const addItem = (menu) => {
    if (items.some((i) => i.menuItemId === menu.id)) return;

    setItems((prev) => [
      ...prev,
      {
        menuItemId: menu.id,
        name: menu.name,
        price: menu.price,
        quantity: 1,
      },
    ]);
  };

  /* ---------------- UPDATE QUANTITY (EDIT MODE) ---------------- */
  const applyUpdate = async (orderItemId) => {
    const qty = Number(draftQty[orderItemId]);
    if (Number.isNaN(qty)) return;

    try {
      await updateOrderItems(orderItemId, qty);

      // clear draft input
      setDraftQty((prev) => {
        const copy = { ...prev };
        delete copy[orderItemId];
        return copy;
      });

      // refetch updated data
      await loadOrderItems();

      showSuccess("Quantity updated");
    } catch {
      showError("Error while updating item");
    }
  };

  /* ---------------- SAVE (CREATE MODE) ---------------- */
  const handleSave = async () => {
    if (items.length === 0) {
      showError("Order must contain at least one item");
      return;
    }

    const payload = {
      table: Number(tableId),
      items: items.map((i) => ({
        menu_item: i.menuItemId,
        quantity: i.quantity,
      })),
    };

    try {
      await createOrder(payload);
      showSuccess("Order created successfully");
      navigate(`/dashboard/waiter/tables/${tableId}`);
    } catch {
      showError("Failed to create order");
    }
  };

  const totalAmount = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  /* ---------------- UI ---------------- */
  return (
    <DashboardLayout title={`${isEditMode ? "Edit" : "Create"} Order`}>
      {/* ORDER ITEMS */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Order Items</h3>

        {loading && (
          <p className="text-gray-500">Loading items...</p>
        )}

        {!loading && items.length === 0 && (
          <p className="text-gray-500 italic">No items added yet</p>
        )}

        {items.map((item) => (
          <div
            key={item.orderItemId ?? item.menuItemId}
            className="flex justify-between items-center mb-2 border p-3 rounded"
          >
            <span className="font-medium">{item.name}</span>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={
                  isEditMode
                    ? draftQty[item.orderItemId] ?? item.quantity
                    : item.quantity
                }
                onChange={(e) =>
                  isEditMode
                    ? setDraftQty({
                        ...draftQty,
                        [item.orderItemId]: e.target.value,
                      })
                    : setItems((prev) =>
                        prev.map((i) =>
                          i.menuItemId === item.menuItemId
                            ? {
                                ...i,
                                quantity: Number(e.target.value),
                              }
                            : i
                        )
                      )
                }
                className="w-16 border px-2 py-1 rounded"
              />

              {isEditMode && (
                <button
                  onClick={() => applyUpdate(item.orderItemId)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Update
                </button>
              )}

              <span className="font-semibold">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}

        {items.length > 0 && (
          <div className="text-right font-bold mt-2">
            Total: ₹{totalAmount.toFixed(2)}
          </div>
        )}
      </div>

      {/* ADD ITEMS (CREATE MODE ONLY) */}
      {!isEditMode && (
        <>
          <h4 className="font-semibold mb-2">Add Items</h4>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {menuItems.map((menu) => (
              <button
                key={menu.id}
                onClick={() => addItem(menu)}
                className="border p-2 rounded hover:bg-gray-100"
              >
                <p className="font-medium">{menu.name}</p>
                <p className="text-sm text-gray-600">
                  ₹{menu.price}
                </p>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3">
        {!isEditMode && (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
          >
            Save Order
          </button>
        )}

        <button
          onClick={() =>
            navigate(`/dashboard/waiter/tables/${tableId}`)
          }
          className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </DashboardLayout>
  );
};

export default OrderEditor;
