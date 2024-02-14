import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
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
import { getSections, getStudentList, getUserDetails } from "../../api/api";
import PageLoader from "../helpers/pageLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import LayoutWrapper from "../../layout/layout";
import DataTable from "../helpers/table";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import Menu from "@mui/material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Invoice from "../invoiceTemplate/invoiceTemplate";
import { useReactToPrint } from "react-to-print";

const RootStyle = styled("div")({});
const ITEM_HEIGHT = 48;

const ContainerStyle = {};

const Students = () => {
  const invoiceRef = useRef();
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchQuery, setSearchQuery] = useState(search || "");
  const [totalCount, setTotalCount] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = useState(false);
  const handleMenuClick = (event) => {
    // alert(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (row) => {
    alert(row);
    setAnchorEl(null);
  };

  useEffect(() => {
    setOpen(Boolean(anchorEl));
  }, [anchorEl]);

  const actionRenderer = (row) => {
    console.log("inside action rendered", row);
    return (
      <>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={(event) => handleMenuClick(event)}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          // PaperProps={{
          //   style: {
          //     maxHeight: ITEM_HEIGHT * 4.5,
          //     width: "20ch",
          //   },
          // }}
        >
          {[
            { label: "View Details", value: "view" },
            { label: "Delete", value: "delete" },
          ].map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleMenuItemClick(row.id, option.value)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  const columns = [
    {
      id: "admissionNo",
      label: "Admission No",
    },
    {
      id: "name",
      label: "Name",
    },
    {
      id: "standard",
      label: "Standard & Section",
    },
    {
      id: "actions",
      label: "Actions",
    },
  ];

  const getStudentListService = async (filters) => {
    try {
      let result = await getStudentList(filters);
      console.log(result.data);
      setTotalCount(result?.data?.data?.count || 0);
      let formattedArray = convertToTableData(
        result?.data?.data?.studentList || []
      );
      setStudentList(formattedArray);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("wiriwerwerwerw", studentList);
  }, [studentList]);

  const convertToTableData = (list = []) => {
    return list.map((row) => {
      return {
        id: row.admission_number,
        admissionNo: row.admission_number,
        name: row.name,
        standard: row?.standard?.id
          ? `${row?.standard?.standard} - ${row?.standard?.section}`
          : "Not assigned",
        actions: actionRenderer(row),
      };
    });
  };

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
        urlPath = `/student${queryFilters}`;
      } else {
        urlPath = `/student`;
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
  }, [selectedTerm, selectedPaymentStatus, searchQuery, selectedSection]);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });
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
            {/* <Invoice ref={invoiceRef} /> */}
            <div
              // maxWidth="sm"
              style={{ margin: "30px", ...ContainerStyle }}
            >
              <Typography
                variant="h4"
                style={{ opacity: "0.7", fontWeight: "bolder" }}
              >
                Students
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
                <Button type="button" onClick={handlePrint}>
                  Print
                </Button>
              </div>
              <DataTable
                rows={studentList}
                columns={columns}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                totalRecord={totalCount}
                actionRenderer={(row) => actionRenderer(row)}
                hasActions={true}
              />
            </div>
          </>
        )}
      </RootStyle>
    </LayoutWrapper>
  );
};

export default Students;
