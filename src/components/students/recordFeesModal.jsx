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
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { recordOfflineFees } from "../../api/api";
import { useSnackbar } from "notistack";
import { useHandleError } from "../helpers/handleError";
import { useNavigate } from "react-router-dom";

const RecordFeesModal = ({ open, handleClose, feesDetails }) => {
  const navigate = useNavigate();
  const checkError = useHandleError();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [referenceNo, setReferenceNo] = useState("");

  const handleSubmitForm = async () => {
    try {
      setLoading(true);
      let response = await recordOfflineFees({
        paymentMode: paymentMode,
        referenceNumber: referenceNo,
        feesDetailsId: feesDetails.id,
      });
      response = response.data;
      setPaymentMode("CASH");
      setReferenceNo("");
      setLoading(false);
      enqueueSnackbar(response.message, { variant: "success" });
      handleClose("success");
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      setLoading(false);
      checkError(err);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "paymentMode") {
      setPaymentMode(e.target.value);
    } else if (e.target.name === "referenceNo") {
      setReferenceNo(e.target.value);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setPaymentMode("CASH");
        setReferenceNo("");
        handleClose();
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Record offline fees</DialogTitle>
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
          <TextField
            label="Due Date"
            disabled
            defaultValue={
              feesDetails?.due_date
                ? new Date(feesDetails.due_date).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"
            }
          />
          <FormControl>
            <InputLabel id="beautiful-dropdown-label">Payment Mode</InputLabel>
            <Select
              labelId="beautiful-dropdown-label"
              id="beautiful-dropdown"
              value={paymentMode}
              onChange={handleInputChange}
              label="Payment Mode"
              name="paymentMode"
            >
              <MenuItem value={"CASH"}>Cash</MenuItem>
              <MenuItem value={"CARD"}>Card</MenuItem>
              <MenuItem value={"UPI"}>UPI</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Reference No(optional)"
            name="referenceNo"
            value={referenceNo}
            onChange={handleInputChange}
          />
        </Box>
        <Alert severity="info" style={{ marginTop: "10px" }}>
          The fees amount includes any additional SC fees, if applicable. In
          other words, the fees amount equals the total amount plus any SC fees.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setPaymentMode("CASH");
            setReferenceNo("");
            handleClose();
          }}
          color="primary"
          disabled={loading}
        >
          Cancel
        </Button>
        <LoadingButton
          onClick={handleSubmitForm}
          color="inherit"
          variant="contained"
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
    </Dialog>
  );
};

export default RecordFeesModal;
