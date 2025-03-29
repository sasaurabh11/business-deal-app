import { Router } from 'express';
import { createDeal, getDeals, updateDeal } from '../controllers/deal.controller.js';
import { isAuthenticated } from '../middleware/user.middleware.js';

const dealRouter = Router();

dealRouter.get('/', isAuthenticated, getDeals);
dealRouter.post('/create', isAuthenticated, createDeal);
dealRouter.put('/update-status', isAuthenticated, updateDeal);

export default dealRouter;
