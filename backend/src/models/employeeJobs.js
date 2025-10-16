import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const EmployeeJobs = sequelize.define('EmployeeJobs', {
  employeeJobId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  u_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  remarks: { type: DataTypes.STRING, allowNull: true },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Departments',
      key: 'departmentId',
    },
    onUpdate: 'CASCADE',
  },
  jobTitleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jobTitles',
      key: 'jobTitleId',
    },
    onUpdate: 'CASCADE',
  },
  desiginationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Desiginations',
      key: 'desiginationId',
    },
    onUpdate: 'CASCADE',
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Employees',
      key: 'employeeId',
    },
    onUpdate: 'CASCADE',
  },
  isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
  isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
});

export default EmployeeJobs;
