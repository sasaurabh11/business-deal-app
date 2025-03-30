import documentModel from "../models/document.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadDocument = async (req, res) => {
  try {
    const { dealId, allowedUsers } = req.body;

    const docsLocalUrl = req.file?.path;
    if (!docsLocalUrl) {
      return res.status(400).json({ success: false, message: 'File required' });
    }

    const docsUrl = await uploadOnCloudinary(docsLocalUrl);
    if(!docsUrl) {
      return res.status(500).json({ success: false, message: 'File upload failed' });
    }

    const document = await documentModel.create({
      dealId,
      uploadedBy: req.user.id,
      docsUrl: docsUrl,
      accessUser: allowedUsers ? JSON.parse(allowedUsers) : [],
    });

    res.status(200).json({success : false, document});
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Document upload failed', error });
  }
};

const getDocuments = async (req, res) => {
  try {
    const { dealId } = req.params;
    const documents = await documentModel.find({ dealId });

    const filteredDocuments = documents.filter(doc =>
      doc.uploadedBy.toString() === req.user.id || doc.accessUser.includes(req.user.id)
    );

    res.status(200).json({success: true, filteredDocuments});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch documents', error });
  }
};

const grantAccess = async (req, res) => {
  try {
    const { documentId, userId } = req.body;
    const document = await documentModel.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the owner can grant access' });
    }

    if (!document.accessUser.includes(userId)) {
      document.accessUser.push(userId);
      await document.save();
    }

    res.status(200).json({success: true, message: 'Access granted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to grant access', error });
  }
};

export { uploadDocument, getDocuments, grantAccess };
