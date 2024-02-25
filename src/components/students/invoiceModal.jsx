import React, { useRef } from "react";
import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import InvoiceTemplate from "../invoiceTemplate/invoiceTemplate";
import { useReactToPrint } from "react-to-print";

const InvoiceModal = ({ open, handleClose, feesDetails }) => {
  const invoiceRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });
  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
      }}
      maxWidth="md"
      fullWidth
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "20px",
        }}
      >
        <DialogTitle color={"#d32f2f"}>Invoice Details</DialogTitle>
        <Button onClick={handlePrint} size="lg" variant="contained">
          Print
        </Button>
      </div>
      <DialogContent>
        <div style={{ overflow: "hidden" }}>
          <div ref={invoiceRef}>
            <InvoiceTemplate feeDetails={feesDetails} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
