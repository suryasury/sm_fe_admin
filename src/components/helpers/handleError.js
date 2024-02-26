export const HandleError = (err, navigate) => {
  if (err?.response?.status === 401) {
    localStorage.removeItem("accessToken");
    navigate("/login");
  }
};
