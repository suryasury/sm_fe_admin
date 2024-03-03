import React, { useEffect, useState } from "react";
import {
  Button,
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
} from "@mui/material";
import {
  createNewStandard,
  getStandardList,
  getTeacherListMinified,
  reassignStandardStaff,
} from "../../api/api";
import PageLoader from "../helpers/pageLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import LayoutWrapper from "../../layout/layout";
import { tableCellClasses } from "@mui/material/TableCell";
import EditIcon from "@mui/icons-material/Edit";
// import { DeleteForever } from "@mui/icons-material";
// import DeleteConfirmationModal from "./confirmationModal";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AddStandardModal from "./addStandardModal";
import EditStandardModal from "./editStandardModal";
import { HandleError } from "../helpers/handleError";
import TableLoader from "../helpers/tableLoader";
import { Box } from "@mui/system";

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

const Sections = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // const search = queryParams.get("search");
  // const section = queryParams.get("section");
  const currentPage = queryParams.get("page");
  const pageLimit = queryParams.get("limit");
  const { enqueueSnackbar } = useSnackbar();
  const [pageLoading, setPageLoading] = useState(false);
  const [teachersList, setTeachersList] = useState([]);
  // const [selectedSection, setSelectedSection] = useState(section);
  const [page, setPage] = useState(currentPage ? currentPage - 1 : 0);
  const [rowsPerPage, setRowsPerPage] = useState(pageLimit || 10);
  // const [searchQuery, setSearchQuery] = useState(search || "");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  // const [selectedRowData, setSelectedRowData] = useState({});
  // const [openAddTeacherModal, setopenAddTeacherModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [standardList, setStandardList] = useState([]);
  const [addStandardModal, setAddStandardModal] = useState(false);

  // const handleDeleteClick = (row) => {
  //   setSelectedRowData(row);
  //   setOpenConfirmationModal(true);
  // };
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
          {/* <Button
            variant="outlined"
            size="small"
            color="error"
            endIcon={<DeleteForever />}
            onClick={() => handleDeleteClick(row)}
          >
            Delete
          </Button> */}
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
      id: "standard",
      label: "Standard",
    },
    {
      id: "section",
      label: "Section",
    },
    {
      id: "teacherName",
      label: "Teacher Name - ID",
    },
    {
      id: "totalStudents",
      label: "Total Students",
    },
    {
      id: "actions",
      label: "Actions",
    },
  ];

  const getStandardListService = async () => {
    try {
      setPageLoading(true);
      let filters = constructQueryParams();
      let result = await getStandardList(filters);
      setTotalCount(result?.data?.data?.count || 1);
      let formattedArray = convertToTableData(
        result?.data?.data.standardList || []
      );
      setStandardList(formattedArray);
      setPageLoading(false);
    } catch (err) {
      setPageLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      HandleError(err, navigate);
    }
  };
  const getTeacherListService = async () => {
    try {
      let result = await getTeacherListMinified();
      setTeachersList(result?.data?.data || []);
    } catch (err) {
      console.log(err);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      HandleError(err, navigate);
    }
  };

  const convertToTableData = (list = []) => {
    return list.map((row) => {
      let teacherName = row?.teacher_standards?.teacher ? (
        row?.teacher_standards?.teacher.name +
        " - " +
        row?.teacher_standards?.teacher.teacherId
      ) : (
        <span style={{ color: "red" }}>Not Assigned</span>
      );
      return {
        id: row.id,
        standard: row.standard,
        section: row.section,
        teacherName: teacherName,
        totalStudents: row?._count?.students || 0,
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

  const constructQueryParams = () => {
    let filters = [];
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
      urlPath = `/sections${queryFilters}`;
    } else {
      urlPath = `/sections`;
    }
    navigate(urlPath, {
      replace: true,
    });
    return queryFilters;
  };

  useEffect(() => {
    const onPageLoad = async () => {
      await getStandardListService();
    };
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, false);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    const onPageLoadGet = async () => {
      await getTeacherListService();
    };
    if (document.readyState === "complete") {
      onPageLoadGet();
    } else {
      window.addEventListener("load", onPageLoadGet, false);
      return () => window.removeEventListener("load", onPageLoadGet);
    }
  }, []);

  // const handleConfirmDelete = async (id) => {
  //   try {
  //     setLoading(true);
  //     let response = await deleteTeacher(id);
  //     response = response.data;
  //     enqueueSnackbar(response.message, { variant: "success" });
  //     await getStandardListService();
  //     setLoading(false);
  //     setOpenConfirmationModal(false);
  //   } catch (err) {
  //     setLoading(false);
  //     enqueueSnackbar(err?.response?.data?.message || err.message, {
  //       variant: "error",
  //     });
  //   }
  // };

  const handleSubmitData = async (formData, resetForm) => {
    try {
      setLoading(true);
      let response = await createNewStandard(formData);
      response = response.data;
      enqueueSnackbar(response.message, { variant: "success" });
      await getStandardListService();
      setLoading(false);
      setAddStandardModal(false);
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
      let response = await reassignStandardStaff(formData);
      response = response.data;
      enqueueSnackbar(response.message, { variant: "success" });
      await getStandardListService();
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
                Standard & Sections
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
                ></div>
                <div>
                  <Button
                    variant="contained"
                    endIcon={<MeetingRoomIcon />}
                    onClick={() => {
                      setAddStandardModal(!addStandardModal);
                    }}
                  >
                    Add Standard
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
                          {standardList.length === 0 ? (
                            <TableRow style={{ height: "300px" }}>
                              <TableCell
                                colSpan={columns.length}
                                align="center"
                              >
                                No Data Found
                              </TableCell>
                            </TableRow>
                          ) : (
                            standardList.map((row) => {
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
              {/* <DeleteConfirmationModal
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
              /> */}
              <AddStandardModal
                open={addStandardModal}
                handleClose={() => {
                  setAddStandardModal(false);
                }}
                handleSubmitData={handleSubmitData}
                loading={loading}
                teachers={teachersList}
              />
              {editData && (
                <EditStandardModal
                  open={openEditModal}
                  handleClose={() => {
                    setEditData(null);
                    setOpenEditModal(false);
                  }}
                  handleSubmitData={handleSubmitEdit}
                  loading={loading}
                  standardDetails={editData}
                  teachers={teachersList}
                />
              )}
            </div>
          </>
        )}
      </RootStyle>
    </LayoutWrapper>
  );
};

export default Sections;
