import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  dashBoardMerticsOverview,
  getAcademicYearDetails,
  getSections,
} from "../../api/api";
import PageLoader from "../helpers/pageLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import LayoutWrapper from "../../layout/layout";
import { Box } from "@mui/system";
import { useHandleError } from "../helpers/handleError";
import "rsuite/dist/rsuite-no-reset.min.css";
import { MetricesOverViewCard } from "./metricesOverviewCard";

const RootStyle = styled("div")({});

const ContainerStyle = {};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const checkError = useHandleError();
  const queryParams = new URLSearchParams(location.search);
  const { enqueueSnackbar } = useSnackbar();
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
  const [loading, setLoading] = useState(true);
  const [metricesOverview, setMetricesOverview] = useState(null);

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

  const getOverAllMetrices = async () => {
    try {
      setLoading(true);
      let filters = constructQueryParams();
      let result = await dashBoardMerticsOverview(filters);
      result = result.data;
      setMetricesOverview(result.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err.message, {
        variant: "error",
      });
      checkError(err);
    }
  };

  const constructQueryParams = () => {
    let filters = [];
    if (selectedAcademicYear) {
      filters.push(`academicYear=${selectedAcademicYear}`);
    }
    if (selectedTerm) {
      filters.push(`term=${selectedTerm}`);
    }
    if (selectedSection) {
      filters.push(`section=${selectedSection}`);
    }
    let urlPath = "";
    let queryFilters = "";
    if (filters.length > 0) {
      queryFilters = `?${filters.join("&")}`;
      urlPath = `/dashboard${queryFilters}`;
    } else {
      urlPath = `/dashboard`;
    }
    navigate(urlPath, {
      replace: true,
    });
    return queryFilters;
  };

  const getAcademicYearListService = async () => {
    try {
      let result = await getAcademicYearDetails();
      result = result.data;
      let academicList = result?.data || [];
      setAcademicYearList(result?.data || []);
      if (academicList.length > 0) {
        setSelectedAcademicYear(academicList[0].id);
      }
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
    if (selectedAcademicYear) {
      getOverAllMetrices();
    }
  }, [selectedAcademicYear, selectedTerm, selectedSection]);

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
      }
    }
  };

  const handleClearFilter = () => {
    setSelectedSection("");
    // setSelectedAcademicYear("");
    setSelectedTerm("");
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
                Dashboard
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
                  <Box>
                    <FormControl
                      size="small"
                      style={{ width: "210px", marginLeft: "0px" }}
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
                        <MenuItem value="" disabled>
                          Select Academic Year
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
                      style={{ width: "130px", marginLeft: "15px" }}
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
                      title="Clear Filter"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
              <div style={{ marginRight: "10px" }}>
                <Grid container spacing={2} style={{ margin: "0px" }}>
                  <MetricesOverViewCard
                    title="Total Fees"
                    fees={metricesOverview?.totalFees}
                    loading={loading}
                  />
                  <MetricesOverViewCard
                    title="Total Fees Collected"
                    fees={metricesOverview?.totalFeesCollected}
                    loading={loading}
                  />
                  <MetricesOverViewCard
                    title="Total Fees Pending"
                    fees={metricesOverview?.totalFeesPending}
                    loading={loading}
                  />
                </Grid>
              </div>
            </div>
          </>
        )}
      </RootStyle>
    </LayoutWrapper>
  );
};

export default Dashboard;
