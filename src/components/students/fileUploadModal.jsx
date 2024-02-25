import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  Link,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const FileUploadModal = ({
  open,
  handleClose,
  handleUpload,
  loading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setSelectedFile(null);
        handleClose();
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Master Upload</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" mb={2}>
          Select a File (Allowed formats: .csv files only)
        </Typography>
        <input
          accept=".csv"
          id="contained-button-file"
          multiple={false}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" component="span">
            Choose File
          </Button>
        </label>
        {selectedFile && (
          <Typography variant="body1" style={{ marginTop: 10 }}>
            File name: {selectedFile.name}
          </Typography>
        )}
        <Alert severity="info" style={{ marginTop: "10px" }}>
          Kindly update manditory fields in the sheet. You can download template
          from <Link style={{ cursor: "pointer" }}>here</Link>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
            setSelectedFile(null);
          }}
          color="primary"
          disabled={loading}
        >
          Cancel
        </Button>
        <LoadingButton
          onClick={() => {
            handleUpload(selectedFile);
          }}
          color="inherit"
          variant="contained"
          loading={loading}
          disabled={!Boolean(selectedFile)}
          style={{
            margin: "20px",
            border: "1px solid grey",
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          Upload
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadModal;
