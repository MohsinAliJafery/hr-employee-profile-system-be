import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
const Departments = sequelize.define(
  'Departments',
  {
    departmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    departmentName: { type: DataTypes.STRING },
    u_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'departments',
    timestamps: true,
  }
);

export default Departments;
