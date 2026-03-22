import { signupService, loginService } from '../services/auth.service';
import { Request, Response, NextFunction } from 'express';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const data = await signupService(name, email, password);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

//JWT logout is handled on frontend.
export const logout = (req: Request, res: Response) => {
  res.json({ message: 'Logout successful' });
};
//Frontend simply deletes token.
