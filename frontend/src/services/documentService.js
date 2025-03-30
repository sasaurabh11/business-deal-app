import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const documentService = {
  // Upload a document
  uploadDocument: async (dealId, file) => {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await axios.post(
      `${API_URL}/documents/${dealId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Get all documents for a deal
  getDealDocuments: async (dealId) => {
    const response = await axios.get(`${API_URL}/documents/${dealId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Download a document
  downloadDocument: async (documentId) => {
    const response = await axios.get(`${API_URL}/documents/download/${documentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete a document
  deleteDocument: async (documentId) => {
    const response = await axios.delete(`${API_URL}/documents/${documentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Update document access
  updateDocumentAccess: async (documentId, accessList) => {
    const response = await axios.patch(
      `${API_URL}/documents/${documentId}/access`,
      { accessList },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },
};

export default documentService; 