import config from '../config/config';

const UploadService = {
  /**
   * Upload a general file
   * @param {File} file - File to upload
   * @returns {Promise} - Response from the API
   */
  uploadFile: async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${config.API_BASE_URL}/api/upload/file`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type here, let the browser set it with the boundary parameter
      },
      body: formData
    });
    
    return response.json();
  },

  /**
   * Upload an audio file
   * @param {File} audioFile - Audio file to upload
   * @returns {Promise} - Response from the API
   */
  uploadAudio: async (audioFile) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('audio', audioFile);
    
    const response = await fetch(`${config.API_BASE_URL}/api/upload/audio`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type here, let the browser set it with the boundary parameter
      },
      body: formData
    });
    
    return response.json();
  }
};

export default UploadService;
