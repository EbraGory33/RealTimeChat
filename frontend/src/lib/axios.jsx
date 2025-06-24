import axios from "axios";

function useAxiosClient() {
  const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,

    withCredentials: true, 
  });

  return axiosClient;
}

export { useAxiosClient }