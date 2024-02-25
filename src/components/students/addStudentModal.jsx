import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  InputAdornment,
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const AddStudentModal = ({
  open,
  handleClose,
  sections = [],
  loading = false,
  handleSubmitData,
}) => {
  const addStudentSchema = Yup.object().shape({
    admissionNumber: Yup.string().required("Admission No is required"),
    studentName: Yup.string().required("Student Name is required"),
    fathersName: Yup.string().required("Fathers Name is required"),
    // // mothersName: Yup.string().required("Admission No is required"),
    section: Yup.number()
      .required("Select a Standard & Section")
      .moreThan(0, "Select a Standard & Section"),
    parentMobileNumber: Yup.string().required("Mobile Number is required"),
    // // alternateMobileNumber: Yup.string().required("Admission No is required"),
    parentEmail: Yup.string()
      .email("Invalid email id")
      .required("Email is required"),
    termOneFees: Yup.number("Enter valid fees")
      .optional()
      .moreThan(0, "Fees should not be zero"),
    termOneSCFees: Yup.number().when(["termOneFees"], {
      is: (termOneFees) => termOneFees && termOneFees !== "",
      then: () => Yup.number().required("Term One SC Fees is required"),
      //   .moreThan(0, "SC Fees should not be zero"),
    }),
    termOneDueDate: Yup.string().when("termOneFees", {
      is: (val) => val && val !== "",
      then: () => Yup.date().required("Term One Due Date is required"),
    }),
    termTwoFees: Yup.number().optional().moreThan(0, "Fees should not be zero"),
    termTwoSCFees: Yup.number().when("termTwoFees", {
      is: (val) => val && val !== "",
      then: () => Yup.number().required("Term Two SC Fees is required"),
      //   .moreThan(0, "SC Fees should not be zero"),
    }),
    termTwoDueDate: Yup.string().when("termTwoFees", {
      is: (val) => val && val !== "",
      then: () => Yup.date().required("Term Two Due Date is required"),
    }),
    termThreeFees: Yup.number()
      .optional()
      .moreThan(0, "Fees should not be zero"),
    termThreeSCFees: Yup.string().when("termThreeFees", {
      is: (val) => val && val !== "",
      then: () => Yup.number().required("Term Three SC Fees is required"),
      //   .moreThan(0, "SC Fees should not be zero"),
    }),
    termThreeDueDate: Yup.string().when("termThreeFees", {
      is: (val) => val && val !== "",
      then: () => Yup.date().required("Term Three Due Date is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      admissionNumber: "",
      studentName: "",
      fathersName: "",
      mothersName: "",
      section: 0,
      parentMobileNumber: "",
      alternateMobileNumber: "",
      parentEmail: "",
      termOneFees: "",
      termOneSCFees: "",
      termOneDueDate: "",
      termTwoFees: "",
      termTwoSCFees: "",
      termTwoDueDate: "",
      termThreeFees: "",
      termThreeSCFees: "",
      termThreeDueDate: "",
    },
    validationSchema: addStudentSchema,
    onSubmit: async (data, resetForm) => {
      handleSubmitData(data, resetForm);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, setFieldValue } =
    formik;

  const handleOnFocus = (e) => {
    return e.target.addEventListener(
      "wheel",
      function (e) {
        e.preventDefault();
      },
      { passive: false }
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle variant="h5" style={{ paddingBottom: "7px" }}>
        Add Student
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
                    <MenuItem value={section.id} key={section.id}>
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
          <DialogContent style={{ padding: "10px 00px 0px 25px" }}>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { mr: 1, ml: 1, width: "25ch" },
                "& .css-1nrlq1o-MuiFormControl-root": {
                  m: 1,
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
                mb={2}
                fontSize={"17px"}
              >
                Term - 1 Fees Details
              </Typography>
              <TextField
                onFocus={handleOnFocus}
                label="Fees Amount"
                type="number"
                {...getFieldProps("termOneFees")}
                error={Boolean(touched.termOneFees && errors.termOneFees)}
                helperText={touched.termOneFees && errors.termOneFees}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
              <TextField
                onFocus={handleOnFocus}
                label="SC Fees Amount"
                type="number"
                {...getFieldProps("termOneSCFees")}
                error={Boolean(touched.termOneSCFees && errors.termOneSCFees)}
                helperText={touched.termOneSCFees && errors.termOneSCFees}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
              <FormControl
                error={Boolean(touched.termOneDueDate && errors.termOneDueDate)}
                style={{ marginTop: "0px", marginLeft: "0" }}
              >
                <DatePicker
                  label="Term One Due Date"
                  onChange={(newValue) => {
                    setFieldValue("termOneDueDate", newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                {Boolean(touched.termOneDueDate && errors.termOneDueDate) && (
                  <FormHelperText>
                    {touched.termOneDueDate && errors.termOneDueDate}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          </DialogContent>
          <DialogContent style={{ padding: "10px 0px 0px 25px" }}>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { mr: 1, ml: 1, width: "25ch" },
                "& .css-1nrlq1o-MuiFormControl-root": {
                  m: 1,
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
                mb={2}
                fontSize={"17px"}
              >
                Term - 2 Fees Details
              </Typography>
              <TextField
                onFocus={handleOnFocus}
                label="Fees Amount"
                type="number"
                {...getFieldProps("termTwoFees")}
                error={Boolean(touched.termTwoFees && errors.termTwoFees)}
                helperText={touched.termTwoFees && errors.termTwoFees}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
              <TextField
                label="SC Fees Amount"
                type="number"
                onFocus={handleOnFocus}
                {...getFieldProps("termTwoSCFees")}
                error={Boolean(touched.termTwoSCFees && errors.termTwoSCFees)}
                helperText={touched.termTwoSCFees && errors.termTwoSCFees}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
              <FormControl
                error={Boolean(touched.termTwoDueDate && errors.termTwoDueDate)}
                style={{ marginTop: "0px", marginLeft: "0" }}
              >
                <DatePicker
                  label="Term One Due Date"
                  onChange={(newValue) => {
                    setFieldValue("termTwoDueDate", newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                {Boolean(touched.termTwoDueDate && errors.termTwoDueDate) && (
                  <FormHelperText>
                    {touched.termTwoDueDate && errors.termTwoDueDate}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          </DialogContent>
          <DialogContent style={{ padding: "10px 0px 0px 25px" }}>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { mr: 1, ml: 1, width: "25ch" },
                "& .css-1nrlq1o-MuiFormControl-root": {
                  m: 1,
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
                mb={2}
                fontSize={"17px"}
              >
                Term - 3 Fees Details
              </Typography>
              <TextField
                label="Fees Amount"
                type="number"
                onFocus={handleOnFocus}
                {...getFieldProps("termThreeFees")}
                error={Boolean(touched.termThreeFees && errors.termThreeFees)}
                helperText={touched.termThreeFees && errors.termThreeFees}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
              <TextField
                label="SC Fees Amount"
                type="number"
                onFocus={handleOnFocus}
                {...getFieldProps("termThreeSCFees")}
                error={Boolean(
                  touched.termThreeSCFees && errors.termThreeSCFees
                )}
                helperText={touched.termThreeSCFees && errors.termThreeSCFees}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
              <FormControl
                error={Boolean(
                  touched.termThreeDueDate && errors.termThreeDueDate
                )}
                style={{ marginTop: "0px", marginLeft: "0" }}
              >
                <DatePicker
                  label="Term One Due Date"
                  onChange={(newValue) => {
                    setFieldValue("termThreeDueDate", newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                {Boolean(
                  touched.termThreeDueDate && errors.termThreeDueDate
                ) && (
                  <FormHelperText>
                    {touched.termThreeDueDate && errors.termThreeDueDate}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleClose();
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

export default AddStudentModal;
