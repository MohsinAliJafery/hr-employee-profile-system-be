import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const cities = sequelize.define(
  'cities',
  {
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    counter: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    cityName: { type: DataTypes.STRING },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'countries',
        key: 'countryId',
      },
      onUpdate: 'CASCADE',
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
    isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
    isDefaultShow: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { tableName: 'cities', timestamps: true }
);

export default cities;
