

import axios from "axios";

export async function loginHandler(body) {
  try {
    const response = await axios.post(`${process.env.REACT_APP_AUTH_API_URL}/login/`, body);
    return [response.status, response.data];
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code
      const statusCode = error.response.status;

      if (statusCode === 401 || statusCode === 403) {
        // Unauthorized or Forbidden
        return [statusCode, null];
      } else {
        // Other status codes, handle as needed
        return [statusCode, error.response.data];
      }
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Error setting up the request:', error.message);
      throw error;
    }
  }
}


export async function logoutHandler(token) {
  const response = await axios.post(`${process.env.REACT_APP_AUTH_API_URL}/logout/`, {}, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (response.status === 200) {
    return response.data;
  }
  if (response.status === 401) {
    return null;
  }
}