import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Desiginations = sequelize.define(
  'Desiginations',
  {
    desiginationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
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
    counter: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    desigination: { type: DataTypes.STRING },
    isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'desginations',
    timestamps: true,
  }
);
export default Desiginations;
