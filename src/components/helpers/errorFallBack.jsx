import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography, Container, CssBaseline } from "@mui/material";

const ErrorFallBack = () => {
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
          OOPS!..
        </Typography>
        <Typography variant="h4" color="error" align="center" gutterBottom>
          Something went wrong in this page.
        </Typography>
        <Link to="/student" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary" fullWidth>
            Go back to the home page
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default ErrorFallBack;
