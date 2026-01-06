import React from "react"

const statusColors = {
  available: "bg-green-100 border-green-500 text-green-800",
  occupied: "bg-red-100 border-red-500 text-red-800",
  bill_requested: "bg-yellow-100 border-yellow-500 text-yellow-800",
  closed: "bg-gray-100 border-gray-500 text-gray-800",
}

const TableDashboard = ({ tables, onEdit, onDelete, onStatusChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Live Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`border-2 rounded-lg p-6 ${statusColors[table.status]}`}
          >
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold">
                  Table {table.table_number}
                </h3>
                <p className="text-sm">Capacity: {table.capacity}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs bg-white bg-opacity-50">
                {table.status}
              </span>
            </div>

            <select
              value={table.status}
              onChange={(e) =>
                onStatusChange(table.id, e.target.value)
              }
              className="w-full mb-4 px-3 py-2 border rounded-lg text-sm"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="bill_requested">Bill Requested</option>
              <option value="closed">Closed</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(table)}
                className="flex-1 bg-white bg-opacity-50 px-3 py-2 rounded hover:bg-opacity-70"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(table.id)}
                className="flex-1 bg-white bg-opacity-50 px-3 py-2 rounded hover:bg-opacity-70"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableDashboard
