import React, { forwardRef } from "react";
import "./invoice.css";

const InvoiceTemplate = forwardRef(({ feeDetails }) => {
  let feesTransactions = feeDetails?.fees_transactions[0] || {};
  const formatDate = (date) => {
    if (date) {
      var originalDate = new Date(date);
      var formattedDate = originalDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return formattedDate;
    }
    return "N/A";
  };
  const convertToRomanLetters = (num) => {
    const romanNumerals = [
      { value: 1000, numeral: "M" },
      { value: 900, numeral: "CM" },
      { value: 500, numeral: "D" },
      { value: 400, numeral: "CD" },
      { value: 100, numeral: "C" },
      { value: 90, numeral: "XC" },
      { value: 50, numeral: "L" },
      { value: 40, numeral: "XL" },
      { value: 10, numeral: "X" },
      { value: 9, numeral: "IX" },
      { value: 5, numeral: "V" },
      { value: 4, numeral: "IV" },
      { value: 1, numeral: "I" },
    ];
    let result = "";
    for (let i = 0; i < romanNumerals.length; i++) {
      while (num >= romanNumerals[i].value) {
        result += romanNumerals[i].numeral;
        num -= romanNumerals[i].value;
      }
    }
    return result;
  };

  return (
    <div className="invoice-container">
      <header className="invoice-header">
        <div className="company-info">
          <img
            src="/static/icon_logo_image.png"
            alt="Company Logo"
            className="company-logo"
            style={{
              width: "150px",
              height: "150px",
            }}
          />
          <div className="company-details"></div>
        </div>
        <div className="company-details">
          <h1 style={{ fontSize: "17px", lineHeight: "1.3" }}>
            Venkatalakshmi Matriculation Higher Secondary School
          </h1>
          <p style={{ lineHeight: "1.5" }}>
            2136, Trichy Rd, Singanallur
            <br />
            Coimbatore - 641005
            <br />
            vlmhss@yahoo.co.in
            <br />
            www.vlmhss.com
            <br />
            +919659555989
          </p>
        </div>
      </header>
      <section>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#00{feeDetails?.id || ""}</td>
              <td>{formatDate(feeDetails?.updated_at)}</td>
            </tr>
          </tbody>
        </table>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice To</th>
              <th>Payed Through</th>
              <th>Payment Mode</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <p>
                  <span style={{ fontWeight: "bold" }}>Admn No :</span>{" "}
                  {feeDetails?.student?.admission_number || "N/A"}
                  <br />
                  <span style={{ fontWeight: "bold" }}>
                    Student Name :
                  </span>{" "}
                  {feeDetails?.student?.name
                    ? feeDetails?.student?.name.toUpperCase()
                    : "N/A"}
                  <br />
                  <span style={{ fontWeight: "bold" }}>Parent Name :</span>{" "}
                  {feeDetails?.student?.father_name
                    ? feeDetails?.student.father_name.toUpperCase()
                    : feeDetails?.student?.mother_name
                    ? feeDetails?.student.mother_name.toUpperCase()
                    : "N/A"}
                  <br />
                  <span style={{ fontWeight: "bold" }}>Standard :</span>{" "}
                  {feeDetails?.standard?.standard
                    ? feeDetails.standard.standard.toUpperCase()
                    : "N/A"}{" "}
                  -{" "}
                  {feeDetails?.standard?.section
                    ? feeDetails.standard.section.toUpperCase()
                    : "N/A"}
                  <br />
                </p>
              </td>
              <td>
                <span style={{ fontWeight: "bold" }}>
                  {feeDetails?.payed_through || "N/A"}
                </span>
                (
                {feeDetails?.payed_through
                  ? feeDetails?.payed_through === "Online"
                    ? "Via portal"
                    : "Via School"
                  : "N/A"}
                )
              </td>
              <td>
                <span style={{ fontWeight: "bold" }}>
                  {feesTransactions?.payment_mode || "N/A"}
                </span>
                {feesTransactions?.utr_number && (
                  <>(UTR: {feesTransactions?.utr_number})</>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Transaction Date</th>
              <th>Fees(Rs.)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>{convertToRomanLetters(feeDetails?.term || 1)} Term</td>
              <td>{formatDate(feesTransactions?.created_at)}</td>
              <td>₹ {(feeDetails?.total_payable || 0).toFixed(1)}</td>
            </tr>
          </tbody>
          <tfoot></tfoot>
        </table>
      </section>
      <footer className="invoice-footer">
        <p>
          Kindly note that this invoice has been generated electronically, and
          therefore, it does not require a signature for validation.
        </p>
      </footer>
    </div>
  );
});
export default InvoiceTemplate;
