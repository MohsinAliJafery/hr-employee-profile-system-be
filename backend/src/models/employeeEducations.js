import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const EmployeeEducations = sequelize.define('EmployeeEducations', {
  employeeEducationId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  u_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'u_id',
    },
    onUpdate: 'CASCADE',
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'employeeId',
    },
    onUpdate: 'CASCADE',
  },
  documentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'documents',
      key: 'documentId',
    },
    onUpdate: 'CASCADE',
  },
  counter: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
  isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
});

export default EmployeeEducations;
