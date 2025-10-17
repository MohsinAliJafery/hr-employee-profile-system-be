import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const ResidencyStatus = sequelize.define(
  'ResidencyStatus',
  {
    residencyStatusId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    visaTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'visaTypes',
        key: 'visaTypeId',
      },
      onUpdate: 'CASCADE',
    },
    nationalityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'nationalites',
        key: 'nationalityId',
      },
      onUpdate: 'CASCADE',
    },
    valid_until: { type: DataTypes.DATE, allowNull: false },
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
    tableName: 'residencyStatus',
    timestamps: true,
  }
);
export default ResidencyStatus;
