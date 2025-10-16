import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Documents = sequelize.define('Documents', {
  documentId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  documentTye: { type: DataTypes.STRING },
  u_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  filePath: { type: DataTypes.STRING },
  employeeId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Employees',
      key: 'employeeId',
    },
    onUpdate: 'CASCADE',
  },
  isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
  isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
});
export default Documents;
