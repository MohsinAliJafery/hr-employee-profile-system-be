import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
const Employees = sequelize.define(
  'Employees',
  {
    employeeId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    firstName: { type: DataTypes.STRING },
    middleName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        const first = this.getDataValue('firstName') || '';
        const middle = this.getDataValue('middleName') || '';
        const last = this.getDataValue('lastName') || '';
        return [first, middle, last].filter(Boolean).join(' ');
      },
    },
    emailId: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'addresses',
        key: 'addressId',
      },
      onUpdate: 'CASCADE',
    },
    dob: { type: DataTypes.DATE },
    emergencyContact: { type: DataTypes.STRING },
    u_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'u_id',
      },
      onUpdate: 'CASCADE',
    },
    nationalityId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'nationalites',
        key: 'nationalityId',
      },
      onUpdate: 'CASCADE',
    },
    titleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'titles',
        key: 'titleId',
      },
      onUpdate: 'CASCADE',
    },
    counter: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'employees',
    timestamps: true,
  }
);

export default Employees;
