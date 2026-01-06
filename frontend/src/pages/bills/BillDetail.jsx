import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { fetchSingleBill } from "../../api/BillingApi";
import { showError } from "../../../utils/toast";

const TAX_RATE = 0.10;

const BillDetailPage = () => {
  const { billId } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBill = async () => {
      try {
        setLoading(true);
        const response = await fetchSingleBill(billId);
        setBill(response);
      } catch {
        showError("Failed to load bill");
      } finally {
        setLoading(false);
      }
    };
    loadBill();
  }, [billId]);

  if (loading) {
    return (
      <DashboardLayout title="Bill Details">
        <p className="text-gray-500">Loading bill...</p>
      </DashboardLayout>
    );
  }

  if (!bill) {
    return (
      <DashboardLayout title="Bill Details">
        <p className="text-red-500">Bill not found</p>
      </DashboardLayout>
    );
  }

  const items = bill.order.items;

  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const tax = subtotal * TAX_RATE;
  const total = parseFloat(bill.total_amount) || 0;


  const downloadPDF = () => {
    const printWindow = window.open("", "", "width=800,height=600");

    printWindow.document.write(`
      <html>
      <head>
        <title>Bill ${bill.order.order_number}</title>
        <style>
          body { font-family: Arial; padding: 40px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; border-bottom: 1px solid #ddd; }
          th { background: #333; color: white; text-align: left; }
          .right { text-align: right; }
        </style>
      </head>
      <body>
        <h2>Restaurant Bill</h2>
        <p>Table: ${bill.order.table.table_number}</p>
        <p>Order: ${bill.order.order_number}</p>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th class="right">Qty</th>
              <th class="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(i => `
              <tr>
                <td>${i.menu_item.name}</td>
                <td class="right">${i.quantity}</td>
                <td class="right">₹${(i.price * i.quantity).toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <p>Subtotal: ₹${subtotal.toFixed(2)}</p>
        <p>Tax: ₹${tax.toFixed(2)}</p>
        <h3>Total: ₹${total.toFixed(2)}</h3>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <DashboardLayout title="Bill Details">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">
          Table {bill.order.table.table_number}
        </h2>

        <p className="text-gray-600">
          Order: {bill.order.order_number}
        </p>

        <p className="text-gray-600 mb-4">
          Status: <span className="font-semibold">{bill.status}</span>
        </p>

        <table className="w-full mb-6">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.menu_item.name}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right space-y-1">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>Tax: ₹{tax.toFixed(2)}</p>
          <p className="text-xl font-bold">
            Total: ₹{total.toFixed(2)}
          </p>
        </div>

        <button
          onClick={downloadPDF}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Print / Download PDF
        </button>
      </div>
    </DashboardLayout>
  );
};

export default BillDetailPage;
