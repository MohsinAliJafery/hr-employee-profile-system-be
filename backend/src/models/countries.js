import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const countries = sequelize.define(
  'countries',
  {
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    counter: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    countryName: { type: DataTypes.STRING },
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
    isDefaultShow: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { tableName: 'countries', timestamps: true }
);
export default countries;
