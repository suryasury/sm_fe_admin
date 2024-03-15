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
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { passwordReset } from "../../api/api";
import { useSnackbar } from "notistack";
import { Icon } from "@iconify/react";
import { useHandleError } from "../helpers/handleError";
import { useNavigate } from "react-router-dom";

const ResetPasswordModal = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const checkError = useHandleError();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async () => {
    try {
      if (newPassword.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
      setLoading(true);
      await passwordReset({ password: newPassword });
      setError("");
      setNewPassword("");
      setLoading(false);
      handleClose();
      enqueueSnackbar("Password resetted successfully", { variant: "success" });
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || "");
      checkError(err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" mb={2}>
          Enter your new password to reset your account password.
        </Typography>
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          label="Password"
          error={!!error}
          helperText={error}
          onChange={(e) => setNewPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? (
                    <Icon icon="eva:eye-fill" />
                  ) : (
                    <Icon icon="eva:eye-off-fill" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Alert severity="info" style={{ marginTop: "10px" }}>
          Password should be at least 8 characters long.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setError("");
            setNewPassword("");
            handleClose();
          }}
          color="primary"
          disabled={loading}
        >
          Cancel
        </Button>
        <LoadingButton
          onClick={handleResetPassword}
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
          Reset Password
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordModal;
