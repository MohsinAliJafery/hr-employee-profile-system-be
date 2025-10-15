import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import sequelize from './config/db.js';
import dotenv from 'dotenv';
import './models/index.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');

    // 2️⃣ Sync models to DB
    await sequelize.sync({ alter: true });
    console.log('✅ Tables created/updated successfully!');
  } catch (err) {
    console.error('❌ Error during DB connection or sync:', err);
  }
})();

export default app;
