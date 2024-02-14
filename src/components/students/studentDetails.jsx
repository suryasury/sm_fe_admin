import React, { useEffect, useState } from "react";
import { Typography, styled, Grid, Paper } from "@mui/material";
import Header from "../header/header";
import { Container } from "@mui/system";
import FeeCard from "../feeCards";
import { getStudentDetails } from "../../api/api";
import PageLoader from "../helpers/pageLoader";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import NoDataCard from "../helpers/noDataFound";
import { useSnackbar } from "notistack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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

  const getStudentDetailsService = async () => {
    try {
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
      console.log("login", err.response.status);
      if (err.response.status === 401) {
        navigate("/login");
        localStorage.removeItem("accessToken");
      }
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

  return (
    <>
      <Header />
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
                          <strong>Name:</strong> {studentDetails.name}
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
                          <strong>Standard/Section:</strong> X - A
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
                          {studentDetails.mother_name}
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
                          <strong>Alternate Mobile number:</strong>{" "}
                          {studentDetails.alternate_mobile_number}
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
                    <Typography
                      variant="h5"
                      style={{ marginBottom: "-20px", fontSize: "30px" }}
                    >
                      Fees Details
                    </Typography>
                    <Grid container spacing={2} style={{ marginTop: "0px" }}>
                      {studentDetails.fees_details &&
                      studentDetails.fees_details.length > 0 ? (
                        <>
                          {studentDetails.fees_details.map(
                            (feeDetail, index) => (
                              <Grid item xs={12} sm={6} md={4} key={index}>
                                <FeeCard
                                  amount={feeDetail.total_amount}
                                  dueDate={feeDetail.due_date}
                                  status={feeDetail.is_paid}
                                  term={feeDetail.term}
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
                </div>
              </div>
            </Container>
          </>
        )}
        <Outlet />
      </RootStyle>
    </>
  );
};

export default StudentDetails;
