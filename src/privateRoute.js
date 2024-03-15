import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAdminDetails } from "./api/api";
import { useSelector, useDispatch } from "react-redux";
import { addUserDetails, removeUserDetails } from "./reducers/userSlice";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const isAuthenticated = !!localStorage.getItem("adminAccessToken");
  if (isAuthenticated) {
    GetUserDetails(dispatch);
    return <Outlet />;
  } else return <Navigate to="/login" />;
};

const GetUserDetails = async (dispatch) => {
  try {
    const userDetails = useSelector((state) => state.user.value);
    if (!userDetails) {
      let response = await getAdminDetails();
      response = response.data;
      dispatch(addUserDetails(response.data));
    }
  } catch (err) {
    // dispatch(removeUserDetails());
    console.log("err", err);
  }
};

export default PrivateRoute;
