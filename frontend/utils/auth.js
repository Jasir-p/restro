
export const getAuthData = () => {
  const token = localStorage.getItem("access_token")
  if (!token) return null

  const payload = JSON.parse(atob(token.split(".")[1]))

  const role =
    Array.isArray(payload.roles) && payload.roles.length > 0
      ? payload.roles[0].toLowerCase()
      : null

  return {
    username: payload.username,
    role,
  }
}
