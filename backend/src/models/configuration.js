import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const configuration = sequelize.define(
  'configuration',
  {
    configId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    counter: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
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
    organizationName: { type: DataTypes.STRING, allowNull: false },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'organizationTypes',
        key: 'organizationId',
      },
      onUpdate: 'CASCADE',
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'addresses',
        key: 'addressId',
      },
      onUpdate: 'CASCADE',
    },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    mobileNumber: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    logo: { type: DataTypes.STRING },
    u_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'u_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'configurations',
    timestamps: true,
  }
);

export default configuration;
