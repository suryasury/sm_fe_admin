import {
  Card,
  CardContent,
  Grid,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { amountToWordsINR, formatCurrency } from "../../utils/formatCurrency";
import InfoIcon from "@mui/icons-material/Info";
import Zoom from "@mui/material/Zoom";
import { tooltipClasses } from "@mui/material/Tooltip";
import CardLoader from "../helpers/cardLoader";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    arrow
    TransitionComponent={Zoom}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    padding: "10px",
  },
  [`& .${tooltipClasses.arrow}`]: {
    backgroundColor: "$fff",
    margin: "2px",
  },
}));

export const MetricesOverViewCard = ({ title, fees, loading }) => {
  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      style={{ paddingRight: "15px", paddingLeft: "0px" }}
    >
      <Card
        style={{
          backgroundColor: "rgb(249, 250, 251)",
          boxShadow: "none",
          borderRadius: "10px",
          marginTop: "15px",
          textAlign: "center",
        }}
      >
        <CardContent>
          <h2 style={{ opacity: "0.6", fontWeight: "bolder" }}>{title}</h2>
          {loading ? (
            <CardLoader size={30} />
          ) : (
            <h1>
              {formatCurrency(fees || 0, "INR")}{" "}
              <HtmlTooltip
                style={{ margin: "0px", padding: "0px" }}
                title={
                  <>
                    <Typography color="inherit" fontSize={"20px"}>
                      Amount in words
                    </Typography>
                    <span style={{ fontSize: "15px" }}>
                      {amountToWordsINR(fees || 0)}
                    </span>
                  </>
                }
              >
                <InfoIcon color="primary" style={{ cursor: "pointer" }} />
              </HtmlTooltip>
            </h1>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};
