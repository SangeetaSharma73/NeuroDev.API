import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import { generateToken } from '../utils/generateToken';

export const signupService = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const token = generateToken(user._id.toString());

  return { user, token };
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user || !user.password) {
    throw new Error('Invalid Credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid Credentials');
  }

  const token = generateToken(user._id.toString());

  return { user, token };
};
