import React, { useEffect, useState } from "react";
import { Typography, styled, Grid, Paper, Button } from "@mui/material";
import { Container } from "@mui/system";
import FeeCard from "./feeCards";
import {
  createFeesDetails,
  deleteFeesDetails,
  getStudentDetails,
  updateFeesDetails,
} from "../../api/api";
import PageLoader from "../helpers/pageLoader";
import { useNavigate, useParams } from "react-router-dom";
import NoDataCard from "../helpers/noDataFound";
import { useSnackbar } from "notistack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LayoutWrapper from "../../layout/layout";
import InvoiceModal from "./invoiceModal";
import RecordFeesModal from "./recordFeesModal";
import AddchartIcon from "@mui/icons-material/Addchart";
import AddFeesModal from "./addFeesModal";
import EditFeesModal from "./editFeesModal";
import DeleteFeesConfirmationModal from "./deleteFeesConfirmationModal";
import { HandleError } from "../helpers/handleError";

const RootStyle = styled("div")({
  display: "grid",
  placeItems: "center",
  width: "100%",
});

const StudentDetails = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [pageLoading, setPageLoading] = useState(true);
  const [studentDetails, setStudentDetails] = useState(null);
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [selectedFeesDetails, setSelectedFeesDetails] = useState(null);
  const [openRecordFeesModal, setOpenRecordFeesModal] = useState(false);
  const [isAddFeesEnabled, setIsAddFeesEnabled] = useState(false);
  const [addFeesModal, setAddFeesModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableTerms, setAvailableTerms] = useState([]);
  const [editModal, setEditModal] = useState("");
  const [deleteModal, setDeleteModal] = useState("");

  useEffect(() => {
    if (studentDetails) {
      let feesDetails = studentDetails.fees_details || [];
      let termOneData = feesDetails.find((fee) => fee.term === 1);
      let termTwoData = feesDetails.find((fee) => fee.term === 2);
      let termThreeData = feesDetails.find((fee) => fee.term === 3);
      let canAddFees = false;
      let terms = [];
      if (!termOneData) {
        canAddFees = true;
        terms.push({
          termId: 1,
          text: "Term One",
        });
      }
      if (!termTwoData) {
        canAddFees = true;
        terms.push({
          termId: 2,
          text: "Term Two",
        });
      }
      if (!termThreeData) {
        canAddFees = true;
        terms.push({
          termId: 3,
          text: "Term Three",
        });
      }
      setIsAddFeesEnabled(canAddFees);
      setAvailableTerms(terms);
    }
  }, [studentDetails]);

  const getStudentDetailsService = async () => {
    try {
      setPageLoading(true);
      let studentDetailsObject = await getStudentDetails(studentId);
      if (studentDetailsObject?.data?.data) {
        setStudentDetails(studentDetailsObject?.data?.data);
      }
      setPageLoading(false);
    } catch (err) {
      setPageLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      HandleError(err, navigate);
    }
  };

  useEffect(() => {
    const onPageLoad = () => {
      getStudentDetailsService();
    };
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, false);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, [studentId]);

  const handleSubmitData = async (data, resetForm) => {
    try {
      setLoading(true);
      let response = await createFeesDetails({
        ...data,
        id: studentDetails.id,
        section: studentDetails.standard.id,
        is_paid: false,
      });
      response = response.data;
      enqueueSnackbar(response.message, {
        variant: "success",
      });
      await getStudentDetailsService();
      setLoading(false);
      setAddFeesModal(false);
      resetForm.resetForm();
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      HandleError(err, navigate);
    }
  };

  const handleSubmitEditData = async (data, resetForm) => {
    try {
      setLoading(true);
      let response = await updateFeesDetails(data);
      response = response.data;
      enqueueSnackbar(response.message, {
        variant: "success",
      });
      await getStudentDetailsService();
      setLoading(false);
      setEditModal(false);
      setSelectedFeesDetails(null);
      resetForm.resetForm();
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      HandleError(err, navigate);
    }
  };

  const handleDeleteFees = async (id) => {
    try {
      setLoading(true);
      let response = await deleteFeesDetails(id);
      response = response.data;
      enqueueSnackbar(response.message, {
        variant: "success",
      });
      await getStudentDetailsService();
      setLoading(false);
      setDeleteModal(false);
      setSelectedFeesDetails(null);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      HandleError(err, navigate);
    }
  };

  const handleActionClick = (action, feesDetails) => {
    setSelectedFeesDetails(feesDetails);
    if (action === "edit") {
      setEditModal(true);
    } else if (action === "delete") {
      setDeleteModal(true);
    }
  };

  return (
    <LayoutWrapper>
      <RootStyle>
        {pageLoading ? (
          <PageLoader />
        ) : (
          <>
            <Container
              maxWidth="m"
              style={{ marginTop: "30px", width: "100%" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    <ArrowBackIcon />
                  </div>
                  <Typography
                    variant="h5"
                    style={{
                      opacity: "0.7",
                      fontWeight: "lighter",
                      fontSize: "30px",
                    }}
                  >
                    Student details
                  </Typography>
                </div>
              </div>
              <div
                style={{
                  margin: "30px 0 20px 0",
                  width: "100%",
                }}
              >
                <div style={{ marginTop: "0px" }}>
                  <Paper
                    elevation={3}
                    style={{
                      padding: "20px",
                      marginBottom: "20px",
                      boxShadow: "none",
                      backgroundColor: "rgb(249, 250, 251)",
                      borderRadius: "10px",
                    }}
                  >
                    <Grid container spacing={3} style={{ padding: "20px" }}>
                      <Grid item xs={12} sm={6} lg={3}>
                        <Typography variant="body1">
                          <strong>Student Name:</strong> {studentDetails.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} lg={3}>
                        <Typography variant="body1">
                          <strong>Admission Number:</strong>{" "}
                          {studentDetails.admission_number}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} lg={3}>
                        <Typography variant="body1">
                          <strong>Standard&Section:</strong>{" "}
                          {studentDetails.standard.standard} -{" "}
                          {studentDetails.standard.section}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} lg={3}>
                        <Typography variant="body1">
                          <strong>Fathers Name:</strong>{" "}
                          {studentDetails.father_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} lg={3}>
                        <Typography variant="body1">
                          <strong>Mothers Name:</strong>{" "}
                          {studentDetails.mother_name || (
                            <span
                              style={{
                                color: "red",
                              }}
                            >
                              Not Provided
                            </span>
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} lg={3}>
                        <Typography variant="body1">
                          <strong>Parent Email:</strong>{" "}
                          {studentDetails.parent_email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} lg={3}>
                        <Typography variant="body1">
                          <strong>Mobile number:</strong>{" "}
                          {studentDetails.primary_mobile_no}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} lg={3}>
                        <Typography variant="body1">
                          <strong>Alt Mobile number:</strong>{" "}
                          {studentDetails.alternate_mobile_number || (
                            <span
                              style={{
                                color: "red",
                              }}
                            >
                              Not Provided
                            </span>
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  <Paper
                    elevation={3}
                    style={{
                      boxShadow: "none",
                      borderRadius: "10px",
                      marginTop: "40px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                      }}
                    >
                      <Typography
                        variant="h5"
                        style={{ marginBottom: "0px", fontSize: "30px" }}
                      >
                        Fees Details
                      </Typography>
                      {isAddFeesEnabled && (
                        <Button
                          variant="outlined"
                          endIcon={<AddchartIcon />}
                          onClick={() => {
                            setAddFeesModal(!addFeesModal);
                          }}
                        >
                          Add term fees
                        </Button>
                      )}
                    </div>
                    <Grid container spacing={2} style={{ marginTop: "0px" }}>
                      {studentDetails.fees_details &&
                      studentDetails.fees_details.length > 0 ? (
                        <>
                          {studentDetails.fees_details.map(
                            (feeDetail, index) => (
                              <Grid item xs={12} sm={6} md={4} key={index}>
                                <FeeCard
                                  handleActionClick={(action) => {
                                    handleActionClick(action, feeDetail);
                                  }}
                                  amount={feeDetail.total_amount}
                                  dueDate={feeDetail.due_date}
                                  status={feeDetail.is_paid}
                                  term={feeDetail.term}
                                  feesDetail={feeDetail}
                                  handleClick={() => {
                                    if (feeDetail.is_paid) {
                                      setSelectedFeesDetails({
                                        ...feeDetail,
                                        student: {
                                          name: studentDetails.name,
                                          admission_number:
                                            studentDetails.admission_number,
                                          father_name:
                                            studentDetails.father_name,
                                          mother_name:
                                            studentDetails.mother_name,
                                        },
                                        standard: {
                                          standard:
                                            studentDetails.standard.standard,
                                          section:
                                            studentDetails.standard.section,
                                        },
                                      });
                                      setOpenInvoiceModal(true);
                                    } else {
                                      setSelectedFeesDetails(feeDetail);
                                      setOpenRecordFeesModal(true);
                                    }
                                  }}
                                />
                              </Grid>
                            )
                          )}
                        </>
                      ) : (
                        <NoDataCard />
                      )}
                    </Grid>
                  </Paper>
                  <InvoiceModal
                    feesDetails={selectedFeesDetails}
                    open={openInvoiceModal}
                    handleClose={() => {
                      setSelectedFeesDetails(null);
                      setOpenInvoiceModal(false);
                    }}
                  />
                  <RecordFeesModal
                    open={openRecordFeesModal}
                    handleClose={async (key) => {
                      setOpenRecordFeesModal(false);
                      setSelectedFeesDetails(null);
                      if (key && key === "success") {
                        await getStudentDetailsService();
                      }
                    }}
                    feesDetails={selectedFeesDetails}
                  />
                  <AddFeesModal
                    open={addFeesModal}
                    handleClose={() => {
                      setAddFeesModal(false);
                    }}
                    terms={availableTerms}
                    loading={loading}
                    handleSubmitData={handleSubmitData}
                  />
                  {selectedFeesDetails && editModal && (
                    <EditFeesModal
                      open={editModal}
                      handleClose={() => {
                        setEditModal(false);
                        setSelectedFeesDetails(null);
                      }}
                      loading={loading}
                      handleSubmitData={handleSubmitEditData}
                      feesDetails={selectedFeesDetails}
                    />
                  )}
                  {selectedFeesDetails && deleteModal && (
                    <DeleteFeesConfirmationModal
                      open={deleteModal}
                      loading={loading}
                      id={selectedFeesDetails?.id}
                      term={selectedFeesDetails?.term}
                      handleClose={() => {
                        setSelectedFeesDetails(null);
                        setDeleteModal(false);
                      }}
                      handleConfirm={handleDeleteFees}
                    />
                  )}
                </div>
              </div>
            </Container>
          </>
        )}
      </RootStyle>
    </LayoutWrapper>
  );
};

export default StudentDetails;
