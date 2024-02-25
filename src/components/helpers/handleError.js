// import { useNavigate } from "react-router-dom";
export const HandleError = (err) => {
  //   const navigate = useNavigate();
  if (err?.response?.status === 401) {
    localStorage.removeItem("accessToken");
    window.history.pushState({}, "", "/login");
  }
};
