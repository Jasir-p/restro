const categories = [
  { label: "All", value: "all" },
  { label: "Starter", value: "starter" },
  { label: "Main", value: "main" },
  { label: "Drinks", value: "drinks" },
  { label: "Dessert", value: "dessert" },
]


const MenuDashboard = ({
  items,
  filterCategory,
  setFilterCategory,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  return (
    <>
      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-2">
            {categories.map(cat => (
            <button
                key={cat.value}
                onClick={() => setFilterCategory(cat.value)}
                className={`px-4 py-2 rounded transition ${
                filterCategory === cat.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
                {cat.label}
            </button>
            ))}

      </div>

      {/* Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.category}</p>
            <p className="font-semibold">${item.price}</p>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => onToggleAvailability(item.id)}
                className={`px-2 py-1 rounded text-xs ${
                  item.is_available ? "bg-green-500" : "bg-red-500"
                } text-white`}
              >
                {item.is_available ? "Available" : "Unavailable"}
              </button>
            </div>

            <div className="flex gap-2 mt-3">
              <button className="btn-secondary" onClick={() => onEdit(item)}>
                Edit
              </button>
              <button
                className="btn-danger"
                onClick={() => onDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default MenuDashboard
