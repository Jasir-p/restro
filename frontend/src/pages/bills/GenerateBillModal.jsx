import { useNavigate } from "react-router-dom";
import { generateBill } from "../../api/BillingApi";
import { showError } from "../../../utils/toast";

const GenerateBillModal = ({ data, onClose,refresh }) => {
  const navigate = useNavigate();

  const handleGenerateBill = async () => {
    try{
        const addBill = await generateBill(data?.table?.id,data?.id)
        refresh((prev)=>!prev)
    }catch(error){
      showError(error.response?.data?.detail);
      
        return error
    }

    const billId = 101; // returned from backend

    onClose();
    navigate(`/dashboard/cashier`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">
          Generate Bill
        </h3>

        <div className="space-y-2 text-sm">
          <p>
            <span className="text-gray-500">Table:</span>{" "}
            <strong>{data?.table?.table_number}</strong>
          </p>

          <p>
            <span className="text-gray-500">Order:</span>{" "}
            <strong>{data?.order_number}</strong>
          </p>

          <p>
            <span className="text-gray-500">Amount:</span>{" "}
            <strong>₹{data?.total_amount}</strong>
          </p>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleGenerateBill}
            className="flex-1 bg-blue-600 text-white py-2 rounded"
          >
            Generate Bill
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateBillModal;
