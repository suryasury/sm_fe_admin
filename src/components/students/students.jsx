import React, { useEffect, useState } from "react";
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
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TablePagination,
  Chip,
} from "@mui/material";
import {
  createStudent,
  deleteStudent,
  getSections,
  getStudentList,
  masterUploadStudents,
  updateStudentDetails,
} from "../../api/api";
import PageLoader from "../helpers/pageLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import LayoutWrapper from "../../layout/layout";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { tableCellClasses } from "@mui/material/TableCell";
// import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileUploadModal from "./fileUploadModal";
import ConfirmationModal from "./confirmationModal";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddStudentModal from "./addStudentModal";
import EditIcon from "@mui/icons-material/Edit";
import EditStudentDetailsModal from "./editStudentModal";
import { HandleError } from "../helpers/handleError";
import TableLoader from "../helpers/tableLoader";

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

// const Android12Switch = styled(Switch)(({ theme }) => ({
//   padding: 8,
//   "& .MuiSwitch-track": {
//     borderRadius: 22 / 2,
//     "&::before, &::after": {
//       content: '""',
//       position: "absolute",
//       top: "50%",
//       transform: "translateY(-50%)",
//       width: 16,
//       height: 16,
//     },
//     "&::before": {
//       backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
//         theme.palette.getContrastText(theme.palette.primary.main)
//       )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
//       left: 12,
//     },
//     "&::after": {
//       backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
//         theme.palette.getContrastText(theme.palette.primary.main)
//       )}" d="M19,13H5V11H19V13Z" /></svg>')`,
//       right: 12,
//     },
//   },
//   "& .MuiSwitch-thumb": {
//     boxShadow: "none",
//     width: 16,
//     height: 16,
//     margin: 2,
//   },
// }));

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
  const currentPage = queryParams.get("page");
  const pageLimit = queryParams.get("limit");
  const { enqueueSnackbar } = useSnackbar();
  const [pageLoading, setPageLoading] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(term || "");
  const [selectedSection, setSelectedSection] = useState(section);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(
    paymentStatus || ""
  );
  const [page, setPage] = useState(currentPage ? currentPage - 1 : 0);
  const [rowsPerPage, setRowsPerPage] = useState(pageLimit || 10);
  const [searchQuery, setSearchQuery] = useState(search || "");
  const [totalCount, setTotalCount] = useState(0);
  const [sectionList, setSectionList] = useState([]);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleUpload = async (file) => {
    setLoading(false);
    try {
      let formData = new FormData();
      formData.append("file", file);
      let response = await masterUploadStudents(formData);
      response = response.data;
      await getStudentListService();
      setLoading(false);
      setOpenUploadModal(false);
      enqueueSnackbar(response.message, { variant: "success" });
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      HandleError(err, navigate);
    }
  };

  // const handleDeleteClick = (row) => {
  //   setSelectedRowData(row);
  //   setOpenConfirmationModal(true);
  // };
  const handleViewClick = (row) => {
    navigate(`/student/${row.id}`);
  };

  const handleEditClick = (row) => {
    setEditData(row);
    setOpenEditModal(true);
  };

  const actionRenderer = (row) => {
    return (
      <>
        <div style={{ display: "flex", gap: "15px" }}>
          <Button
            variant="outlined"
            size="small"
            endIcon={<RemoveRedEyeIcon />}
            onClick={() => handleViewClick(row)}
          >
            View
          </Button>
          {/* <FormGroup>
            <FormControlLabel
              control={<Android12Switch defaultChecked />}
              label="Android 12"
            />
          </FormGroup> */}
          <Button
            color="error"
            size="small"
            endIcon={<EditIcon />}
            onClick={() => handleEditClick(row)}
          >
            Edit
          </Button>
        </div>
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
      label: "Standard",
    },
    {
      id: "termOneStatus",
      label: "Term 1",
    },
    {
      id: "termTwoStatus",
      label: "Term 2",
    },
    {
      id: "termThreeStatus",
      label: "Term 3",
    },
    {
      id: "actions",
      label: "Actions",
    },
  ];

  const getStudentListService = async () => {
    try {
      setPageLoading(true);
      let filters = constructQueryParams();
      let result = await getStudentList(filters);
      setTotalCount(result?.data?.data?.count || 0);
      let formattedArray = convertToTableData(
        result?.data?.data?.studentList || []
      );
      setStudentList(formattedArray);
      setPageLoading(false);
    } catch (err) {
      setPageLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      HandleError(err, navigate);
    }
  };

  const chipRenderer = (feesArray, term) => {
    let feeDetail = feesArray.find((fee) => fee.term === term);
    let label = "";
    let color = "";
    if (feeDetail) {
      if (feeDetail.is_paid) {
        label = "Paid";
        color = "success";
      } else {
        label = "Pending";
        color = "error";
      }
    } else {
      label = "No Data";
      color = "default";
    }
    return <Chip label={label} color={color} size="small" />;
  };
  const convertToTableData = (list = []) => {
    return list.map((row) => {
      return {
        id: row.admission_number,
        admissionNo: row.admission_number,
        name: row.name,
        standard: row?.standard?.id
          ? `${row?.standard?.standard} - ${row?.standard?.section}`
          : "Not assigned",
        termOneStatus: chipRenderer(row.fees_details, 1),
        termTwoStatus: chipRenderer(row.fees_details, 2),
        termThreeStatus: chipRenderer(row.fees_details, 3),
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

  const constructQueryParams = () => {
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
    let currentPage = page + 1;
    if (currentPage) {
      filters.push(`page=${currentPage}`);
    }
    if (rowsPerPage) {
      filters.push(`limit=${rowsPerPage}`);
    }
    let urlPath = "";
    let queryFilters = "";
    if (filters.length > 0) {
      queryFilters = `?${filters.join("&")}`;
      urlPath = `/student${queryFilters}`;
    } else {
      urlPath = `/student`;
    }
    navigate(urlPath, {
      replace: true,
    });
    return queryFilters;
  };

  useEffect(() => {
    const onPageLoad = async () => {
      await getStudentListService();
    };
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, false);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, [
    selectedTerm,
    selectedPaymentStatus,
    searchQuery,
    selectedSection,
    page,
    rowsPerPage,
  ]);

  useEffect(() => {
    const onPageLoadSectionList = async () => {
      try {
        let result = await getSections();
        setSectionList(result?.data?.data || []);
      } catch (err) {
        enqueueSnackbar(err?.response?.data?.message || err.message, {
          variant: "error",
        });
      }
    };
    if (document.readyState === "complete") {
      onPageLoadSectionList();
    } else {
      window.addEventListener("load", onPageLoadSectionList, false);
      return () => window.removeEventListener("load", onPageLoadSectionList);
    }
  }, []);

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      let response = await deleteStudent(id);
      response = response.data;
      enqueueSnackbar(response.message, { variant: "success" });
      await getStudentListService();
      setLoading(false);
      setOpenConfirmationModal(false);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      HandleError(err, navigate);
    }
  };

  const handleSubmitData = async (formData, resetForm) => {
    try {
      setLoading(true);
      let response = await createStudent(formData);
      response = response.data;
      enqueueSnackbar(response.message, { variant: "success" });
      await getStudentListService();
      setLoading(false);
      setOpenAddStudentModal(false);
      resetForm.resetForm();
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      HandleError(err, navigate);
    }
  };

  const handleSubmitEdit = async (formData, resetForm) => {
    try {
      setLoading(true);
      let response = await updateStudentDetails(formData);
      response = response.data;
      enqueueSnackbar(response.message, { variant: "success" });
      await getStudentListService();
      setLoading(false);
      setOpenEditModal(false);
      setEditData(null);
      resetForm.resetForm();
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      HandleError(err, navigate);
    }
  };

  const handleClearFilter = () => {
    setSelectedTerm("");
    setSelectedSection("");
    setSelectedPaymentStatus("");
    setSearchQuery("");
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
                Students
              </Typography>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <FormControl size="small" style={{ width: "100px" }}>
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
                        <MenuItem value="">
                          <em>All</em>
                        </MenuItem>
                        <MenuItem value={1}>One</MenuItem>
                        <MenuItem value={2}>Two</MenuItem>
                        <MenuItem value={3}>Three</MenuItem>
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
                  <TextField
                    label="Admn No/Student name"
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
                  <Button
                    style={{ marginLeft: "20px" }}
                    onClick={handleClearFilter}
                  >
                    Clear
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    endIcon={<PersonAddIcon />}
                    onClick={() => {
                      setOpenAddStudentModal(!openAddStudentModal);
                    }}
                    style={{ marginRight: "15px" }}
                  >
                    Add Student
                  </Button>
                  <Button
                    variant="contained"
                    endIcon={<CloudUploadIcon />}
                    onClick={() => {
                      setOpenUploadModal(!openUploadModal);
                    }}
                  >
                    Master Upload
                  </Button>
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
                          {studentList.length === 0 ? (
                            <TableRow style={{ height: "300px" }}>
                              <TableCell
                                colSpan={columns.length}
                                align="center"
                              >
                                No Data Found
                              </TableCell>
                            </TableRow>
                          ) : (
                            studentList.map((row) => {
                              return (
                                <StyledTableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row.admissionNo}
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
              <FileUploadModal
                open={openUploadModal}
                handleClose={() => {
                  setOpenUploadModal(!openUploadModal);
                }}
                handleUpload={handleUpload}
                loading={loading}
              />
              <ConfirmationModal
                open={openConfirmationModal}
                handleClose={() => {
                  setOpenConfirmationModal(false);
                  setSelectedRowData(null);
                  setLoading(false);
                }}
                handleConfirm={handleConfirmDelete}
                id={selectedRowData?.id}
                admissionNumber={selectedRowData?.admission_number}
                name={selectedRowData?.name}
                loading={loading}
              />
              <AddStudentModal
                open={openAddStudentModal}
                handleClose={() => {
                  setOpenAddStudentModal(false);
                }}
                sections={sectionList}
                handleSubmitData={handleSubmitData}
                loading={loading}
              />
              {editData && (
                <EditStudentDetailsModal
                  open={openEditModal}
                  handleClose={() => {
                    setEditData(null);
                    setOpenEditModal(false);
                  }}
                  handleSubmitData={handleSubmitEdit}
                  loading={loading}
                  sections={sectionList}
                  studentDetails={editData}
                />
              )}
            </div>
          </>
        )}
      </RootStyle>
    </LayoutWrapper>
  );
};

export default Students;
