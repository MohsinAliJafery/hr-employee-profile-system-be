import { loginService } from '../services/authenicateServices.js';
export const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    if (!email || !password) {
      return res.status(400).json({ message: 'Email & Password is required.' });
    }
    const { user, token } = await loginService(email, password);
    res.json({
      message: 'Login successful',
      token,
      user: { u_id: user.u_id, email: user.email },
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
