import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

// ✅ Generate Token
export const generateToken = (user) => {
  return jwt.sign(
    {
      u_id: user.u_id,
      email: user.email,
      role: user.role_id,
    },
    SECRET_KEY,
    { expiresIn: '1d' } // expires in 1 day
  );
};

// ✅ Verify Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
