import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const addresses = sequelize.define(
  'addresses',
  {
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    addressLineOne: { type: DataTypes.STRING },
    addressLineTwo: { type: DataTypes.STRING },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'countries',
        key: 'countryId',
      },
      onUpdate: 'CASCADE',
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cities',
        key: 'cityId',
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
    postCode: { type: DataTypes.STRING },
    counter: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'addresses',
    timestamps: true,
  }
);

export default addresses;
