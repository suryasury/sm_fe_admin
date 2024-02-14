import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography, Container, CssBaseline, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PasswordResetSuccessPage = () => {
  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        marginTop: "100px",
      }}
    >
      <CssBaseline />
      <div>
        <Typography variant="h1" color="error" align="center" gutterBottom>
          <Box color="success.main" marginBottom="10px">
            <CheckCircleIcon sx={{ fontSize: "6rem" }} />
          </Box>
        </Typography>
        <Typography variant="h4" color="InfoText" align="center" gutterBottom>
          Password changed successfully
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          You can now login with your new password
        </Typography>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default PasswordResetSuccessPage;
