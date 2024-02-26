import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const TableLoader = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="50vh"
      width="100%"
    >
      <Box textAlign="center">
        <CircularProgress size={50} color="primary" />
        <Typography variant="h6" color="textSecondary" mt={2}>
          Loading Data
        </Typography>
      </Box>
    </Box>
  );
};

export default TableLoader;
