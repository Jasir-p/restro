import React, { useEffect, useState } from "react"
import DashboardLayout from "../../layouts/DashboardLayout"
import MenuForm from "./MenuForm"
import MenuDashboard from "./MenuDashboard"
import { showError,showSuccess } from "../../../utils/toast"
import { addMenuItemApi,editMenuItemApi,deleteMenuItemApi,fetchMenuItems } from "../../api/MenuApi"

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [filterCategory, setFilterCategory] = useState("all")
  const [refreshTables, setRefreshTables] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    category: "starter",
    price: "",
    available: true,
  })
  useEffect(() => {
    const getItems = async () => {
      try {
        setLoading(true)
        const response = await fetchMenuItems(filterCategory)
        setMenuItems(response)
        console.log(response);
      } catch (error) {
        showError("Failed to load items")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    getItems()
  }, [refreshTables,filterCategory])

  const resetForm = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormData({
      name: "",
      category: "Starter",
      price: "",
      is_available: true,
    })
  }
  ;
  
  const handleSubmit = async () => {
    try {
      setLoading(true)
        console.log(formData.is_available)
      if (editingItem) {
        await editMenuItemApi(editingItem.id,formData)
        showSuccess("Successfull updated")
      } else {
        await addMenuItemApi(formData)
        showSuccess("Successfull added")
      }
      resetForm()
      setRefreshTables(prev=>!prev)
    } catch (error) {
      showError(
        error?.response?.data?.detail || "Failed to save menu"
      )
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

const onDeleteTable = async (table_id)=>{
    try{
        await deleteMenuItemApi(table_id)
        showSuccess(" Deleted Successfully")
        setRefreshTables(prev=>!prev)
    }catch(error){
    showError(
      error?.response?.data?.error || "Failed to delete"
    )
    console.error(error)
    }
}
  const filteredItems =
    filterCategory === "all"
      ? menuItems
      : menuItems.filter(item => item.category === filterCategory)

  return (
    <DashboardLayout title="Menu Management">
      <div className="bg-gray-50 p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">

          <div className="flex justify-between mb-8">
            <h1 className="text-3xl font-bold">Menu Management</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              + Add Menu Item
            </button>
          </div>

          <MenuForm
            showForm={showForm}
            editingItem={editingItem}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />

          <MenuDashboard
            items={filteredItems}
            setFilterCategory={setFilterCategory}
            filterCategory={filterCategory}
            onEdit={(item) => {
              setEditingItem(item)
              setFormData(item)
              setShowForm(true)
            }}
            onDelete={onDeleteTable}
            onToggleAvailability={(id) =>
              setMenuItems(menuItems.map(item =>
                item.id === id
                  ? { ...item, available: !item.available }
                  : item
              ))
            }
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MenuManagement
