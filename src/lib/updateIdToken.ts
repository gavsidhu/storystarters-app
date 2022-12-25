import axios from 'axios';
import { getAuth } from 'firebase/auth';

const axiosApiInstance = axios.create();

axiosApiInstance.interceptors.request.use(
  async (config) => {
    if (!config?.headers) {
      throw new Error(
        `Expected 'config' and 'config.headers' not to be undefined`
      );
    }
    const token = await getAuth().currentUser?.getIdToken();
    if (token) {
      config.headers['Authorization'] = token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axiosApiInstance;
