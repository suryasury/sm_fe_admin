import React, { useEffect, useState } from "react";
import {
  Typography,
  styled,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  InputAdornment,
  IconButton,
  TextField,
} from "@mui/material";
import Header from "./header/header";
import { Box, Container } from "@mui/system";
import { getSectionDetails, getStudentList } from "../api/api";
import PageLoader from "./helpers/pageLoader";
import { useNavigate, useParams, Outlet, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StudentCard from "./studentCard";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const RootStyle = styled("div")({
  display: "grid",
  placeItems: "center",
});

const StudentList = () => {
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const term = queryParams.get("term");
  const paymentStatus = queryParams.get("status");
  const search = queryParams.get("search");
  const { enqueueSnackbar } = useSnackbar();
  const [pageLoading, setPageLoading] = useState(true);
  const [sectionDetails, setSectionDetails] = useState(null);
  const [studentList, setStudentList] = useState([1, 2, 3]);
  const [selectedTerm, setSelectedTerm] = useState(term || "");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(
    paymentStatus || ""
  );
  const [searchQuery, setSearchQuery] = useState(search || "");

  const getStudentListService = async (query) => {
    try {
      let studentListArray = await getStudentList(sectionId, query);
      if (studentListArray?.data?.data) {
        setStudentList(studentListArray?.data?.data);
      }
      if (!sectionDetails) {
        let sectionDetailsObj = await getSectionDetails(sectionId);
        if (sectionDetailsObj?.data?.data) {
          setSectionDetails(sectionDetailsObj?.data?.data);
        }
      }
      setPageLoading(false);
    } catch (err) {
      setPageLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      console.log("login", err.response.status);
      if (err.response.status === 401) {
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const onPageLoad = async () => {
      let filters = [];
      if (selectedTerm) {
        filters.push(`term=${selectedTerm}`);
      }
      if (selectedPaymentStatus) {
        filters.push(`status=${selectedPaymentStatus}`);
      }
      if (searchQuery) {
        filters.push(`search=${searchQuery}`);
      }
      let urlPath = "";
      let queryFilters = "";
      if (filters.length > 0) {
        queryFilters = `?${filters.join("&")}`;
        urlPath = `/student/list/${sectionId}?${filters.join("&")}`;
      } else {
        urlPath = `/student/list/${sectionId}`;
      }
      await getStudentListService(queryFilters);
      navigate(urlPath, {
        replace: true,
      });
    };
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, false);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, [selectedTerm, selectedPaymentStatus, sectionId, searchQuery]);

  const handleFilterChange = (e) => {
    if (e.target.name) {
      if (e.target.name === "term") {
        setSelectedTerm(e.target.value);
      } else if (e.target.name === "paymentStatus") {
        console.log("payment");
        setSelectedPaymentStatus(e.target.value);
      }
    }
  };

  const handleViewDetailsClick = (studentId) => {
    navigate(`/section/student/details/${studentId}`);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };
  return (
    <>
      <Header />
      <RootStyle>
        {pageLoading ? (
          <PageLoader />
        ) : (
          <>
            <Container maxWidth="m" style={{ marginTop: "30px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  <ArrowBackIcon />
                </div>
                <Typography
                  variant="h6"
                  style={{ opacity: "0.7", fontWeight: "lighter" }}
                >
                  {sectionDetails?.section || "NA"} -{" "}
                  {sectionDetails?.standard || "NA"} (Students count:{" "}
                  {studentList.length})
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "10px 0 20px 0",
                }}
              >
                <Box>
                  <FormControl size="small" style={{ width: "100px" }}>
                    <InputLabel id="beautiful-dropdown-label">Term</InputLabel>
                    <Select
                      labelId="beautiful-dropdown-label"
                      id="beautiful-dropdown"
                      value={selectedTerm}
                      onChange={handleFilterChange}
                      label="Term"
                      name="term"
                    >
                      <MenuItem value="">
                        <em>All</em>
                      </MenuItem>
                      <MenuItem value={"1"}>One</MenuItem>
                      <MenuItem value={"2"}>Two</MenuItem>
                      <MenuItem value={"3"}>Three</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl
                    size="small"
                    style={{ width: "160px", marginLeft: "15px" }}
                  >
                    <InputLabel id="beautiful-dropdown-label">
                      Payment Status
                    </InputLabel>
                    <Select
                      labelId="beautiful-dropdown-label"
                      id="beautiful-dropdown"
                      value={selectedPaymentStatus}
                      onChange={handleFilterChange}
                      label="Payment Status"
                      name="paymentStatus"
                    >
                      <MenuItem value="">
                        <em>All</em>
                      </MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="unpaid">Unpaid</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <TextField
                label="Admn No / Student name"
                variant="outlined"
                size="small"
                style={{
                  maxWidth: "700px",
                  width: "100%",
                  marginBottom: "20px",
                }}
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchQuery && (
                        <IconButton edge="end" onClick={handleClearSearch}>
                          <ClearIcon />
                        </IconButton>
                      )}
                      <IconButton edge="end" disabled={!searchQuery}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Grid container spacing={2}>
                {studentList.map((student, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <StudentCard
                      key={student.id}
                      student={student}
                      handleDetailsClick={handleViewDetailsClick}
                    />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </>
        )}
        <Outlet />
      </RootStyle>
    </>
  );
};

export default StudentList;
