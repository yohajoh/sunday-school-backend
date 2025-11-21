import express from 'express';
import { getUser, createUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.route('/').get(getUser).post(createUser);

export default userRouter;
