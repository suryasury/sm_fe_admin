import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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

const AddFeesModal = ({
  open,
  handleClose,
  terms = [],
  loading = false,
  handleSubmitData,
}) => {
  const addStudentSchema = Yup.object().shape({
    term: Yup.number()
      .required("Term is required")
      .moreThan(0, "Term is required"),
    due_date: Yup.date().required("Due date is required"),
    total_amount: Yup.number()
      .required("Fees amount is required")
      .moreThan(0, "Fees should not be zero"),
    sc_fees: Yup.number().required("SC Fess is required"),
  });

  const formik = useFormik({
    initialValues: {
      term: 0,
      due_date: "",
      total_amount: "",
      sc_fees: "",
    },
    validationSchema: addStudentSchema,
    onSubmit: async (data, resetForm) => {
      handleSubmitData(data, resetForm);
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    resetForm,
    setFieldValue,
  } = formik;

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
        Add Fees Details
      </DialogTitle>
      <hr style={{ width: "100%" }} />
      <FormikProvider value={formik}>
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <DialogContent style={{ padding: "10px 0px 0px 25px" }}>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 2, width: "25ch" },
                "& .MuiFormControl-root": {
                  m: 1,
                  width: "25ch",
                  padding: "0ch",
                },
              }}
              noValidate
              autoComplete="off"
            >
              <FormControl error={Boolean(touched.term && errors.term)}>
                <InputLabel id="beautiful-dropdown-label">Term</InputLabel>
                <Select
                  labelId="demo-simple-select-readonly-label"
                  id="beautiful-dropdown"
                  label="Term"
                  {...getFieldProps("term")}
                  helperText={touched.term && errors.term}
                >
                  <MenuItem value={0}>Select a Term</MenuItem>
                  {terms.map((term, index) => (
                    <MenuItem value={term.termId} key={index}>
                      {term.text}
                    </MenuItem>
                  ))}
                </Select>
                {Boolean(touched.term && errors.term) && (
                  <FormHelperText>{touched.term && errors.term}</FormHelperText>
                )}
              </FormControl>
              <TextField
                label="Term Fees"
                type="number"
                {...getFieldProps("total_amount")}
                error={Boolean(touched.total_amount && errors.total_amount)}
                helperText={touched.total_amount && errors.total_amount}
              />
              <TextField
                label="SC Fees"
                type="number"
                {...getFieldProps("sc_fees")}
                error={Boolean(touched.sc_fees && errors.sc_fees)}
                helperText={touched.sc_fees && errors.sc_fees}
              />
              <FormControl
                error={Boolean(touched.due_date && errors.due_date)}
                style={{ marginTop: "0px", marginLeft: "0" }}
              >
                <DatePicker
                  label="Due Date"
                  onChange={(newValue) => {
                    setFieldValue("due_date", newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                {Boolean(touched.due_date && errors.due_date) && (
                  <FormHelperText>
                    {touched.due_date && errors.due_date}
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
              Add
            </LoadingButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default AddFeesModal;
