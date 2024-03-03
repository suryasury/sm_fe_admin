import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const ToggleConfirmationModal = ({
  open,
  handleClose,
  handleConfirm,
  loading = false,
  id,
  name,
  admissionNumber,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle color={"#d32f2f"}>Confirm Action - Mark Active</DialogTitle>
      <DialogContent>
        <Typography
          variant="body2"
          color="textSecondary"
          mb={1}
          fontWeight={"normal"}
          fontSize={"17px"}
        >
          Are you certain you wish to mark this student as Active?
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={2}>
          Admission No: <b>{admissionNumber || ""}</b>
          <br />
          Student Name: <b>{name || ""}</b>
        </Typography>
        <Alert severity="info" style={{ marginTop: "10px" }}>
          This action will make the student status as Active.
        </Alert>
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
          onClick={() => {
            handleConfirm(id);
          }}
          color="error"
          variant="contained"
          loading={loading}
          style={{
            margin: "20px",
          }}
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ToggleConfirmationModal;
