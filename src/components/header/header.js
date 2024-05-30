import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSelector, useDispatch } from "react-redux";
import { removeUserDetails } from "../../reducers/userSlice";

import ResetPasswordModal from "../resetPassword/resetPasswordModal";

const Header = () => {
  const userDetails = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    dispatch(removeUserDetails());
    navigate("/login");
  };

  const handleProfileMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = () => {
    setAnchorEl(null);
    setModalOpen(true);
  };

  return (
    <AppBar position="sticky" style={{ top: 0, zIndex: 1000 }} color="inherit">
      <Toolbar>
        <img
          src="/static/icon_logo_image.png"
          alt="Logo"
          style={{ margin: "10px", width: "50px", height: "50px" }}
        />
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            marginLeft: "15px",
          }}
        >
          <span
            style={{
              fontWeight: "bolder",
              letterSpacing: "3px",
              opacity: "0.7",
              fontSize: "25px",
            }}
          >
            Demo School
          </span>
        </Typography>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bolder", opacity: "0.7" }}
          >
            {userDetails?.name || ""}
          </Typography>
          <Button color="inherit" onClick={handleProfileMenuClick}>
            <AccountCircleIcon style={{ width: "45px", height: "45px" }} />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            style={{ padding: "20px" }}
          >
            <MenuItem onClick={handleMenuClick}>Reset Password</MenuItem>
            <MenuItem onClick={handleLogout}>
              Logout <LogoutIcon style={{ marginLeft: "10px" }} />
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
      <ResetPasswordModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
      />
    </AppBar>
  );
};

export default Header;
