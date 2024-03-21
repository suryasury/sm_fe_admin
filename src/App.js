import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import Login from "./components/login/login";
import PageNotFound from "./components/helpers/pageNotFound";
import ErrorFallBack from "./components/helpers/errorFallBack";
import { SnackbarProvider } from "notistack";
import StudentDetails from "./components/students/studentDetails";
import ForgotPassword from "./components/forgotPassword/forgotPassword";
import ResetPassword from "./components/resetPassword/resetPassword";
import PasswordResetSuccessPage from "./components/resetPassword/passwordResetSuccess";
import Students from "./components/students/students";
import Teachers from "./components/teachers/teachers";
import Sections from "./components/sections/sections";
import AdminUsers from "./components/users/adminUsers";
import FeesTransactions from "./components/feesDetails/feesTransactions";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Provider } from "react-redux";
import store from "./reducers/store";
import Dashboard from "./components/dashboard/dashboard";

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Provider store={store}>
        <SnackbarProvider
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          autoHideDuration={5000}
          preventDuplicate={true}
        >
          <Router>
            <Routes>
              <Route
                path="/login"
                element={<Login />}
                errorElement={<ErrorFallBack />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route
                path="/password/reset/success"
                element={<PasswordResetSuccessPage />}
              />
              <Route
                path="/"
                element={<PrivateRoute />}
                errorElement={<ErrorFallBack />}
              >
                <Route path="/student" element={<Students />} />
                <Route
                  path="/student/:studentId"
                  element={<StudentDetails />}
                />
                <Route path="/student" element={<Students />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/sections" element={<Sections />} />
                <Route path="/users" element={<AdminUsers />} />
                <Route
                  path="/fees-transactions"
                  element={<FeesTransactions />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Dashboard />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Router>
        </SnackbarProvider>
      </Provider>
    </LocalizationProvider>
  );
};

export default App;
