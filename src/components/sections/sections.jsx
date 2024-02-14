import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { getSections, getUserDetails } from "../../api/api";
import PageLoader from "../helpers/pageLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import LayoutWrapper from "../../layout/layout";
import DataTable from "../helpers/table";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

const RootStyle = styled("div")({});

const ContainerStyle = {};

const Students = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const term = queryParams.get("term");
  const paymentStatus = queryParams.get("status");
  const search = queryParams.get("search");
  const section = queryParams.get("section");
  const { enqueueSnackbar } = useSnackbar();
  // const [buttonLoading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  // const [sectionDetails, setSectionDetails] = useState([]);
  // const [modalOpen, setModalOpen] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const dataFetchInitRef = useRef(false);
  const [selectedTerm, setSelectedTerm] = useState(term || "");
  const [selectedSection, setSelectedSection] = useState(section);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(
    paymentStatus || ""
  );
  const [searchQuery, setSearchQuery] = useState(search || "");

  const columns = [
    {
      id: "id",
      label: "ID",
      // minWidth: 100,
    },
    {
      id: "standard",
      label: "Standard",
      // minWidth: 100,
    },
    {
      id: "section",
      label: "Section",
      // minWidth: 100,
    },
    {
      id: "teacherName",
      label: "Teacher Name",
      // minWidth: 100,
    },
    {
      id: "totalStudents",
      label: "Total Students",
      // minWidth: 100,
    },
    {
      id: "actions",
      label: "Actions",
      // minWidth: 100,
    },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (e) => {
    if (e.target.name) {
      if (e.target.name === "term") {
        setSelectedTerm(e.target.value);
      } else if (e.target.name === "paymentStatus") {
        setSelectedPaymentStatus(e.target.value);
      } else if (e.target.name === "section") {
        setSelectedSection(e.target.value);
      }
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
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
      if (selectedSection) {
        filters.push(`section=${selectedSection}`);
      }
      if (searchQuery) {
        filters.push(`search=${searchQuery}`);
      }
      let urlPath = "";
      let queryFilters = "";
      if (filters.length > 0) {
        queryFilters = `?${filters.join("&")}`;
        urlPath = `/sections${queryFilters}`;
      } else {
        urlPath = `/sections`;
      }
      // await getStudentListService(queryFilters);
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
  }, [selectedTerm, selectedPaymentStatus, searchQuery, selectedSection]);

  // const handleOnSectionClick = (sectionId) => {
  //   navigate(`/student/list/${sectionId}`);
  // };
  return (
    <LayoutWrapper>
      <RootStyle>
        {pageLoading ? (
          <PageLoader />
        ) : (
          <>
            <div
              // maxWidth="sm"
              style={{ margin: "30px", ...ContainerStyle }}
            >
              <Typography
                variant="h4"
                style={{ opacity: "0.7", fontWeight: "bolder" }}
              >
                Standards & Sections
              </Typography>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "20px 0 20px 0",
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
                <Box>
                  <FormControl
                    size="small"
                    style={{ width: "200px", marginLeft: "15px" }}
                  >
                    <InputLabel id="beautiful-dropdown-label">
                      Standard & Section
                    </InputLabel>
                    <Select
                      labelId="beautiful-dropdown-label"
                      id="beautiful-dropdown"
                      value={selectedSection}
                      onChange={handleFilterChange}
                      label="Standard & Section"
                      name="section"
                    >
                      <MenuItem value="">
                        <em>All</em>
                      </MenuItem>
                      <MenuItem value={1}>Section1</MenuItem>
                      <MenuItem value={2}>section2</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <TextField
                  label="Admn No / Student name"
                  variant="outlined"
                  size="small"
                  style={{
                    maxWidth: "300px",
                    width: "100%",
                    marginLeft: "20px",
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
              </div>
              <DataTable
                rows={studentList}
                columns={columns}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </div>
          </>
        )}
      </RootStyle>
    </LayoutWrapper>
  );
};

export default Students;
