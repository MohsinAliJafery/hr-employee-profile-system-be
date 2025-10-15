import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const visaTypes = sequelize.define(
  'visaTypes',
  {
    visaTypeId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    visaType: { type: DataTypes.STRING },
    u_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'visaTypes',
    timestamps: true,
  }
);
export default visaTypes;
