export const HandleError = (err, navigate) => {
  if (err?.response?.status === 401) {
    localStorage.removeItem("adminAccessToken");
    navigate("/login");
  }
};
