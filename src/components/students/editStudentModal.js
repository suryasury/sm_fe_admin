import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";

const EditStudentDetailsModal = ({
  open,
  handleClose,
  sections = [],
  loading = false,
  handleSubmitData,
  studentDetails,
}) => {
  const addStudentSchema = Yup.object().shape({
    admissionNumber: Yup.string().required("Admission No is required"),
    studentName: Yup.string().required("Student Name is required"),
    fathersName: Yup.string().required("Fathers Name is required"),
    section: Yup.number()
      .required("Select a Standard & Section")
      .moreThan(0, "Select a Standard & Section"),
    parentMobileNumber: Yup.string().required("Mobile Number is required"),
    parentEmail: Yup.string()
      .email("Invalid email id")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      admissionNumber: studentDetails?.admission_number || "",
      studentName: studentDetails?.name || "",
      fathersName: studentDetails?.father_name || "",
      mothersName: studentDetails?.mother_name || "",
      section: studentDetails?.standard?.id || 0,
      parentMobileNumber: studentDetails?.primary_mobile_no || "",
      alternateMobileNumber: studentDetails?.alternate_mobile_number || "",
      parentEmail: studentDetails?.parent_email || "",
    },
    validationSchema: addStudentSchema,
    onSubmit: async (data, resetForm) => {
      handleSubmitData({ ...data, id: studentDetails.id }, resetForm);
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
        Edit Student Details
      </DialogTitle>
      <hr style={{ width: "100%" }} />
      <FormikProvider value={formik}>
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <DialogContent style={{ padding: "10px 0px 0px 25px" }}>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 2, width: "25ch" },
                "& .css-1nrlq1o-MuiFormControl-root": {
                  m: 2,
                  width: "25ch",
                  padding: "0ch",
                },
              }}
              noValidate
              autoComplete="off"
            >
              <Typography
                variant="body2"
                color="textSecondary"
                mb={1}
                fontSize={"17px"}
              >
                Student Basic Details
              </Typography>
              <TextField
                label="Admission No"
                type="text"
                disabled
                {...getFieldProps("admissionNumber")}
                error={Boolean(
                  touched.admissionNumber && errors.admissionNumber
                )}
                helperText={touched.admissionNumber && errors.admissionNumber}
              />
              <TextField
                label="Student Name"
                type="text"
                {...getFieldProps("studentName")}
                error={Boolean(touched.studentName && errors.studentName)}
                helperText={touched.studentName && errors.studentName}
              />
              <TextField
                label="Father's Name"
                type="text"
                {...getFieldProps("fathersName")}
                error={Boolean(touched.fathersName && errors.fathersName)}
                helperText={touched.fathersName && errors.fathersName}
              />
              <TextField
                label="Mother's Name"
                type="text"
                {...getFieldProps("mothersName")}
                error={Boolean(touched.mothersName && errors.mothersName)}
                helperText={touched.mothersName && errors.mothersName}
              />
              <TextField
                label="Parent Mobile Number"
                type="text"
                {...getFieldProps("parentMobileNumber")}
                error={Boolean(
                  touched.parentMobileNumber && errors.parentMobileNumber
                )}
                helperText={
                  touched.parentMobileNumber && errors.parentMobileNumber
                }
              />
              <TextField
                label="Alternate Mobile Number"
                type="text"
                {...getFieldProps("alternateMobileNumber")}
                error={Boolean(
                  touched.alternateMobileNumber && errors.alternateMobileNumber
                )}
                helperText={
                  touched.alternateMobileNumber && errors.alternateMobileNumber
                }
              />
              <TextField
                label="Parent email"
                type="text"
                {...getFieldProps("parentEmail")}
                error={Boolean(touched.parentEmail && errors.parentEmail)}
                helperText={touched.parentEmail && errors.parentEmail}
              />
              <FormControl error={Boolean(touched.section && errors.section)}>
                <InputLabel id="beautiful-dropdown-label">
                  Standard & Section
                </InputLabel>
                <Select
                  labelId="demo-simple-select-readonly-label"
                  id="beautiful-dropdown"
                  label="Standard & Section"
                  {...getFieldProps("section")}
                  helperText={touched.section && errors.section}
                >
                  <MenuItem value={0}>Select section</MenuItem>
                  {sections.map((section) => (
                    <MenuItem value={section.id}>
                      {section.standard} - {section.section}
                    </MenuItem>
                  ))}
                </Select>
                {Boolean(touched.section && errors.section) && (
                  <FormHelperText>
                    {touched.section && errors.section}
                  </FormHelperText>
                )}
              </FormControl>
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
              Update
            </LoadingButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default EditStudentDetailsModal;
