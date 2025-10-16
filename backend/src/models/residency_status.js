import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const ResidencyStatus = sequelize.define('ResidencyStatus', {
  residencyStatusId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  u_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
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
      model: 'nationalities',
      key: 'nationalityId',
    },
    onUpdate: 'CASCADE',
  },
  valid_until: { type: DataTypes.DATE, allowNull: false },
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
export default ResidencyStatus;
