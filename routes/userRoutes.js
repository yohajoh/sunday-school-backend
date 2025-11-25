import express from 'express';
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.route('/').get(getUser).post(createUser);
userRouter.route('/:id').put(updateUser).delete(deleteUser);

export default userRouter;
