import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const visaTypes = sequelize.define(
  'visaTypes',
  {
    visaTypeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    visaType: { type: DataTypes.STRING },
    u_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'u_id',
      },
      onUpdate: 'CASCADE',
    },
    counter: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'visaTypes',
    timestamps: true,
  }
);
export default visaTypes;
