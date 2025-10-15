import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Roles = sequelize.define(
  'Roles',
  {
    role_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    roleName: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'roles',
    timestamps: true,
  }
);
export default Roles;
