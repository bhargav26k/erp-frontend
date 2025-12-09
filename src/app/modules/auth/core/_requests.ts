import axios from "axios";
import { AdminModel, AuthModel, StudentModel,SuperAdminModel} from "./_models";
import { DOMAIN } from "../../../routing/ApiEndpoints";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_STUDENT_BY_ACCESSTOKEN_URL = `${DOMAIN}/api/student/student-details`;
export const GET_SCHOOL_USER_BY_ACCESSTOKEN_URL = `${DOMAIN}/api/school/school-user/details`;
export const GET_SCHOOL_MASTER_BY_SCHOOL_CHANGE_URL = `${DOMAIN}/api/school/master-user/change-details`;
export const GET_SCHOOL_USER_BY_SCHOOL_CHANGE_URL = `${DOMAIN}/api/school/school-user/change-details`;
export const GET_SUPER_ADMIN_BY_ACCESSTOKEN_URL = `${DOMAIN}/api/superadmin/by_token`;

export const LOGIN_URL_SCHOOL_USER = `${DOMAIN}/api/school/school-user/login`;
export const CHANGE_URL_SCHOOL_MASTER = `${DOMAIN}/api/school/school-master/change`;
export const CHANGE_URL_SCHOOL_USER = `${DOMAIN}/api/school/school-user/change`;
export const LOGIN_URL_STUDENT = `${DOMAIN}/api/student/userlogin`;
export const LOGIN_URL_SUPER_ADMIN = `${DOMAIN}/api/superadmin/login`;
// export const REGISTER_URL = `${API_URL}/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;

// Server should return AuthModel
export function loginSchoolUser(email: string, password: string) {
  return(axios.post<AuthModel>(LOGIN_URL_SCHOOL_USER, {
    email,
    password,
  }) .then((response) => {
    // Handle expected application-level error
    if (response.data?.res_code && response.data.res_code !== "00") {
      throw new Error(response.data.message || "Login failed");
    }

    // Return only the response.data cleanly
    return { data: response.data };
  })
  )
   
}
export function changeMasterSchoolUser(email: string, school_id: string, session_id?: number) {
  return axios.post<AuthModel>(CHANGE_URL_SCHOOL_MASTER, {
    email,
    school_id,
    ...(session_id !== undefined && { session_id })  // Only include session_id if it's provided
  })
  .then(response => {
    if (response.data && response.data.res_code === "00") {
      throw new Error('Invalid response');
    } else {
      return { response, data: response.data }; 
    }
  })
  .catch(error => {
    console.error('Error:', error);
    return error;
  });
}
export function changeSchoolUser(email: string, school_id: string, session_id?: number) {
  return axios.post<AuthModel>(CHANGE_URL_SCHOOL_USER, {
    email,
    school_id,
    ...(session_id !== undefined && { session_id })  // Only include session_id if it's provided
  })
  .then(response => {
    if (response.data && response.data.res_code === "00") {
      throw new Error('Invalid response');
    } else {
      return { response, data: response.data }; 
    }
  })
  .catch(error => {
    console.error('Error:', error);
    return error;
  });
}


export function loginSuperAdmin(username: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL_SUPER_ADMIN, {
    username,
    password,
  })
  .then(response => {
    if (response.data && response.data.res_code === "00") {
      // console.log('Error:', response.data.message);
      throw new Error('Invalid response');
    } else {
      // console.log('Success:', response.data);
      return ({response,data :response.data }); 
    }
  })
  .catch(error => {
    console.error('Error:', error);
    throw error;
  });
}
export function loginStudent(username: string, password: string) {
  return(axios.post<AuthModel>(LOGIN_URL_STUDENT, {
    username,
    password,
  }) .then(response => {
    if (response.data && response.data.res_code === "00") {
      // console.log('Error:', response.data.message);
      throw new Error('Invalid response');
    } else {
      return ({response,data :response.data });
    }
  })
  .catch(error => {
    console.error('Error:', error);
    return error;
  })
  )
   
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(username: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    username,
  });
}

export async function getStudentByToken(user_id: string) {
  const response = await axios.post<StudentModel>(GET_STUDENT_BY_ACCESSTOKEN_URL, {
    user_id,
   } );
   
   return(
    response
   )
}
export async function getSchoolUserByToken(token: string,school_id:string, session_id?: number) {
  try {
    const response = await axios.post(GET_SCHOOL_USER_BY_ACCESSTOKEN_URL, {
      id: token,
      school_id:school_id,
      ...(session_id !== undefined && { session_id })
    });
    
    const userData = response; // Log the response data
    
    return userData;
  } catch (error) {
    console.error('Error fetching admin by token:', error);
    throw error;
  }
}
export async function getSchoolMasterBySchoolId(token: string, school_id: string, session_id?: number) {
  try {
    const response = await axios.post(GET_SCHOOL_MASTER_BY_SCHOOL_CHANGE_URL, {
      id: token,
      school_id: school_id,
      ...(session_id !== undefined && { session_id })  // Only include session_id if it's defined
    });
    
    const userData = response;  // Log the response data
    return userData;
  } catch (error) {
    console.error('Error fetching admin by token:', error);
    throw error;
  }
}
export async function getSchoolBySchoolId(token: string, school_id: string, session_id?: number) {
  try {
    const response = await axios.post(GET_SCHOOL_USER_BY_SCHOOL_CHANGE_URL, {
      id: token,
      school_id: school_id,
      ...(session_id !== undefined && { session_id })  // Only include session_id if it's defined
    });
    
    const userData = response;  // Log the response data
    return userData;
  } catch (error) {
    console.error('Error fetching admin by token:', error);
    throw error;
  }
}


export async function getSuperAdminByToken(username: string) {
  try {
    const response = await axios.post<SuperAdminModel>(GET_SUPER_ADMIN_BY_ACCESSTOKEN_URL, {
      username: username,
    });
    // console.log(response.data);
    
    return response; // Return the data property of the response
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}



