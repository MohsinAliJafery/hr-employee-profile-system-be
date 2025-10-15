import sequelize from '../config/db.js';
import User from './users.js';
import Roles from './roles.js';
import configuration from './configuration.js';
import Titles from './titles.js';
import Departments from './departments.js';
import jobTitles from './job_titles.js';
import visaTypes from './visaTypes.js';
import Educations from './educations.js';

User.belongsTo(Roles, {
  foreignKey: 'role_id',
});
User.hasOne(configuration, { foreignKey: 'u_id' });
Roles.hasMany(User, { foreignKey: 'role_id' });
configuration.belongsTo(User, { foreignKey: 'u_id' });
User.hasMany(Titles, { foreignKey: 'u_id' });
Titles.belongsTo(User, { foreignKey: 'u_id' });
User.hasMany(Departments, { foreignKey: 'u_id' });
Departments.belongsTo(User, { foreignKey: 'u_id' });
User.hasMany(jobTitles, { foreignKey: 'u_id' });
jobTitles.belongsTo(User, { foreignKey: 'u_id' });
visaTypes.belongsTo(User, { foreignKey: 'u_id' });
User.hasMany(visaTypes, { foreignKey: 'u_id' });
Educations.belongsTo(User, { foreignKey: 'u_id' });
User.hasMany(Educations, { foreignKey: 'u_id' });

export {
  sequelize,
  User,
  Roles,
  configuration,
  Titles,
  Departments,
  jobTitles,
  visaTypes,
  Educations,
};
