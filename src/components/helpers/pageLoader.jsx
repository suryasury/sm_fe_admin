import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const PageLoader = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="80vh"
      width="100%"
    >
      <Box textAlign="center">
        <CircularProgress size={80} color="primary" />
        <Typography variant="h6" color="textSecondary" mt={2}>
          Loading...
        </Typography>
      </Box>
    </Box>
  );
};

export default PageLoader;
