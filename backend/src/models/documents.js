import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Documents = sequelize.define(
  'Documents',
  {
    documentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    documentTye: { type: DataTypes.STRING },
    counter: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    u_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'u_id',
      },
      onUpdate: 'CASCADE',
    },
    filePath: { type: DataTypes.STRING },
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'employees',
        key: 'employeeId',
      },
      onUpdate: 'CASCADE',
    },
    isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'documents',
    timestamps: true,
  }
);
export default Documents;
