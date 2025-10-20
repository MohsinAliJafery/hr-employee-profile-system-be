import bcrypt from 'bcryptjs';
import User from '../models/users.js';
import { generateToken } from '../utils/jwtHelpers.js';

export const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error(' Invalid user email Id.');
    const isMatchPassword = bcrypt.compare(password, user.password);
    if (!isMatchPassword)
      throw new Error('Invalid user credentails, password not macthed.');

    const token = generateToken(user);
    return { token, user };
  } catch (error) {
    throw new Error('Something is wrong' + error.message);
  }
};
