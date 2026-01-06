import React from "react"

const TableForm = ({
  showForm,
  editingTable,
  formData,
  errors,
  onInputChange,
  onSubmit,
  onCancel,
}) => {
  if (!showForm) return null

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingTable ? "Edit Table" : "Add New Table"}
      </h2>

      <div className="space-y-4">
        {/* Table Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Table Number
          </label>
          <input
            type="number"
            name="table_number"
            value={formData.table_number}
            onChange={onInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.table_number && (
            <p className="text-red-500 text-sm mt-1">{errors.table_number}</p>
          )}
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seating Capacity
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={onInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.capacity && (
            <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
          )}
        </div>

        {/* Status */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={onInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Bill Requested">Bill Requested</option>
            <option value="Closed">Closed</option>
          </select>
        </div> */}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {editingTable ? "Update Table" : "Add Table"}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default TableForm
