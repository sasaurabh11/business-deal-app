import { Router } from 'express';
import { isAuthenticated } from '../middleware/user.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
import { uploadDocument, getDocuments, grantAccess } from '../controllers/document.Controller.js';

const docsRouter = Router();

docsRouter.post('/upload', isAuthenticated, upload.single('file'), uploadDocument);
docsRouter.get('/:dealId', isAuthenticated, getDocuments);
docsRouter.put('/grant-access', isAuthenticated, grantAccess);

export default docsRouter;
