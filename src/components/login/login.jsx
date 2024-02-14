// src/App.js
import React, { useState } from "react";
import { Typography, styled, Container, Link, Box } from "@mui/material";
import { motion } from "framer-motion";
import LoginForm from "./loginForm";
import { useNavigate, Navigate } from "react-router-dom";
import { loginService } from "../../api/api";
import { useSnackbar } from "notistack";

const RootStyle = styled("div")({
  background: "rgb(249, 250, 251)",
  height: "100vh",
  display: "grid",
  placeItems: "center",
});

const HeadingStyle = styled(Box)({
  textAlign: "center",
});

const ContentStyle = styled("div")({
  maxWidth: 480,
  padding: 25,
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  background: "#fff",
  borderRadius: "15px",
});

let easing = [0.6, -0.05, 0.01, 0.99];
const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  let isAuthenticated = !!localStorage.getItem("accessToken");

  const handleSubmit = async (email, password) => {
    try {
      setLoading(true);
      let response = await loginService({ email, password });
      response = response.data;
      localStorage.setItem("accessToken", response.data.accessToken);
      enqueueSnackbar(response.message, { variant: "success" });
      setLoading(false);
      navigation("/student");
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
        preventDuplicate: false,
      });
    }
  };

  return !isAuthenticated ? (
    <RootStyle>
      <Container maxWidth="sm">
        <ContentStyle>
          <HeadingStyle component={motion.div} {...fadeInUp}>
            <Box>
              <Link to="/">
                <Box
                  component="img"
                  src="/static/icon_logo_image.png"
                  alt="logo"
                  style={{ width: "175px", height: "175px" }}
                />
              </Link>
            </Box>
            <Typography
              sx={{ color: "text.secondary" }}
              style={{
                fontSize: "19px",
                marginTop: "20px",
                marginBottom: "20px",
                opacity: 1,
                fontWeight: "bolder",
              }}
            >
              Venkatalakshmi Matriculation Higher Secondary School
            </Typography>
            <Typography
              sx={{ color: "text.secondary", mb: 5 }}
              style={{ marginBottom: "25px" }}
              fontSize={"1.4rem"}
              fontWeight="bolder"
            >
              Admin Login
            </Typography>
          </HeadingStyle>
          <LoginForm handleLoginSubmit={handleSubmit} loading={loading} />
        </ContentStyle>
      </Container>
    </RootStyle>
  ) : (
    <Navigate to="/dashboard" />
  );
};

export default Login;
