import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
const Employees = sequelize.define('Employees', {
  employeeId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
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
  address: { type: DataTypes.STRING },
  dob: { type: DataTypes.DATE },
  emergencyContact: { type: DataTypes.STRING },
  u_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  nationalityId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'nationalities',
      key: 'nationalityId',
    },
    onUpdate: 'CASCADE',
  },
  titleId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Titles',
      key: 'titleId',
    },
    onUpdate: 'CASCADE',
  },
  isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
  isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
});

export default Employees;
