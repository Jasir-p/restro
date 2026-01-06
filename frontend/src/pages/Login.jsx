import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LoginApi } from "../api/LoginApi"
import { showError,showSuccess } from "../../utils/toast"
import { getAuthData } from "../../utils/auth"


const roleRouteMap = {
  manager: "/dashboard/manager",
  waiter: "/dashboard/waiter",
  cashier: "/dashboard/cashier",
}

const Login = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const [formErrors, setFormErrors] = useState({})

  const handleChanges = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const handleSubmit = async () => {
  const errors = {}

  if (!formData.username.trim()) errors.username = "Username is required"
  if (!formData.password.trim()) errors.password = "Password is required"

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors)
    return
  }

  setFormErrors({}) // clear old errors

  try {
    const response =await LoginApi(formData)
    showSuccess("Successfully logged in")
    const { access, refresh } = response
    localStorage.setItem("access_token", access)
    localStorage.setItem("refresh_token", refresh)
    
    const auth = getAuthData()
    if (!auth?.role) {
      showError("Role not found")
      return
    }
    
  navigate(roleRouteMap[auth.role] || "/login")

    
    // navigate("/home")
  } catch (error) {
    console.log(error);
    
    showError(
      error?.response?.data?.error || "Invalid username or password"
    )
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sky-600 mb-1">Restro</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChanges}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border rounded-lg outline-none
                         border-gray-300 focus:border-sky-500 focus:ring-2
                         focus:ring-sky-200 transition"
            />
            {formErrors.username && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.username}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChanges}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg outline-none
                         border-gray-300 focus:border-sky-500 focus:ring-2
                         focus:ring-sky-200 transition"
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.password}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="button"
            className="w-full bg-sky-600 text-white py-2.5 rounded-lg
                       font-medium hover:bg-sky-700 active:bg-sky-800
                       transition duration-200"
            onClick={handleSubmit}
          >
            Sign In
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="text-sky-600 hover:text-sky-700 font-medium"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login
