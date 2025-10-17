import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const jobTitles = sequelize.define(
  'jobTitles',
  {
    jobTitleId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    jobTitle: { type: DataTypes.STRING },
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
    tableName: 'jobtitles',
    timestamps: true,
  }
);
export default jobTitles;
