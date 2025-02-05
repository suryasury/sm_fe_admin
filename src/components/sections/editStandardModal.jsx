import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";

const EditStandardModal = ({
  open,
  handleClose,
  teachers = [],
  loading = false,
  handleSubmitData,
  standardDetails,
}) => {
  const addStudentSchema = Yup.object().shape({
    standard: Yup.string().required("Standard is required"),
    section: Yup.string().required("Section is required"),
    teacherId: Yup.number().required("Select a teacher"),
  });
  const formik = useFormik({
    initialValues: {
      standard: standardDetails?.standard || "",
      section: standardDetails?.section || "",
      teacherId: standardDetails?.teacher_standards?.teacher.id || "",
    },
    validationSchema: addStudentSchema,
    onSubmit: async (data, resetForm) => {
      handleSubmitData(
        {
          id: standardDetails.id,
          teacherId: data.teacherId,
        },
        resetForm
      );
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, resetForm } = formik;
  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
        resetForm();
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle variant="h5" style={{ paddingBottom: "7px" }}>
        Reassign Teacher
      </DialogTitle>
      <hr style={{ width: "100%" }} />
      <FormikProvider value={formik}>
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <DialogContent style={{ padding: "10px 0px 0px 25px" }}>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
                "& .MuiFormControl-root": {
                  m: 1,
                  width: "25ch",
                  padding: "0ch",
                },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                label="Standard"
                required
                type="text"
                disabled
                {...getFieldProps("standard")}
                error={Boolean(touched.standard && errors.standard)}
                helperText={touched.standard && errors.standard}
              />
              <TextField
                label="Section"
                required
                type="text"
                disabled
                {...getFieldProps("section")}
                error={Boolean(touched.section && errors.section)}
                helperText={touched.section && errors.section}
              />
              <FormControl
                error={Boolean(touched.teacherId && errors.teacherId)}
              >
                <InputLabel id="beautiful-dropdown-label">
                  Select Teacher(Optional)
                </InputLabel>
                <Select
                  labelId="demo-simple-select-readonly-label"
                  id="beautiful-dropdown"
                  label="Select Teacher(Optional)"
                  {...getFieldProps("teacherId")}
                  helperText={touched.teacherId && errors.teacherId}
                >
                  <MenuItem value={0} disabled>
                    Select a Teacher
                  </MenuItem>
                  {teachers.map((teacher) => (
                    <MenuItem value={teacher.id} key={teacher.id}>
                      {teacher.name}
                    </MenuItem>
                  ))}
                </Select>
                {Boolean(touched.teacherId && errors.teacherId) && (
                  <FormHelperText>
                    {touched.teacherId && errors.teacherId}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleClose();
                resetForm();
              }}
              color="primary"
              disabled={loading}
            >
              Cancel
            </Button>
            <LoadingButton
              color="primary"
              variant="contained"
              loading={loading}
              type="submit"
              style={{
                margin: "20px",
              }}
            >
              Add
            </LoadingButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default EditStandardModal;
