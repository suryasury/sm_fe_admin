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

const DeleteConfirmationModal = ({
  open,
  handleClose,
  handleConfirm,
  loading = false,
  name,
  email,
  id,
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
      <DialogTitle color={"#d32f2f"}>Confirm Action - Delete</DialogTitle>
      <DialogContent>
        <Typography
          variant="body2"
          color="textSecondary"
          mb={1}
          fontWeight={"normal"}
          fontSize={"17px"}
        >
          Are you certain you wish to delete this admin?
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={2}>
          Admin name: <b>{name || ""}</b>
          <br />
          Admin email: <b>{email || ""}</b>
        </Typography>
        <Alert severity="info" style={{ marginTop: "10px" }}>
          This action will permanently delete the admin's data.
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

export default DeleteConfirmationModal;
