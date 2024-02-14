import React from "react";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

import { Box, TextField, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

let easing = [0.6, -0.05, 0.01, 0.99];
const animate = {
  opacity: 1,
  y: 0,
  transition: {
    duration: 0.6,
    ease: easing,
    delay: 0.16,
  },
};

const ForgotPasswordForm = ({ handleFormSubmit, loading }) => {
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email id").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (data) => {
      handleFormSubmit(data.email);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box
          component={motion.div}
          animate={{
            transition: {
              staggerChildren: 0.55,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            animate={animate}
          >
            <TextField
              fullWidth
              autoComplete="username"
              type="text"
              label="Email"
              {...getFieldProps("email")}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
          </Box>
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={animate}
          >
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              style={{
                marginTop: "40px",
                marginBottom: "20px",
              }}
              loading={loading}
            >
              {loading ? "Sending mail..." : "Get password reset link"}
            </LoadingButton>
          </Box>
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={animate}
          >
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button
                fullWidth
                size="small"
                type="submit"
                variant="contained"
                style={{
                  marginBottom: "10px",
                  outline: "none",
                  backgroundColor: "white",
                  boxShadow: "none",
                  color: "blue",
                }}
              >
                Login
              </Button>
            </Link>
          </Box>
        </Box>
      </Form>
    </FormikProvider>
  );
};

export default ForgotPasswordForm;
