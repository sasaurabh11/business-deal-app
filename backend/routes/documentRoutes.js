const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  upload,
  uploadDocument,
  getDocuments,
  updateDocumentAccess,
  deleteDocument
} = require('../controllers/documentController');

router.use(protect); // All document routes require authentication

router.route('/:dealId')
  .get(getDocuments);

router.route('/:dealId/upload')
  .post(upload.single('document'), uploadDocument);

router.route('/:dealId/:documentId/access')
  .put(updateDocumentAccess);

router.route('/:dealId/:documentId')
  .delete(deleteDocument);

module.exports = router;
