import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  styled,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  downloadHistoryService,
  getAcademicYearDetails,
  getFeesDetailsById,
  getSections,
  getTransactionHistory,
} from "../../api/api";
import PageLoader from "../helpers/pageLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import LayoutWrapper from "../../layout/layout";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { tableCellClasses } from "@mui/material/TableCell";
import { Box } from "@mui/system";
import { useHandleError } from "../helpers/handleError";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
// import { Print } from "@mui/icons-material";
import InvoiceModal from "../students/invoiceModal";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import TableLoader from "../helpers/tableLoader";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { LoadingButton } from "@mui/lab";
const { format } = require("date-fns");

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "lightgrey",
    color: theme.palette.common.black,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const RootStyle = styled("div")({});

const ContainerStyle = {};

const FeesTransactions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const checkError = useHandleError();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search");
  const currentPage = queryParams.get("page");
  const pageLimit = queryParams.get("limit");
  const from = queryParams.get("from");
  const to = queryParams.get("to");
  const { enqueueSnackbar } = useSnackbar();
  const [pageLoading, setPageLoading] = useState(false);
  const [page, setPage] = useState(currentPage ? parseInt(currentPage - 1) : 0);
  const [rowsPerPage, setRowsPerPage] = useState(parseInt(pageLimit || 10));
  const [searchQuery, setSearchQuery] = useState(search || "");
  const [totalCount, setTotalCount] = useState(0);
  const [transactionHistoryList, setTransactionHistoryList] = useState([]);
  const section = queryParams.get("section");
  const academicYear = queryParams.get("academicYear");
  const term = queryParams.get("term");
  const [selectedSection, setSelectedSection] = useState(section || "");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(
    academicYear || ""
  );
  const [selectedTerm, setSelectedTerm] = useState(term || "");
  const [academicYearList, setAcademicYearList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState(
    from && to ? [new Date(from), new Date(to)] : []
  );
  const [loading, setLoading] = useState(false);

  const months = {
    1: {
      long: "January",
      short: "JAN",
    },
    2: {
      long: "February",
      short: "FEB",
    },
    3: {
      long: "March",
      short: "MAR",
    },
    4: {
      long: "April",
      short: "APR",
    },
    5: {
      long: "May",
      short: "MAY",
    },
    6: {
      long: "June",
      short: "JUN",
    },
    7: {
      long: "July",
      short: "JUL",
    },
    8: {
      long: "August",
      short: "AUG",
    },
    9: {
      long: "September",
      short: "SEP",
    },
    10: {
      long: "October",
      short: "OCT",
    },
    11: {
      long: "November",
      short: "NOV",
    },
    12: {
      long: "December",
      short: "DEC",
    },
  };

  const [selectedFeesDetails, setSelectedFeesDetails] = useState(null);
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleViewFeesDocument = async (row) => {
    try {
      setLoading(true);
      let id = row.fees_detail.id;
      let response = await getFeesDetailsById(id);
      response = response.data;
      setSelectedFeesDetails(response.data);
      setOpenInvoiceModal(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      checkError(err);
    }
  };

  const actionRenderer = (row) => {
    return (
      <>
        <div style={{ display: "flex", gap: "15px" }}>
          <Button
            color="primary"
            size="small"
            variant="contained"
            endIcon={<WysiwygIcon />}
            onClick={() => handleViewFeesDocument(row)}
            disabled={loading}
          >
            View
          </Button>
        </div>
      </>
    );
  };

  const columns = [
    {
      id: "admissionNo",
      label: "Admn No",
    },
    {
      id: "name",
      label: "Student Name",
    },
    {
      id: "term",
      label: "Term",
    },
    {
      id: "academicYear",
      label: "Academic Year",
    },
    {
      id: "standard",
      label: "Standard",
    },
    {
      id: "amount",
      label: "Amount",
    },
    {
      id: "payedThrough",
      label: "Payed Via",
    },
    {
      id: "paymentMethod",
      label: "Pay Method",
    },
    {
      id: "referenceNo",
      label: "Ref No.",
    },
    {
      id: "paymentDate",
      label: "Payment Date",
    },
    {
      id: "actions",
      label: "Actions",
    },
  ];

  const getFeesTransactionsListService = async () => {
    try {
      setPageLoading(true);
      let filters = constructQueryParams();
      let result = await getTransactionHistory(filters);
      setTotalCount(result?.data?.data?.count || 1);
      let formattedArray = convertToTableData(
        result?.data?.data.feesTransactions || []
      );
      setTransactionHistoryList(formattedArray);
      setPageLoading(false);
    } catch (err) {
      setPageLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      checkError(err);
    }
  };

  const convertToTableData = (list = []) => {
    return list.map((row) => {
      return {
        admissionNo: row?.fees_detail?.student?.admission_number || "NA",
        name: row?.fees_detail?.student?.name || "NA",
        term: row?.fees_detail?.term || "NA",
        academicYear:
          (months[row?.fees_detail?.academic_year?.academic_month_from].short +
            " " +
            row?.fees_detail?.academic_year?.academic_year_from || "NA") +
          " - " +
          (months[row?.fees_detail?.academic_year?.academic_month_to].short +
            " " +
            row?.fees_detail?.academic_year?.academic_year_to || "NA"),
        payedThrough: row?.fees_detail?.payed_through || "NA",
        paymentMethod: row?.payment_mode || "NA",
        referenceNo: row?.utr_number || "NA",
        paymentDate: row?.created_at
          ? new Date(row?.created_at).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              timeZone: "IST",
            })
          : "NA",
        standard:
          (row?.fees_detail?.standard?.standard || "NA") +
          " - " +
          (row?.fees_detail?.standard?.section || "NA"),
        amount: "₹" + row?.amount_paid.toFixed(1),
        actions: actionRenderer(row),
      };
    });
  };

  const handleDownloadReport = async () => {
    try {
      setButtonLoading(true);
      let filters = constructQueryParams();
      let result = await downloadHistoryService(filters);
      const contentDisposition = result.headers["content-disposition"];
      const filename = contentDisposition.split(";")[1].split("=")[1];
      const decodedFilename = decodeURIComponent(filename);
      result = result.data;
      const blob = new Blob([result], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", decodedFilename);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      setButtonLoading(false);
    } catch (err) {
      setButtonLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      checkError(err);
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const constructQueryParams = () => {
    let filters = [];
    if (searchQuery) {
      filters.push(`search=${searchQuery}`);
    }
    if (selectedAcademicYear) {
      filters.push(`academicYear=${selectedAcademicYear}`);
    }
    if (selectedTerm) {
      filters.push(`term=${selectedTerm}`);
    }
    if (selectedSection) {
      filters.push(`section=${selectedSection}`);
    }
    let currentPage = page + 1;
    if (currentPage) {
      filters.push(`page=${currentPage}`);
    }
    if (rowsPerPage) {
      filters.push(`limit=${rowsPerPage}`);
    }
    if (selectedDateRange.length > 0) {
      let selectedFromDate = format(selectedDateRange[0], "yyyy-MM-dd");
      let selectedToDate = format(selectedDateRange[1], "yyyy-MM-dd");
      filters.push(`from=${selectedFromDate}`);
      filters.push(`to=${selectedToDate}`);
    }
    let urlPath = "";
    let queryFilters = "";
    if (filters.length > 0) {
      queryFilters = `?${filters.join("&")}`;
      urlPath = `/fees-transactions${queryFilters}`;
    } else {
      urlPath = `/fees-transactions`;
    }
    navigate(urlPath, {
      replace: true,
    });
    return queryFilters;
  };

  useEffect(() => {
    const onPageLoad = async () => {
      await getFeesTransactionsListService();
    };
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, false);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, [
    page,
    rowsPerPage,
    searchQuery,
    selectedTerm,
    selectedAcademicYear,
    selectedSection,
    selectedDateRange,
  ]);

  const getAcademicYearListService = async () => {
    try {
      let result = await getAcademicYearDetails();
      result = result.data;
      setAcademicYearList(result?.data || []);
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      checkError(err);
    }
  };

  const getSectionListService = async () => {
    try {
      let result = await getSections();
      result = result.data;
      setSectionList(result.data);
    } catch (err) {
      console.log(err);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      checkError(err);
    }
  };

  useEffect(() => {
    const onPageLoadMenus = async () => {
      await getAcademicYearListService();
      await getSectionListService();
    };
    if (document.readyState === "complete") {
      onPageLoadMenus();
    } else {
      window.addEventListener("load", onPageLoadMenus, false);
      return () => window.removeEventListener("load", onPageLoadMenus);
    }
  }, []);

  const handleFilterChange = (e) => {
    if (e.target.name) {
      if (e.target.name === "section") {
        setSelectedSection(e.target.value);
      } else if (e.target.name === "academicYear") {
        setSelectedAcademicYear(e.target.value);
      } else if (e.target.name === "term") {
        setSelectedTerm(e.target.value);
      } else if (e.target.name === "paymentDateRange") {
        setSelectedDateRange(e.target.value || []);
      }
    }
  };

  const handleClearFilter = () => {
    setSearchQuery("");
    setSelectedSection("");
    setSelectedAcademicYear("");
    setSelectedTerm("");
    setSelectedDateRange([]);
  };

  return (
    <LayoutWrapper>
      <RootStyle>
        {false ? (
          <PageLoader />
        ) : (
          <>
            <div style={{ margin: "30px", ...ContainerStyle }}>
              <Typography
                variant="h4"
                style={{
                  opacity: "0.6",
                  fontWeight: "bolder",
                  marginBottom: "20px",
                }}
              >
                Fees Transactions
              </Typography>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <DateRangePicker
                    className="date-range-selector-custom"
                    value={selectedDateRange}
                    onChange={(e) => {
                      console.log("kdjaskdjaskd", e);
                      handleFilterChange({
                        target: { name: "paymentDateRange", value: e },
                      });
                    }}
                    size="lg"
                    format="dd/MM/yyyy"
                    character=" – "
                    placeholder="Payment dates"
                    name="paymentDateRange"
                  />
                  <TextField
                    label="Admn No / Name"
                    variant="outlined"
                    size="small"
                    style={{
                      width: "280px",
                      marginLeft: "15px",
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
                  <Box>
                    <FormControl
                      size="small"
                      style={{ width: "210px", marginLeft: "15px" }}
                    >
                      <InputLabel id="beautiful-dropdown-label">
                        Academic Year
                      </InputLabel>
                      <Select
                        labelId="beautiful-dropdown-label"
                        id="beautiful-dropdown"
                        value={selectedAcademicYear}
                        onChange={handleFilterChange}
                        label="Academic Year"
                        name="academicYear"
                      >
                        <MenuItem value="">
                          <em>All</em>
                        </MenuItem>
                        {academicYearList.map((academicYear) => (
                          <MenuItem
                            value={academicYear.id.toString()}
                            key={academicYear.id}
                          >
                            {months[academicYear.academic_month_from].short}{" "}
                            {academicYear.academic_year_from} -{" "}
                            {months[academicYear.academic_month_to].short}{" "}
                            {academicYear.academic_year_to}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl
                      size="small"
                      style={{ width: "110px", marginLeft: "15px" }}
                    >
                      <InputLabel id="beautiful-dropdown-label">
                        Term
                      </InputLabel>
                      <Select
                        labelId="beautiful-dropdown-label"
                        id="beautiful-dropdown"
                        value={selectedTerm}
                        onChange={handleFilterChange}
                        label="Term"
                        name="term"
                      >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value={"1"}>Term One</MenuItem>
                        <MenuItem value={"2"}>Term Two</MenuItem>
                        <MenuItem value={"3"}>Term Three</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl
                      size="small"
                      style={{ width: "130px", marginLeft: "15px" }}
                    >
                      <InputLabel id="beautiful-dropdown-label">
                        Standard
                      </InputLabel>
                      <Select
                        labelId="beautiful-dropdown-label"
                        id="beautiful-dropdown"
                        value={selectedSection}
                        onChange={handleFilterChange}
                        label="Standard"
                        name="section"
                      >
                        <MenuItem value="">
                          <em>All</em>
                        </MenuItem>
                        {sectionList.map((section) => (
                          <MenuItem
                            value={section.id.toString()}
                            key={section.id}
                          >
                            {section.standard} - {section.section}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <div style={{ width: "200px" }}>
                    <Button
                      style={{ marginLeft: "15px" }}
                      onClick={handleClearFilter}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                <div>
                  <LoadingButton
                    variant="contained"
                    title="Download report"
                    loading={buttonLoading}
                    onClick={handleDownloadReport}
                  >
                    <CloudDownloadIcon />
                  </LoadingButton>
                </div>
              </div>
              <Paper
                sx={{ width: "100%", overflow: "hidden", marginTop: "30px" }}
              >
                <TableContainer sx={{ maxHeight: 700 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <StyledTableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </StyledTableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pageLoading ? (
                        <TableRow style={{ height: "300px" }}>
                          <TableCell colSpan={columns.length} align="center">
                            <TableLoader />
                          </TableCell>
                        </TableRow>
                      ) : (
                        <>
                          {transactionHistoryList.length === 0 ? (
                            <TableRow style={{ height: "300px" }}>
                              <TableCell
                                colSpan={columns.length}
                                align="center"
                              >
                                No Data Found
                              </TableCell>
                            </TableRow>
                          ) : (
                            transactionHistoryList.map((row, index) => {
                              return (
                                <StyledTableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={index}
                                >
                                  {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                      <StyledTableCell
                                        key={column.id}
                                        align={column.align}
                                      >
                                        {value}
                                      </StyledTableCell>
                                    );
                                  })}
                                </StyledTableRow>
                              );
                            })
                          )}
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
              <InvoiceModal
                feesDetails={selectedFeesDetails}
                open={openInvoiceModal}
                handleClose={() => {
                  setSelectedFeesDetails(null);
                  setOpenInvoiceModal(false);
                }}
              />
            </div>
          </>
        )}
      </RootStyle>
    </LayoutWrapper>
  );
};

export default FeesTransactions;
