import axios from 'axios';

const API_URL = 'https://localhost:7224'; // Your .NET API URL

// Configure axios defaults
axios.defaults.headers.post['Content-Type'] = 'application/json';

const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/Auth/login`,
      {
        userName: username,
        password: password
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.title || 
                         error.response.data?.message || 
                         'Login failed';
      throw new Error(errorMessage);
    } else if (error.request) {
      // No response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Request setup error
      throw new Error('Login request failed: ' + error.message);
    }
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const authService = {
  login,
  logout,
  getCurrentUser
};

export default authService;