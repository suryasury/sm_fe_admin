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
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const EditFeesModal = ({
  open,
  handleClose,
  loading = false,
  handleSubmitData,
  feesDetails,
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
      term: feesDetails?.term || 0,
      due_date: feesDetails?.due_date || "",
      total_amount: feesDetails?.total_amount || "",
      sc_fees: feesDetails?.sc_fees || 0,
    },
    validationSchema: addStudentSchema,
    onSubmit: async (data, resetForm) => {
      handleSubmitData({ ...data, id: feesDetails.id }, resetForm);
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
        Edit Fees Details
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
              <TextField
                label="Term"
                disabled
                type="number"
                {...getFieldProps("term")}
                error={Boolean(touched.term && errors.term)}
                helperText={touched.term && errors.term}
              />
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
                  value={dayjs(getFieldProps("due_date").value)}
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
              Update
            </LoadingButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default EditFeesModal;
