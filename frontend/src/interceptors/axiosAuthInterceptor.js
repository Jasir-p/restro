import axios from "axios"

const axiosAuthInterceptor= axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

//  Attach access token to every request
axiosAuthInterceptor.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token")

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

//  Handle token refresh
axiosAuthInterceptor.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refresh_token")

        if (!refreshToken) {
        //   logout()
          return Promise.reject(error)
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
          { refresh: refreshToken }
        )
        const { access, refresh } = response.data

        localStorage.setItem("access_token", access)
        localStorage.setItem("refresh_token", refresh)

        originalRequest.headers.Authorization =
          `Bearer ${access}`

        return axiosAuthInterceptor(originalRequest)
      } catch (refreshError) {
        // logout()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosAuthInterceptor
