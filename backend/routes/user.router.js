import { Router } from "express";
import { register, loginUser } from "../controllers/user.controller.js";

const userRouter = Router();
userRouter.post('/signup', register);
userRouter.post('/login', loginUser);

export default userRouter;
