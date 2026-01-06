import React, { useState,useEffect } from "react"
import TableForm from "./TableForm"
import TableDashboard from "./TableDashboard"
import DashboardLayout from "../../layouts/DashboardLayout"
import { fetchTables,addTableApi, editTableApi, removeTableApi,tabelStatusChangeApi } from "../../api/TablesApi"
import { showError,showSuccess } from "../../../utils/toast"
import { useStatusSocket } from "../../hooks/useWebsocket"

const TableManagement = () => {
  const [tables, setTables] = useState([])


  const [showForm, setShowForm] = useState(false)
  const [editingTable, setEditingTable] = useState(null)
  const [loading, setLoading] = useState(false)
  const [refreshTables, setRefreshTables] = useState(false)
  useStatusSocket(setTables)


  const [formData, setFormData] = useState({
    number: "",
    capacity: "",
  })
  const [errors, setErrors] = useState({})


  // Fetch tables
  useEffect(() => {
    const getTables = async () => {
      try {
        setLoading(true)
        const response = await fetchTables()
        setTables(response) 
      } catch (error) {
        
      } finally {
        setLoading(false)
      }
    }

    getTables()
  }, [refreshTables])

  const handleSubmit = async () => {
  try {
    setLoading(true)

    if (editingTable) {
      await editTableApi(formData,editingTable.id)
      showSuccess("Successfull updated")
    } else {
      await addTableApi(formData)
    }
    resetForm()
    setRefreshTables(prev=>!prev)
  } catch (error) {
    showError(
      error?.response?.data?.detail || "Failed to save table"
    )
    console.error(error)
  } finally {
    setLoading(false)
  }
}

const onDeleteTable = async (table_id)=>{
    try{
        await removeTableApi(table_id)
        showSuccess(" Deleted Successfully")
        setRefreshTables(prev=>!prev)
    }catch(error){
    showError(
      error?.response?.data?.error || "Failed to delete"
    )
    console.error(error)
    }
}

const onStatusChange = async (table_id,status)=>{
    try{
        await tabelStatusChangeApi(table_id,status)
        showSuccess(" successfully updated")
    }catch(error){
    showError(
      error?.response?.data?.error || "Failed to update"
    )
    console.error(error)
    }
}

  const resetForm = () => {
    setShowForm(false)
    setEditingTable(null)
    setFormData({ number: "", capacity: "" })
    setErrors({})
  }

  return (
    <DashboardLayout title="Table Management">
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">
            Restaurant Table Management
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            + Add Table
          </button>
        </div>

        <TableForm
          showForm={showForm}
          editingTable={editingTable}
          formData={formData}
          errors={errors}
          onInputChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        <TableDashboard
          tables={tables}
          onEdit={(table) => {
            setEditingTable(table)
            setFormData(table)
            setShowForm(true)
          }}
          onDelete={onDeleteTable}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
</DashboardLayout>
  )
}

export default TableManagement
