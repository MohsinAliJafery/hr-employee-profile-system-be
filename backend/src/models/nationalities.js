import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const nationalities = sequelize.define(
  'nationalities',
  {
    nationalityId: {
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
    nationality: { type: DataTypes.STRING },
    counter: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'nationalites',
    timestamps: true,
  }
);
export default nationalities;
