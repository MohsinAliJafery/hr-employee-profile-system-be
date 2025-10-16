import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Desiginations = sequelize.define('Desiginations', {
  desiginationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  u_id: { type: DataTypes.TINYINT, primaryKey: true, allowNull: false },
  desigination: { type: DataTypes.STRING },
  isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
  isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
});
export default Desiginations;
