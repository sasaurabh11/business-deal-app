import { Router } from "express";
import { isAuthenticated } from "../middleware/user.middleware.js";
import { getDealsStatistics, getUserEngagement } from "../controllers/analytics.controller.js";

const analyticsRouter = Router();

analyticsRouter.get('/deals-statistics', isAuthenticated, getDealsStatistics);
analyticsRouter.get('/user-engagement', isAuthenticated, getUserEngagement);

export default analyticsRouter;