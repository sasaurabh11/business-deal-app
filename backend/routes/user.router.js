import { Router } from "express";
import { register, loginUser, getAllUser } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/user.middleware.js";

const userRouter = Router();
userRouter.post('/signup', register);
userRouter.post('/login', loginUser);
userRouter.get('/get-all-user', isAuthenticated, getAllUser);

export default userRouter;
