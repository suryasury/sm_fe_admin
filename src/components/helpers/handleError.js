import { useDispatch } from "react-redux";
import { removeUserDetails } from "../../reducers/userSlice";
import { useNavigate } from "react-router-dom";

export const useHandleError = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkError = (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("adminAccessToken");
      dispatch(removeUserDetails());
      navigate("/login");
    }
  };
  return checkError;
};
