// import React from "react";
// import { AppBar, Toolbar, Typography, Button } from "@mui/material";
// import LogoutIcon from "@mui/icons-material/Logout";
// import { useNavigate } from "react-router-dom";

// const Header = () => {
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     navigate("/login");
//   };
//   return (
//     <AppBar position="sticky" style={{ top: 0, zIndex: 1000 }} color="inherit">
//       <Toolbar>
//         <img
//           src="/static/icon_logo_image.png"
//           alt="Logo"
//           style={{ margin: "10px", width: "60px", height: "60px" }}
//         />
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//           Admin Portal
//         </Typography>
//         <Button
//           color="inherit"
//           endIcon={<LogoutIcon />}
//           style={{ border: "1px solid grey" }}
//           onClick={handleLogout}
//         >
//           Logout
//         </Button>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;

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

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const handleProfileMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" style={{ top: 0, zIndex: 1000 }} color="inherit">
      <Toolbar>
        <img
          src="/static/icon_logo_image.png"
          alt="Logo"
          style={{ margin: "10px", width: "60px", height: "60px" }}
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          VLMHSS
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
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>My account</MenuItem>
          <MenuItem onClick={handleLogout}>
            Logout <LogoutIcon style={{ marginLeft: "10px" }} />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
