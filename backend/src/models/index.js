import sequelize from '../config/db.js';
import User from './users.js';
import Roles from './roles.js';
import configuration from './configuration.js';

User.belongsTo(Roles, {
  foreignKey: 'role_id',
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',
});

User.hasOne(configuration, { foreignKey: 'u_id' });
Roles.hasMany(User, { foreignKey: 'role_id' });
configuration.belongsTo(User, { foreignKey: 'u_id' });

export { sequelize, User, Roles, configuration };
