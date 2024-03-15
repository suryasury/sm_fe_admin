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
  // Switch,
  Chip,
} from "@mui/material";
import {
  createTeacher,
  deleteTeacher,
  getSections,
  getTeacherList,
  updateTeacher,
} from "../../api/api";
import PageLoader from "../helpers/pageLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import LayoutWrapper from "../../layout/layout";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { tableCellClasses } from "@mui/material/TableCell";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import { DeleteForever } from "@mui/icons-material";
import AddTeacherModal from "./addTeacherModal";
import EditTeacherModal from "./editTeacherModal";
import DeleteConfirmationModal from "./confirmationModal";
import { useHandleError } from "../helpers/handleError";
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

const RootStyle = styled("div")({});

const ContainerStyle = {};

const Teachers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const checkError = useHandleError();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search");
  const section = queryParams.get("section");
  const currentPage = queryParams.get("page");
  const pageLimit = queryParams.get("limit");
  const { enqueueSnackbar } = useSnackbar();
  const [pageLoading, setPageLoading] = useState(false);
  const [teachersList, setTeachersList] = useState([]);
  const [selectedSection, setSelectedSection] = useState(section);
  const [page, setPage] = useState(currentPage ? currentPage - 1 : 0);
  const [rowsPerPage, setRowsPerPage] = useState(pageLimit || 10);
  const [searchQuery, setSearchQuery] = useState(search || "");
  const [totalCount, setTotalCount] = useState(0);
  const [sectionList, setSectionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [openAddTeacherModal, setopenAddTeacherModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleDeleteClick = (row) => {
    setSelectedRowData(row);
    setOpenConfirmationModal(true);
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
            color="primary"
            size="small"
            variant="contained"
            endIcon={<EditIcon />}
            onClick={() => handleEditClick(row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            endIcon={<DeleteForever />}
            onClick={() => handleDeleteClick(row)}
          >
            Delete
          </Button>
        </div>
      </>
    );
  };

  const columns = [
    {
      id: "teacherId",
      label: "Teacher ID",
    },
    {
      id: "name",
      label: "Name",
    },
    {
      id: "email",
      label: "Email",
    },
    {
      id: "mobileNumber",
      label: "Mobile Number",
    },
    {
      id: "section",
      label: "Mapped Standards",
    },
    {
      id: "actions",
      label: "Actions",
    },
  ];

  const getTeacherListService = async () => {
    try {
      setPageLoading(true);
      let filters = constructQueryParams();
      let result = await getTeacherList(filters);
      setTotalCount(result?.data?.data?.count || 1);
      let formattedArray = convertToTableData(
        result?.data?.data.teachersList || []
      );
      setTeachersList(formattedArray);
      setPageLoading(false);
    } catch (err) {
      setPageLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      checkError(err);
    }
  };

  const chipRenderer = (standards) => {
    if (standards.length === 0) {
      return <Chip label={"No Data"} color={"default"} size="small" />;
    }
    return standards.map((section) => {
      return (
        <Chip
          label={
            (section.standard.standard || "NA") +
            " - " +
            (section.standard.section || "NA")
          }
          color={"success"}
          size="small"
          style={{ marginRight: "8px" }}
        />
      );
    });
  };
  const convertToTableData = (list = []) => {
    return list.map((row) => {
      return {
        teacherId: row.teacherId,
        name: row.name,
        email: row.email,
        mobileNumber: row.mobile_number,
        section: chipRenderer(row.standards),
        actions: actionRenderer(row),
      };
    });
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (e) => {
    if (e.target.name) {
      if (e.target.name === "section") {
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
      urlPath = `/teachers${queryFilters}`;
    } else {
      urlPath = `/teachers`;
    }
    navigate(urlPath, {
      replace: true,
    });
    return queryFilters;
  };

  useEffect(() => {
    const onPageLoad = async () => {
      await getTeacherListService();
    };
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, false);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, [searchQuery, selectedSection, page, rowsPerPage]);

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
      let response = await deleteTeacher(id);
      response = response.data;
      enqueueSnackbar(response.message, { variant: "success" });
      await getTeacherListService();
      setLoading(false);
      setOpenConfirmationModal(false);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      checkError(err);
    }
  };

  const handleSubmitData = async (formData, resetForm) => {
    try {
      setLoading(true);
      let response = await createTeacher(formData);
      response = response.data;
      enqueueSnackbar(response.message, { variant: "success" });
      await getTeacherListService();
      setLoading(false);
      setopenAddTeacherModal(false);
      resetForm.resetForm();
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      checkError(err);
    }
  };

  const handleSubmitEdit = async (formData, resetForm) => {
    try {
      setLoading(true);
      let response = await updateTeacher(formData);
      response = response.data;
      enqueueSnackbar(response.message, { variant: "success" });
      await getTeacherListService();
      setLoading(false);
      setOpenEditModal(false);
      setEditData(null);
      resetForm.resetForm();
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      checkError(err);
    }
  };

  const handleClearFilter = () => {
    setSelectedSection("");
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
                Teachers
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
                    <FormControl size="small" style={{ width: "120px" }}>
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
                  <TextField
                    label="Teacher ID / Name / Email"
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
                  <div style={{ width: "300px" }}>
                    <Button
                      style={{ marginLeft: "20px" }}
                      onClick={handleClearFilter}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                <div>
                  <Button
                    variant="contained"
                    endIcon={<PersonAddIcon />}
                    onClick={() => {
                      setopenAddTeacherModal(!openAddTeacherModal);
                    }}
                  >
                    Add Teacher
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
                          {teachersList.length === 0 ? (
                            <TableRow style={{ height: "300px" }}>
                              <TableCell
                                colSpan={columns.length}
                                align="center"
                              >
                                No Data Found
                              </TableCell>
                            </TableRow>
                          ) : (
                            teachersList.map((row) => {
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
              <DeleteConfirmationModal
                open={openConfirmationModal}
                handleClose={() => {
                  setOpenConfirmationModal(false);
                  setSelectedRowData(null);
                  setLoading(false);
                }}
                handleConfirm={handleConfirmDelete}
                id={selectedRowData?.id}
                teacherId={selectedRowData?.teacherId}
                name={selectedRowData?.name}
                loading={loading}
                sections={selectedRowData?.standards || []}
              />
              <AddTeacherModal
                open={openAddTeacherModal}
                handleClose={() => {
                  setopenAddTeacherModal(false);
                }}
                sections={sectionList}
                handleSubmitData={handleSubmitData}
                loading={loading}
              />
              {editData && (
                <EditTeacherModal
                  open={openEditModal}
                  handleClose={() => {
                    setEditData(null);
                    setOpenEditModal(false);
                  }}
                  handleSubmitData={handleSubmitEdit}
                  loading={loading}
                  sections={sectionList}
                  teacherDetails={editData}
                />
              )}
            </div>
          </>
        )}
      </RootStyle>
    </LayoutWrapper>
  );
};

export default Teachers;
