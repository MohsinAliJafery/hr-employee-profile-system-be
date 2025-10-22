import { isUserExists } from '../services/authenicateServices.js';

const isUserExistsMiddleware = async (req, res, next) => {
  try {
    const email = req.body.companyEmailId;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const isEmailExists = await isUserExists(email);

    if (isEmailExists) {
      return res.status(400).json({ messages: ['This email is already in use.'] });
    }

    next(); // ✅ proceed to next middleware/controller
  } catch (err) {
    console.error('Error checking existing user:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default isUserExistsMiddleware;
