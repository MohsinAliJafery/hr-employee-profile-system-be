import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Titles = sequelize.define(
  'Titles',
  {
    titleId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    titleName: { type: DataTypes.STRING },
    u_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'titles',
    timestamps: true,
  }
);
export default Titles;
