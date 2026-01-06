import axiosAuthInterceptor from "../interceptors/axiosAuthInterceptor"

export const fetchMenuItems = async (filterCategory) => {
    const params =
    filterCategory && filterCategory !== "all"
      ? { category: filterCategory }
      : {}
  const res = await axiosAuthInterceptor.get("/api/menu-items/",{
    params,
  })
  return res.data
}

export const addMenuItemApi = async (data) => {
  const res = await axiosAuthInterceptor.post("/api/menu-items/", data)
  return res.data
}

export const editMenuItemApi = async (id, data) => {
  const res = await axiosAuthInterceptor.patch(`/api/menu-items/${id}/`, data)
  return res.data
}

export const deleteMenuItemApi = async (id) => {
  await axiosAuthInterceptor.delete(`/api/menu-items/${id}/`)
}
