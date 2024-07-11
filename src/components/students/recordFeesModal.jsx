import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { recordOfflineFees } from "../../api/api";
import { useSnackbar } from "notistack";
import { useHandleError } from "../helpers/handleError";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const RecordFeesModal = ({ open, handleClose, feesDetails }) => {
  const checkError = useHandleError();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmitForm = async (data, resetForm) => {
    try {
      setLoading(true);
      let response = await recordOfflineFees({
        ...data,
        feesDetailsId: feesDetails.id,
      });
      response = response.data;
      setLoading(false);
      enqueueSnackbar(response.message, { variant: "success" });
      handleClose("success");
      resetForm.resetForm();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      setLoading(false);
      checkError(err);
    }
  };

  const recordFeesSchema = Yup.object().shape({
    paymentDate: Yup.date().required("Payment date is required"),
    paymentMode: Yup.string().required("Payment mode is required"),
    referenceNumber: Yup.string().optional(),
  });

  const formik = useFormik({
    initialValues: {
      paymentDate: "",
      paymentMode: "",
      referenceNumber: "",
    },
    validationSchema: recordFeesSchema,
    onSubmit: async (data, resetForm) => {
      handleSubmitForm(data, resetForm);
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    resetForm,
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
      <DialogTitle>Record offline fees</DialogTitle>
      <FormikProvider value={formik}>
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <DialogContent>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
                "& .MuiFormControl-root": {
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
                Enter fees details
              </Typography>
              <TextField
                label="Term"
                disabled
                defaultValue={feesDetails?.term || "N/A"}
              />
              <TextField
                label="Fees Amount"
                disabled
                defaultValue={(
                  (feesDetails?.total_amount || 0) +
                  Number(feesDetails?.sc_fees || 0)
                ).toFixed(1)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
              <FormControl
                error={Boolean(touched.paymentDate && errors.paymentDate)}
                style={{ marginTop: "0px", marginLeft: "0" }}
                required
              >
                <DatePicker
                  label="Payment date"
                  onChange={(newValue) => {
                    setFieldValue("paymentDate", newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                {Boolean(touched.paymentDate && errors.paymentDate) && (
                  <FormHelperText>
                    {touched.paymentDate && errors.paymentDate}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl
                error={Boolean(touched.paymentMode && errors.paymentMode)}
              >
                <InputLabel id="beautiful-dropdown-label">
                  Payment Mode
                </InputLabel>
                <Select
                  labelId="beautiful-dropdown-label"
                  id="beautiful-dropdown"
                  {...getFieldProps("paymentMode")}
                  label="Payment Mode"
                  name="paymentMode"
                  error={Boolean(touched.paymentMode && errors.paymentMode)}
                  helperText={touched.paymentMode && errors.paymentMode}
                >
                  <MenuItem value={"CASH"}>Cash</MenuItem>
                  <MenuItem value={"CARD"}>Card</MenuItem>
                  <MenuItem value={"UPI"}>UPI</MenuItem>
                </Select>
                {Boolean(touched.paymentMode && errors.paymentMode) && (
                  <FormHelperText>
                    {touched.paymentMode && errors.paymentMode}
                  </FormHelperText>
                )}
              </FormControl>
              <TextField
                label="Reference No(optional)"
                name="referenceNumber"
                type="text"
                {...getFieldProps("referenceNumber")}
                error={Boolean(
                  touched.referenceNumber && errors.referenceNumber,
                )}
                helperText={touched.referenceNumber && errors.referenceNumber}
              />
            </Box>

            <Alert severity="info" style={{ marginTop: "10px" }}>
              The fees amount includes any additional SC fees, if applicable. In
              other words, the fees amount equals the total amount plus any SC
              fees.
            </Alert>
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
              // onClick={handleSubmitForm}
              color="inherit"
              variant="contained"
              type="submit"
              loading={loading}
              style={{
                margin: "20px",
                border: "1px solid grey",
                backgroundColor: "transparent",
                boxShadow: "none",
              }}
            >
              Record
            </LoadingButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default RecordFeesModal;
