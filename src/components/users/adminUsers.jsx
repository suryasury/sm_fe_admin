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
  Chip,
} from "@mui/material";
import {
  createAdmin,
  deleteAdmin,
  getAdminList,
  updateAdminDetails,
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
import AddAdminModal from "./addAdminModal";
import EditAdminModal from "./editAdminModal";
import DeleteConfirmationModal from "./confirmationModal";
import { HandleError } from "../helpers/handleError";
import { useSelector } from "react-redux";
import { Box } from "@mui/system";
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

const AdminUsers = () => {
  const userDetails = useSelector((state) => state.user.value);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search");
  const currentPage = queryParams.get("page");
  const pageLimit = queryParams.get("limit");
  const { enqueueSnackbar } = useSnackbar();
  const [pageLoading, setPageLoading] = useState(false);
  const [page, setPage] = useState(currentPage ? currentPage - 1 : 0);
  const [rowsPerPage, setRowsPerPage] = useState(pageLimit || 10);
  const [searchQuery, setSearchQuery] = useState(search || "");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [adminList, setAdminList] = useState([]);
  const [openAddAdminModal, setOpenAddAdminModal] = useState(false);

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
            disabled={userDetails?.email === row.email}
          >
            Delete
          </Button>
        </div>
      </>
    );
  };

  const columns = [
    {
      id: "id",
      label: "ID",
    },
    {
      id: "name",
      label: "Name",
    },
    {
      id: "email",
      label: "Email Id",
    },
    {
      id: "mobileNumber",
      label: "Mobile Number",
    },
    {
      id: "actions",
      label: "Actions",
    },
  ];

  const getAdminListService = async () => {
    try {
      setPageLoading(true);
      let filters = constructQueryParams();
      let result = await getAdminList(filters);
      setTotalCount(result?.data?.data?.count || 1);
      let formattedArray = convertToTableData(
        result?.data?.data.adminList || []
      );
      setAdminList(formattedArray);
      setPageLoading(false);
    } catch (err) {
      setPageLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      HandleError(err, navigate);
    }
  };

  const chipRenderer = (email) => {
    return <Chip label="Current User" color="success" />;
  };

  const convertToTableData = (list = []) => {
    return list.map((row) => {
      return {
        id: row.id,
        name: row.name,
        email: (() => {
          return (
            <>
              <span>
                {row.email}
                {row.email === userDetails?.email && (
                  <Chip
                    label="Current User"
                    color="success"
                    size="small"
                    style={{ marginLeft: "10px" }}
                  />
                )}
              </span>
            </>
          );
        })(),
        mobileNumber: row.mobileNumber,
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
      urlPath = `/users${queryFilters}`;
    } else {
      urlPath = `/users`;
    }
    navigate(urlPath, {
      replace: true,
    });
    return queryFilters;
  };

  useEffect(() => {
    const onPageLoad = async () => {
      await getAdminListService();
    };
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, false);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, [searchQuery, page, rowsPerPage]);

  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      let response = await deleteAdmin(id);
      response = response.data;
      enqueueSnackbar(response.message, { variant: "success" });
      await getAdminListService();
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
      let response = await createAdmin(formData);
      response = response.data;
      enqueueSnackbar(response.message, { variant: "success" });
      await getAdminListService();
      setLoading(false);
      setOpenAddAdminModal(false);
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
      let response = await updateAdminDetails(formData);
      response = response.data;
      enqueueSnackbar(response.message, { variant: "success" });
      await getAdminListService();
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
                Admin Users
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
                  <TextField
                    label="Admin Name / Email"
                    variant="outlined"
                    size="small"
                    style={{
                      maxWidth: "450px",
                      width: "100%",
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
                      setOpenAddAdminModal(!openAddAdminModal);
                    }}
                  >
                    Add Admin
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
                          {adminList.length === 0 ? (
                            <TableRow style={{ height: "300px" }}>
                              <TableCell
                                colSpan={columns.length}
                                align="center"
                              >
                                No Data Found
                              </TableCell>
                            </TableRow>
                          ) : (
                            adminList.map((row) => {
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
                email={selectedRowData?.email}
                name={selectedRowData?.name}
                loading={loading}
                id={selectedRowData?.id || ""}
              />
              <AddAdminModal
                open={openAddAdminModal}
                handleClose={() => {
                  setOpenAddAdminModal(false);
                }}
                handleSubmitData={handleSubmitData}
                loading={loading}
              />
              {editData && (
                <EditAdminModal
                  open={openEditModal}
                  handleClose={() => {
                    setEditData(null);
                    setOpenEditModal(false);
                  }}
                  handleSubmitData={handleSubmitEdit}
                  loading={loading}
                  adminDetails={editData}
                />
              )}
            </div>
          </>
        )}
      </RootStyle>
    </LayoutWrapper>
  );
};

export default AdminUsers;
