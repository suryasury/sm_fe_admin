import React from "react";
import { CircularProgress, Box } from "@mui/material";

const CardLoader = ({ size }) => {
  return (
    <Box style={{ height: "60px" }}>
      <Box textAlign="center">
        <CircularProgress size={size} color="primary" />
      </Box>
    </Box>
  );
};

export default CardLoader;
