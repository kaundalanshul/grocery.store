import axios from 'axios';

// In production (Render), REACT_APP_API_URL points to the backend service.
// In development, we use the proxy defined in package.json (http://localhost:5000).
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  timeout: 15000,
});

export default instance;
