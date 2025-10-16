import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const EmployeeEducations = sequelize.define('EmployeeEducations', {
  employeeEducationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  u_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Employees',
      key: 'employeeId',
    },
    onUpdate: 'CASCADE',
  },
  documentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Documents',
      key: 'documentId',
    },
    onUpdate: 'CASCADE',
  },
  isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
  isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
});

export default EmployeeEducations;
