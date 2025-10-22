import { createUser, loginService } from '../services/authenicateServices.js';
//signup
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email & Password is required.' });
    }
    const { status, user, token, messages } = await loginService(
      email,
      password
    );
    if (status !== 200) {
      return res.status(status).json({ messages });
    }
    res.json({
      message: 'Login successful',
      token,
      user: { u_id: user.u_id, email: user.email },
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const signUp = async (req, res, next) => {
  try {
    // 🧩 1️⃣ Check file upload
    if (!req.file) return res.status(400).json({ error: 'No logo uploaded' });

    // 🧩 2️⃣ Define folder
    const uploadPath = path.join('uploads', 'profileLogos');
    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });

    // 🧩 3️⃣ Sanitize filename
    const cleanName = req.file.originalname
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');

    const updatedFileName = `${Date.now()}-${cleanName}`;
    const filePath = path.join(uploadPath, updatedFileName);

    // 🧩 4️⃣ Resize + optimize image with sharp
    await sharp(req.file.buffer)
      .resize(400, 400, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(filePath);

    // 🧩 5️⃣ Build relative path for DB
    const logoPath = `uploads/profileLogos/${updatedFileName}`;

    // 🧩 6️⃣ You can now save logoPath & req.body data in DB
    // Example:
    // await User.create({ ...req.body, logo: logoPath });
    const userData = {
      ...req.body,
      logo: logoPath,
    };
    const response = await createUser(userData);

    res.status(200).json({
      message: 'User created successfully',
      response,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
