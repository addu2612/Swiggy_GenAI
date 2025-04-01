import config from '../config/config';

// Basic API service for making HTTP requests
const API = {
  /**
   * Make a GET request to the API
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} headers - Additional headers to include
   * @returns {Promise} - Response from the API
   */
  get: async (endpoint, headers = {}) => {
    const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    return response.json();
  },

  /**
   * Make a POST request to the API
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} data - The data to send
   * @param {Object} headers - Additional headers to include
   * @returns {Promise} - Response from the API
   */
  post: async (endpoint, data, headers = {}) => {
    const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Make a PUT request to the API
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} data - The data to send
   * @param {Object} headers - Additional headers to include
   * @returns {Promise} - Response from the API
   */
  put: async (endpoint, data, headers = {}) => {
    const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Make a DELETE request to the API
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} headers - Additional headers to include
   * @returns {Promise} - Response from the API
   */
  delete: async (endpoint, headers = {}) => {
    const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    return response.json();
  },
};

export default API;
