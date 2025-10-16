import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const nationalities = sequelize.define('nationalities', {
  nationalityId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  u_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  nationality: { type: DataTypes.STRING },
  isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
  isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
});
export default nationalities;
