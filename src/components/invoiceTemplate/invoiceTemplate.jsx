import React, { forwardRef } from "react";
import "./invoice.css";

const Invoice = forwardRef(
  (
    {
      companyName = "Your Company Name",
      companyAddress = "Company Address",
      city = "City",
      state = "State",
      zipCode = "Zip Code",
      phoneNumber = "Phone Number",
      emailAddress = "Email Address",
      website = "Website",
      invoiceNumber = "0001",
      date = "February 14, 2024",
      clientName = "Client's Name",
      clientAddress = "Client's Address",
      clientCity = "Client's City",
      clientState = "Client's State",
      clientZipCode = "Client's Zip Code",
      items = [],
      subtotal = "0.00",
      tax = "0.00",
      total = "0.00",
      paymentTerms = "Payment Terms",
      logoSrc,
      style,
    },
    ref
  ) => {
    return (
      <div
        className="invoice-container"
        style={{ visibility: "hidden" }}
        ref={ref}
      >
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
            <div className="company-details">
              {/* <h1>{companyName}</h1>
            <p>
              {companyAddress}
              <br />
              {city}, {state}, {zipCode}
              <br />
              {phoneNumber}
              <br />
              {emailAddress}
              <br />
              {website}
            </p> */}
            </div>
          </div>
          <div className="company-details">
            <h1 style={{ fontSize: "17px", lineHeight: "1.3" }}>
              Venkatalakshmi Matriculation Higher Secondary School
            </h1>
            <p style={{ lineHeight: "1.5" }}>
              {/* {companyAddress} */}
              {/* <br /> */}
              {/* {city}, {state}, {zipCode} */}
              {/* <br />
              {phoneNumber}
              <br /> */}
              {/* <br /> */}
              2136, Trichy Rd, Singanallur
              <br />
              Coimbatore - 641005
              <br />
              vlmhss@gmail.com
              {/* {emailAddress} */}
              <br />
              www.vlmhss.com
              {/* {website} */}
            </p>
          </div>
          {/* <div className="invoice-info">
          <h1>Invoice</h1>
          <p>
            <strong>Invoice Number:</strong> {invoiceNumber}
            <br />
            <strong>Date:</strong> {date}
          </p>
        </div> */}
        </header>
        <section>
          {/* <h2>Invoice</h2> */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#{invoiceNumber}</td>
                <td>{date}</td>
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
                    <span style={{ fontWeight: "bold" }}>Admn No :</span> 123456
                    <br />
                    <span style={{ fontWeight: "bold" }}>Student :</span> Surya
                    K
                    <br />
                    <span style={{ fontWeight: "bold" }}>Parent :</span> Kumaran
                    K
                    <br />
                    <span style={{ fontWeight: "bold" }}>Standard :</span> X - C
                    <br />
                  </p>
                </td>
                <td>
                  <span style={{ fontWeight: "bold" }}>Online</span>(Via portal)
                </td>
                <td>
                  <span style={{ fontWeight: "bold" }}>UPI</span>(UTR:
                  89989458673)
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
                <td>Term One</td>
                <td>February 14, 2024</td>
                <td>₹ 50000</td>
              </tr>
            </tbody>
            <tfoot>
              {/* <tr>
              <td colSpan="2">Subtotal:</td>
              <td>{subtotal}</td>
            </tr>
            <tr>
              <td colSpan="2">Tax:</td>
              <td>{tax}</td>
            </tr> */}
              {/* <tr style={{ marginRight: "2rem" }}>
              <td colSpan="3">Total:</td>
              <td>₹50000</td>
            </tr> */}
            </tfoot>
          </table>
          {/* <p>
          <strong>Payment Terms:</strong> {paymentTerms}
        </p> */}
        </section>
        <footer className="invoice-footer">
          <p>
            Kindly note that this invoice has been generated electronically, and
            therefore, it does not require a signature for validation.
          </p>
        </footer>
      </div>
    );
  }
);
export default Invoice;
