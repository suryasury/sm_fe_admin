import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  Chip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const DeleteConfirmationModal = ({
  open,
  handleClose,
  handleConfirm,
  loading = false,
  id,
  name,
  teacherId,
  sections,
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
          Are you certain you wish to delete this Teacher?
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={2}>
          Teacher Id: <b>{teacherId || ""}</b>
          <br />
          Teacher Name: <b>{name || ""}</b>
          {sections.length > 0 && (
            <>
              <br />
              Mapped Standard:{" "}
              {sections.map((section) => {
                return (
                  <Chip
                    label={
                      section.standard.standard +
                      " - " +
                      section.standard.section
                    }
                    size="small"
                    color="success"
                    style={{ margin: "4px" }}
                  />
                );
              })}
            </>
          )}
        </Typography>
        <Alert severity="info" style={{ marginTop: "10px" }}>
          This action will permanently delete the teacher's data. Any previously
          assigned standards will be released and will need to be manually
          reassigned to another teacher.
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
