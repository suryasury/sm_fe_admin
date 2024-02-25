import { Typography, Grid, Card, CardContent } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
const FeeCardStyle = {
  backgroundColor: "rgb(249, 250, 251)",
  boxShadow: "none",
  borderRadius: "10px",
  padding: "10px",
  marginTop: "30px",
};
const FeeCard = ({
  term,
  dueDate,
  amount,
  status,
  loading,
  handleClick,
  handleActionClick,
}) => {
  return (
    <Card style={{ ...FeeCardStyle }} key={term}>
      <CardContent>
        <Grid container spacing={2} style={{ marginBottom: "20px" }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Term
            </Typography>
            <Typography variant="body1">{term}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Due Date
            </Typography>
            <Typography variant="body1">
              {dueDate
                ? new Date(dueDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : ""}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Amount
            </Typography>
            <Typography variant="body1">₹{amount.toFixed(1)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Status
            </Typography>
            <Typography variant="body1" color={status ? "green" : "red"}>
              {status ? "Paid" : "Pending"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item lg m sm xl xs>
            <LoadingButton
              onClick={handleClick}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={loading}
              style={{
                marginTop: "30px",
              }}
            >
              {status ? "View receipt" : "Pay"}
            </LoadingButton>
          </Grid>
          {!status && (
            <>
              <Grid item lg m sm xl xs spacing={1}>
                <LoadingButton
                  endIcon={<EditIcon />}
                  onClick={() => {
                    handleActionClick("edit");
                  }}
                  fullWidth
                  size="large"
                  type="submit"
                  color="info"
                  variant="outlined"
                  loading={loading}
                  style={{
                    marginTop: "30px",
                  }}
                >
                  Edit
                </LoadingButton>
              </Grid>
              <Grid item lg m sm xl xs spacing={1}>
                <LoadingButton
                  endIcon={<DeleteForeverIcon />}
                  onClick={() => {
                    handleActionClick("delete");
                  }}
                  fullWidth
                  color="error"
                  size="large"
                  type="submit"
                  variant="outlined"
                  loading={loading}
                  style={{
                    marginTop: "30px",
                  }}
                >
                  Delete
                </LoadingButton>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FeeCard;
