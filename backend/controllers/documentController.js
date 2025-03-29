const Deal = require('../models/dealModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/documents';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and PNG files are allowed.'));
    }
  }
});

// @desc    Upload a document to a deal
// @route   POST /api/documents/:dealId/upload
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.dealId);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Check if user is authorized to upload documents
    if (deal.buyer.toString() !== req.user._id.toString() && 
        deal.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to upload documents' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const document = {
      name: req.file.originalname,
      url: `/uploads/documents/${req.file.filename}`,
      uploadedBy: req.user._id,
      accessControl: []
    };

    deal.documents.push(document);
    await deal.save();

    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get documents for a deal
// @route   GET /api/documents/:dealId
// @access  Private
const getDocuments = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.dealId)
      .populate('documents.uploadedBy', 'name email');

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Check if user is authorized to view documents
    if (deal.buyer.toString() !== req.user._id.toString() && 
        deal.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view documents' });
    }

    // Filter documents based on access control
    const accessibleDocuments = deal.documents.filter(doc => {
      return doc.uploadedBy._id.toString() === req.user._id.toString() ||
             doc.accessControl.some(ac => ac.user.toString() === req.user._id.toString() && ac.canView);
    });

    res.json(accessibleDocuments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update document access control
// @route   PUT /api/documents/:dealId/:documentId/access
// @access  Private
const updateDocumentAccess = async (req, res) => {
  try {
    const { accessControl } = req.body;
    const deal = await Deal.findById(req.params.dealId);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    const document = deal.documents.id(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Only document uploader can update access control
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update document access' });
    }

    document.accessControl = accessControl;
    await deal.save();

    res.json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:dealId/:documentId
// @access  Private
const deleteDocument = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.dealId);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    const document = deal.documents.id(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Only document uploader can delete the document
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete document' });
    }

    // Delete file from storage
    const filePath = path.join(__dirname, '..', document.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove document from deal
    document.remove();
    await deal.save();

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  upload,
  uploadDocument,
  getDocuments,
  updateDocumentAccess,
  deleteDocument
};
