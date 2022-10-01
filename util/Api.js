import axios from 'axios';

export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_PATH_VARIABLE, //YOUR_API_URL HERE
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
