import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const ResidencyDocuments = sequelize.define('ResidencyDocuments', {
  residencyDocumentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  u_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  residencyStatusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ResidencyStatus',
      key: 'residencyStatusId',
    },
    onUpdate: 'CASCADE',
  },
  documentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Documents',
      key: 'documentId',
    },
  },
  isActive: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
  isDeleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
});
export default ResidencyDocuments;
