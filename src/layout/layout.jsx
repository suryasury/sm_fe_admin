import React from "react";
import Header from "../components/header/header";
import Sidemenu from "../components/sidemenu/sidemenu";

const LayoutWrapper = ({ children }) => {
  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "250px",
        }}
      >
        <Sidemenu />
        <div>{children}</div>
      </div>
    </>
  );
};

export default LayoutWrapper;
