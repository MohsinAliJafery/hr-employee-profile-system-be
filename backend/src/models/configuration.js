import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const configuration = sequelize.define(
  'configurations',
  {
    configId: { type: DataTypes.INTEGER, allowNull: false },
    organizationName: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    logo: { type: DataTypes.STRING },
    u_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: 'configurations',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['configId', 'u_id'],
      },
    ],
  }
);

export default configuration;
