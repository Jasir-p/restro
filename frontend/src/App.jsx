import { useState } from 'react'
import Login from "./pages/Login";
import { Routes,Route } from "react-router-dom";
import './App.css'
import WaiterDashboard from './pages/waiter/WaiterDashboard';
import CashierDashboard from './pages/cashier/CashierDashboard';
import ManagerDashboard from './pages/Manager/ManagerDashboard';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import ProtectedRoute from './routes/ProtectedRoute';
import TableManagement from './pages/table/TableManagement';
import MenuManagement from './pages/menuitems/MenuManagement';
import TableOrders from './pages/orders/TableOrder';
import OrderEditor from './pages/orders/OrderEditor';
import BillDetailPage from './pages/bills/BillDetail';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/dashboard/waiter" element ={<ProtectedRoute><WaiterDashboard/></ProtectedRoute>}/>
      <Route path='/dashboard/cashier' element = {<ProtectedRoute><CashierDashboard/></ProtectedRoute>}/>
      <Route path='/dashboard/manager'element ={<ProtectedRoute><ManagerDashboard/></ProtectedRoute>}/>
      <Route path='/dashboard/manager/tables'element ={<ProtectedRoute><TableManagement/></ProtectedRoute>}/>
      <Route path='/dashboard/manager/menuitems'element ={<ProtectedRoute><MenuManagement/></ProtectedRoute>}/>
      <Route path="/dashboard/waiter/tables/:tableId" element ={<ProtectedRoute><TableOrders/></ProtectedRoute>}/>
      <Route path="/dashboard/waiter/tables/:tableId/order/new" element ={<ProtectedRoute><OrderEditor/></ProtectedRoute>}/>
      <Route path="/dashboard/waiter/tables/:tableId/order/:orderId" element ={<ProtectedRoute><OrderEditor/></ProtectedRoute>}/>
      <Route path="/dashboard/cashier/bills/:billId" element ={<ProtectedRoute><BillDetailPage/></ProtectedRoute>}/>
    </Routes>
    <ToastContainer autoClose = {3000} hideProgressBar/>

    </>
  )
}

export default App
