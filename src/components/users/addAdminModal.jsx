import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";

const AddAdminModal = ({
  open,
  handleClose,
  loading = false,
  handleSubmitData,
}) => {
  const addStudentSchema = Yup.object().shape({
    name: Yup.string().required("Admin Name is required"),
    email: Yup.string().email("Invalid email ID").required("Email is required"),
    mobileNumber: Yup.string().required("Mobile Number is required"),
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobileNumber: "",
    },
    validationSchema: addStudentSchema,
    onSubmit: async (data, resetForm) => {
      handleSubmitData(data, resetForm);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, resetForm } = formik;

  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
        resetForm();
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle variant="h5" style={{ paddingBottom: "7px" }}>
        Add Admin
      </DialogTitle>
      <hr style={{ width: "100%" }} />
      <FormikProvider value={formik}>
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <DialogContent style={{ padding: "10px 0px 0px 25px" }}>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
                "& .css-1nrlq1o-MuiFormControl-root": {
                  m: 1,
                  width: "25ch",
                  padding: "0ch",
                },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                label="Admin Name"
                type="text"
                {...getFieldProps("name")}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
              <TextField
                label="Email"
                type="text"
                {...getFieldProps("email")}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                label="Mobile Number"
                type="text"
                {...getFieldProps("mobileNumber")}
                error={Boolean(touched.mobileNumber && errors.mobileNumber)}
                helperText={touched.mobileNumber && errors.mobileNumber}
              />
              <Alert
                severity="info"
                style={{ marginTop: "10px", width: "93%" }}
              >
                By default, the admin's mobile number serves as their password.
                We kindly request admins to reset their password in the admin's
                portal after logging in for enhanced security.
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleClose();
                resetForm();
              }}
              color="primary"
              disabled={loading}
            >
              Cancel
            </Button>
            <LoadingButton
              color="primary"
              variant="contained"
              loading={loading}
              type="submit"
              style={{
                margin: "20px",
              }}
            >
              Add
            </LoadingButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default AddAdminModal;
