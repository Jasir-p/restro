const categories = [
  { label: "All", value: "all" },
  { label: "Starter", value: "starter" },
  { label: "Main", value: "main" },
  { label: "Drinks", value: "drinks" },
  { label: "Dessert", value: "dessert" },
]


const MenuForm = ({
  showForm,
  editingItem,
  formData,
  setFormData,
  onSubmit,
  onCancel,
}) => {
  if (!showForm) return null

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingItem ? "Edit Menu Item" : "Add Menu Item"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Item name"
          className="input"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />

        <select
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          className="input"
        >
          {categories.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Price"
          className="input"
          value={formData.price}
          onChange={e => setFormData({ ...formData, price: e.target.value })}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_available}
            onChange={e =>
              setFormData({ ...formData, is_available: e.target.checked })
            }
          />
          Available
        </label>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="btn-primary" onClick={onSubmit}>
          {editingItem ? "Update" : "Add"}
        </button>
        <button className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default MenuForm
