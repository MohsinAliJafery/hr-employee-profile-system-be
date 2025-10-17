import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const EmployeeJobs = sequelize.define(
  'EmployeeJobs',
  {
    employeeJobId: {
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
    remarks: { type: DataTypes.STRING, allowNull: true },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'departments',
        key: 'departmentId',
      },
      onUpdate: 'CASCADE',
    },
    jobTitleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'jobtitles',
        key: 'jobTitleId',
      },
      onUpdate: 'CASCADE',
    },
    desiginationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'desginations',
        key: 'desiginationId',
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
    counter: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'employeeJobs',
    timestamps: true,
  }
);

export default EmployeeJobs;
