export const logout = async () => {
  const refresh = localStorage.getItem("refresh_token");

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/workers/logout/`,
      { refresh }
    );
  } catch (err) {
    console.warn("Logout API failed, clearing locally");
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");

  return true;
};
