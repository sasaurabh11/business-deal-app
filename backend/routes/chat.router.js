import { Router } from 'express';
import { sendMessage, getMessages, markRead } from '../controllers/chat.controller.js';
import { isAuthenticated } from '../middleware/user.middleware.js';

const chatRouter = Router();

chatRouter.post('/send-msg', isAuthenticated, sendMessage);
chatRouter.put('/mark-read', isAuthenticated, markRead);
chatRouter.get('/:dealId', isAuthenticated, getMessages);

export default chatRouter;
