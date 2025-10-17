import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
const Departments = sequelize.define(
  'Departments',
  {
    departmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    departmentName: { type: DataTypes.STRING },
    counter: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    u_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'u_id',
      },
      onUpdate: 'CASCADE',
    },
    isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'departments',
    timestamps: true,
  }
);

export default Departments;
