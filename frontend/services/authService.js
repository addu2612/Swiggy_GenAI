import API from './api';

const AuthService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Response from the API
   */
  register: (userData) => {
    return API.post('/api/auth/register', userData);
  },

  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise} - Response from the API
   */
  login: (credentials) => {
    return API.post('/api/auth/login', credentials);
  },

  /**
   * Get user profile
   * @returns {Promise} - Response from the API
   */
  getProfile: () => {
    const token = localStorage.getItem('token');
    return API.get('/api/auth/profile', {
      Authorization: `Bearer ${token}`
    });
  },
};

export default AuthService;
