import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const configuration = sequelize.define(
  'configuration',
  {
    configId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    counter: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    organizationName: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    logo: { type: DataTypes.STRING },
    u_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'u_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'configurations',
    timestamps: true,
  }
);

export default configuration;
