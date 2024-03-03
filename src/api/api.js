import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getAuthToken = () => {
  let token = "Bearer " + localStorage.getItem("adminAccessToken");
  return token;
};

export const loginService = async (body) => {
  try {
    let result = await axios.post(`${apiUrl}/api/admin/login`, body, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const getUserDetails = async () => {
  try {
    let result = await axios.get(`${apiUrl}/api/teachers/details`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const getSections = async () => {
  try {
    let result = await axios.get(`${apiUrl}/api/admin/standard/list/minified`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const getStudentList = async (filters) => {
  try {
    let result = await axios.get(`${apiUrl}/api/admin/student/list` + filters, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const getSectionDetails = async (sectionId) => {
  try {
    let result = await axios.get(
      `${apiUrl}/api/teachers/section/details/${sectionId}`,
      {
        headers: {
          Authorization: getAuthToken(),
        },
      }
    );
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const getStudentDetails = async (studentId) => {
  try {
    let result = await axios.get(
      `${apiUrl}/api/teachers/student/details/${studentId}`,
      {
        headers: {
          Authorization: getAuthToken(),
        },
      }
    );
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const forgotPassword = async (email) => {
  try {
    let result = await axios.post(`${apiUrl}/api/admin/forgot-password`, {
      email,
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const resetPassword = async (password, token) => {
  try {
    let result = await axios.patch(
      `${apiUrl}/api/admin/reset-password/${token}`,
      {
        password,
      }
    );
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const passwordReset = async (body) => {
  try {
    let result = await axios.patch(`${apiUrl}/api/admin/password/reset`, body, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const masterUploadStudents = async (formData) => {
  try {
    let result = await axios.post(
      `${apiUrl}/api/admin/master/upload/student`,
      formData,
      {
        headers: {
          Authorization: getAuthToken(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const deleteStudent = async (id) => {
  try {
    let result = await axios.delete(
      `${apiUrl}/api/admin/student/delete/${id}`,
      {
        headers: {
          Authorization: getAuthToken(),
        },
      }
    );
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const recordOfflineFees = async (body) => {
  try {
    let result = await axios.post(
      `${apiUrl}/api/admin/record-fees/offline`,
      body,
      {
        headers: {
          Authorization: getAuthToken(),
        },
      }
    );
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const createStudent = async (body) => {
  try {
    let result = await axios.post(`${apiUrl}/api/admin/student/create`, body, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const updateStudentDetails = async (body) => {
  try {
    let result = await axios.post(`${apiUrl}/api/admin/student/update`, body, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const markStudentActive = async (id) => {
  try {
    let result = await axios.patch(
      `${apiUrl}/api/admin/student/activate/${id}`,
      {},
      {
        headers: {
          Authorization: getAuthToken(),
        },
      }
    );
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const createFeesDetails = async (body) => {
  try {
    let result = await axios.post(
      `${apiUrl}/api/admin/student/fees/create`,
      body,
      {
        headers: {
          Authorization: getAuthToken(),
        },
      }
    );
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const updateFeesDetails = async (body) => {
  try {
    let result = await axios.post(
      `${apiUrl}/api/admin/student/fees/update`,
      body,
      {
        headers: {
          Authorization: getAuthToken(),
        },
      }
    );
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const deleteFeesDetails = async (id) => {
  try {
    let result = await axios.delete(
      `${apiUrl}/api/admin/student/fees/delete/${id}`,
      {
        headers: {
          Authorization: getAuthToken(),
        },
      }
    );
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const getTeacherList = async (filters) => {
  try {
    let result = await axios.get(`${apiUrl}/api/admin/staffs/list${filters}`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const getTeacherListMinified = async () => {
  try {
    let result = await axios.get(`${apiUrl}/api/admin/staffs/list/minified`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const createTeacher = async (body) => {
  try {
    let result = await axios.post(`${apiUrl}/api/admin/create-staffs`, body, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const updateTeacher = async (body) => {
  try {
    let result = await axios.post(`${apiUrl}/api/admin/staffs/update`, body, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};
export const deleteTeacher = async (id) => {
  try {
    let result = await axios.delete(`${apiUrl}/api/admin/staffs/delete/${id}`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const getStandardList = async (filters) => {
  try {
    let result = await axios.get(
      `${apiUrl}/api/admin/standard/list${filters}`,
      {
        headers: {
          Authorization: getAuthToken(),
        },
      }
    );
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const createNewStandard = async (body) => {
  try {
    let result = await axios.post(`${apiUrl}/api/admin/standard/create`, body, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const reassignStandardStaff = async (body) => {
  try {
    let result = await axios.post(`${apiUrl}/api/admin/standard/update`, body, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const getAdminList = async (filter) => {
  try {
    let result = await axios.get(`${apiUrl}/api/admin/list${filter}`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const createAdmin = async (body) => {
  try {
    let result = await axios.post(`${apiUrl}/api/admin/create`, body, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const getAdminDetails = async () => {
  try {
    let result = await axios.get(`${apiUrl}/api/admin/details`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const updateAdminDetails = async (body) => {
  try {
    let result = await axios.post(`${apiUrl}/api/admin/update`, body, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const deleteAdmin = async (id) => {
  try {
    let result = await axios.delete(`${apiUrl}/api/admin/delete/${id}`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const getTransactionHistory = async (filter) => {
  try {
    let result = await axios.get(
      `${apiUrl}/api/admin/fees/transactions/history${filter}`,
      {
        headers: {
          Authorization: getAuthToken(),
        },
      }
    );
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const getFeesDetailsById = async (id) => {
  try {
    let result = await axios.get(`${apiUrl}/api/admin/fees/details/${id}`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const getAcademicYearDetails = async () => {
  try {
    let result = await axios.get(`${apiUrl}/api/admin/academic-year`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return result;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};
