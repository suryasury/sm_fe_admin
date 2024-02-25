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
  Chip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const EditTeacherModal = ({
  open,
  handleClose,
  sections = [],
  loading = false,
  handleSubmitData,
  teacherDetails,
}) => {
  const addStudentSchema = Yup.object().shape({
    teacherId: Yup.string().required("Teacher Id is required"),
    teacherName: Yup.string().required("Teacher Name is required"),
    teacherEmail: Yup.string().email().required("Email is required"),
    sections: Yup.array().min(1, "Select atleast one standard"),
    teacherMobileNumber: Yup.string().required("Mobile Number is required"),
    removedSections: Yup.array().optional(),
    id: Yup.number().required(),
  });
  let mappedSections = teacherDetails?.standards || [];
  let mappedSectionsIds = mappedSections.map((section) => section.standard_id);
  const formik = useFormik({
    initialValues: {
      id: teacherDetails?.id || "",
      teacherId: teacherDetails?.teacherId || "",
      teacherName: teacherDetails?.name || "",
      teacherEmail: teacherDetails?.email || "",
      sections: mappedSectionsIds || [],
      teacherMobileNumber: teacherDetails?.mobile_number || "",
      removedSections: [],
    },
    validationSchema: addStudentSchema,
    onSubmit: async (data, resetForm) => {
      handleSubmitData(data, resetForm);
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    values,
    resetForm,
  } = formik;

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
        Edit Teacher Details
      </DialogTitle>
      <hr style={{ width: "100%" }} />
      <FormikProvider value={formik}>
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <DialogContent style={{ padding: "10px 0px 0px 25px" }}>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
                "& .css-1nrlq1o-MuiFormControl-root": {
                  m: 1,
                  width: "25ch",
                  padding: "0ch",
                },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                label="Teacher ID"
                type="text"
                disabled
                {...getFieldProps("teacherId")}
                error={Boolean(touched.teacherId && errors.teacherId)}
                helperText={touched.teacherId && errors.teacherId}
              />
              <TextField
                label="Teacher Name"
                type="text"
                {...getFieldProps("teacherName")}
                error={Boolean(touched.teacherName && errors.teacherName)}
                helperText={touched.teacherName && errors.teacherName}
              />
              <TextField
                label="Email"
                type="text"
                {...getFieldProps("teacherEmail")}
                error={Boolean(touched.teacherEmail && errors.teacherEmail)}
                helperText={touched.teacherEmail && errors.teacherEmail}
              />
              <TextField
                label="Mobile Number"
                type="text"
                {...getFieldProps("teacherMobileNumber")}
                error={Boolean(
                  touched.teacherMobileNumber && errors.teacherMobileNumber
                )}
                helperText={
                  touched.teacherMobileNumber && errors.teacherMobileNumber
                }
              />
              <FormControl
                error={Boolean(touched.sections && errors.sections)}
                style={{ width: "450px" }}
              >
                <InputLabel id="selectedOptions-label">
                  Standard & Sections
                </InputLabel>
                <Select
                  labelId="selectedOptions-label"
                  label="Standard & Sections"
                  id="selectedOptions"
                  multiple
                  value={values.sections}
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    let removedSectionsArr = values.removedSections || [];
                    const updatedOptions = removedSectionsArr.filter(
                      (value) => {
                        return !selectedValue.includes(value);
                      }
                    );
                    setFieldValue("sections", selectedValue);
                    setFieldValue(
                      "removedSections",
                      Array.from(new Set(updatedOptions))
                    );
                  }}
                  inputProps={getFieldProps("sections")}
                  renderValue={(selected) => (
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {selected.map((value) => {
                        let section = sections.find(
                          (section) => section.id === value
                        );
                        return (
                          <Chip
                            deleteIcon={
                              <HighlightOffIcon
                                style={{ color: "#d32f2f" }}
                                onMouseDown={(event) => event.stopPropagation()}
                              />
                            }
                            onDelete={() => {
                              let filteredStandards = values.sections.filter(
                                (id) => id !== section.id
                              );
                              let removerIds = values.removedSections || [];
                              removerIds.push(section.id);
                              setFieldValue(
                                "removedSections",
                                Array.from(new Set(removerIds))
                              );
                              setFieldValue("sections", filteredStandards);
                            }}
                            style={{ marginRight: "5px" }}
                            key={value}
                            label={
                              section
                                ? section.standard + " - " + section.section
                                : value
                            }
                          />
                        );
                      })}
                    </div>
                  )}
                >
                  <MenuItem disabled value="">
                    Select Standard
                  </MenuItem>
                  {sections.map((section) => (
                    <MenuItem key={section.id} value={section.id}>
                      {section.standard} - {section.section}
                    </MenuItem>
                  ))}
                </Select>
                {Boolean(touched.sections && errors.sections) && (
                  <FormHelperText>
                    {touched.sections && errors.sections}
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
              Update
            </LoadingButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default EditTeacherModal;
