import express from 'express';
import { login, signUp } from '../controllers/authenicationController.js';
import { signUpSchema } from '../validators/signUpValidations.js';
import upload from '../middlewares/uploadMiddleware.js';
import { validateRequest } from '../middlewares/validateSignUpRequest.js';
import isUserExistsMiddleware from '../middlewares/checkEmailIsExists.js';

const authRouter = express.Router();

authRouter.post('/login', login);

authRouter.post(
  '/signUp',
  upload.single('logo'),
  validateRequest(signUpSchema),
  isUserExistsMiddleware,
  signUp
);

export default authRouter;
