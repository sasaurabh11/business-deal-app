import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/Appcontext';
import documentService from '../services/documentService';

const Documents = ({ dealId }) => {
  const { user } = useContext(AppContext);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDocuments();
  }, [dealId]);

  const loadDocuments = async () => {
    try {
      const response = await documentService.getDocuments(dealId);
      setDocuments(response.documents);
    } catch (error) {
      setError('Failed to load documents. Please try again.');
      console.error('Error loading documents:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('dealId', dealId);

      const response = await documentService.uploadDocument(formData);
      if (response.success) {
        setDocuments([...documents, response.document]);
      } else {
        setError('Failed to upload document. Please try again.');
      }
    } catch (error) {
      setError('Failed to upload document. Please try again.');
      console.error('Error uploading document:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      const response = await documentService.deleteDocument(documentId);
      if (response.success) {
        setDocuments(documents.filter(doc => doc._id !== documentId));
      } else {
        setError('Failed to delete document. Please try again.');
      }
    } catch (error) {
      setError('Failed to delete document. Please try again.');
      console.error('Error deleting document:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Documents</h2>
        <div className="relative">
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((document) => (
          <div
            key={document._id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{document.name}</h3>
              {user._id === document.uploadedBy && (
                <button
                  onClick={() => handleDeleteDocument(document._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Uploaded by: {document.uploadedBy === user._id ? 'You' : document.uploadedByName}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(document.uploadedAt).toLocaleDateString()}
            </p>
            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 mt-auto"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents; 