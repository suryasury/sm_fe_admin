import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";

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

// const columns = [
//   { id: "name", label: "Name", minWidth: 170 },
//   { id: "code", label: "ISO\u00a0Code", minWidth: 100 },
//   {
//     id: "population",
//     label: "Population",
//     minWidth: 170,
//     align: "right",
//     format: (value) => value.toLocaleString("en-US"),
//   },
//   {
//     id: "size",
//     label: "Size\u00a0(km\u00b2)",
//     minWidth: 170,
//     align: "right",
//     format: (value) => value.toLocaleString("en-US"),
//   },
//   {
//     id: "density",
//     label: "Density",
//     minWidth: 170,
//     align: "right",
//     format: (value) => value.toFixed(2),
//   },
// ];

// function createData(name, code, population, size) {
//   const density = population / size;
//   return { name, code, population, size, density };
// }

// const rows = [
//   createData("India", "IN", 1324171354, 3287263),
//   createData("China", "CN", 1403500365, 9596961),
//   createData("Italy", "IT", 60483973, 301340),
//   createData("United States", "US", 327167434, 9833520),
//   createData("Canada", "CA", 37602103, 9984670),
//   createData("Australia", "AU", 25475400, 7692024),
//   createData("Germany", "DE", 83019200, 357578),
//   createData("Ireland", "IE", 4857000, 70273),
//   createData("Mexico", "MX", 126577691, 1972550),
//   createData("Japan", "JP", 126317000, 377973),
//   createData("France", "FR", 67022000, 640679),
//   createData("United Kingdom", "GB", 67545757, 242495),
//   createData("Russia", "RU", 146793744, 17098246),
//   createData("Nigeria", "NG", 200962417, 923768),
//   createData("Brazil", "BR", 210147125, 8515767),
// ];

const DataTable = ({
  rows = [],
  columns = [],
  page = 0,
  rowsPerPage = 10,
  handleChangePage,
  handleChangeRowsPerPage,
  totalRecord = 0,
  actionRenderer,
  hasActions,
}) => {
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(event.target.value);
  //   setPage(0);
  // };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "30px" }}>
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label="sticky table">
          {/* <caption>A basic table example with a caption</caption> */}
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
              {/* {hasActions && (
                <StyledTableCell key={"actions"}>Actions</StyledTableCell>
              )} */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow style={{ height: "300px" }}>
                <TableCell colSpan={columns.length} align="center">
                  No Data Found
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
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
                        <StyledTableCell key={column.id} align={column.align}>
                          {value}
                        </StyledTableCell>
                        // <>
                        //   {column.id === "actions" && hasActions ? (
                        //     <StyledTableCell key={"actions"} align="inherit">
                        //       {value}
                        //     </StyledTableCell>
                        //   ) : (
                        //     <StyledTableCell
                        //       key={column.id}
                        //       align={column.align}
                        //     >
                        //       {value}
                        //     </StyledTableCell>
                        //   )}
                        // </>
                      );
                    })}
                  </StyledTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalRecord}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTable;
