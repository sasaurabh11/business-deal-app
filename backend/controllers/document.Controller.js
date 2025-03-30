import documentModel from '../models/document.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const uploadDocument = async (req, res) => {
  try {
    const { dealId, allowedUsers } = req.body;
    const filePath = req.file?.path;

    if (!filePath) {
      return res.status(400).json({ success: false, message: 'Please provide a file to upload.' });
    }

    const uploadedFileUrl = await uploadOnCloudinary(filePath);
    if (!uploadedFileUrl) {
      return res.status(500).json({ success: false, message: 'Error occurred while uploading file.' });
    }

    const newDocument = await documentModel.create({
      dealId,
      uploadedBy: req.user.id,
      docsUrl: uploadedFileUrl,
      accessUser: allowedUsers ? JSON.parse(allowedUsers) : [],
    });

    res.status(201).json({ success: true, message: 'Document uploaded successfully.', document: newDocument });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: 'An error occurred while uploading the document.', error });
  }
};

const getDocuments = async (req, res) => {
  try {
    const { dealId } = req.params;
    const documents = await documentModel.find({ dealId });
    
    const accessibleDocuments = documents.filter(doc =>
      doc.uploadedBy.toString() === req.user.id || doc.accessUser.includes(req.user.id)
    );

    res.status(200).json({ success: true, message: 'Documents retrieved successfully.', documents: accessibleDocuments });
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ success: false, message: 'Could not retrieve documents.', error });
  }
};

const grantAccess = async (req, res) => {
  try {
    const { documentId, userId } = req.body;
    const document = await documentModel.findById(documentId);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    if (document.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Permission denied: Only the uploader can grant access.' });
    }

    if (!document.accessUser.includes(userId)) {
      document.accessUser.push(userId);
      await document.save();
    }

    res.status(200).json({ success: true, message: 'User access granted successfully.' });
  } catch (error) {
    console.error('Access Error:', error);
    res.status(500).json({ success: false, message: 'Error granting document access.', error });
  }
};

export { uploadDocument, getDocuments, grantAccess };
