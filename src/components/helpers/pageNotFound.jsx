import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography, Container, CssBaseline } from "@mui/material";

const PageNotFound = () => {
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
          404
        </Typography>
        <Typography variant="h4" color="error" align="center" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Oops! It seems like the page you are looking for does not exist.
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

export default PageNotFound;
