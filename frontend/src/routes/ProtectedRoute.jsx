import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem("access_token")
  const refreshToken = localStorage.getItem("refresh_token")

  if (!accessToken || !refreshToken) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
