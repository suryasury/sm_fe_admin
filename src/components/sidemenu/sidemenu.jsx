import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SchoolIcon from "@mui/icons-material/School";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import "../../App.css";
import { useNavigate } from "react-router-dom";

const SideMenu = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");

  const sideMenuItems = [
    {
      title: "Students",
      logo: <SchoolIcon />,
      link: "/student",
      id: "student",
    },
    {
      title: "Teachers",
      logo: <SupervisedUserCircleIcon />,
      link: "/teachers",
      id: "teachers",
    },
    {
      title: "Sections",
      logo: <MeetingRoomIcon />,
      link: "/sections",
      id: "sections",
    },
    {
      title: "Admin Users",
      logo: <AdminPanelSettingsIcon />,
      link: "/users",
      id: "adminUsers",
    },
    {
      title: "Fees Transactions",
      logo: <ReceiptIcon />,
      link: "/fees-transactions",
      id: "feesTransactions",
    },
  ];

  useEffect(() => {
    if (!activeTab) {
      let path = window.location.pathname;
      let currentPageItem = sideMenuItems.find((item) =>
        path.includes(item.link)
      );
      setActiveTab(currentPageItem?.id || "");
    }
  }, []);

  const handleListItemClick = (item) => {
    setActiveTab(item.id);
    navigate(item.link);
  };

  return (
    <div>
      <Drawer
        style={{ borderRight: "0px" }}
        variant="permanent"
        classes={{
          paper: "drawerPaper",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontWeight: "lighter" }}>Admin portal</h2>
        </div>
        <List>
          {sideMenuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              style={
                activeTab === item.id
                  ? { backgroundColor: "rgb(225, 225, 225)" }
                  : { backgroundColor: "white" }
              }
              onClick={() => {
                handleListItemClick(item);
              }}
            >
              <ListItemIcon>{item.logo}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default SideMenu;
