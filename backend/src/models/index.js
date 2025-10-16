import sequelize from '../config/db.js';
import User from './users.js';
import Roles from './roles.js';
import configuration from './configuration.js';
import Titles from './titles.js';
import Departments from './departments.js';
import jobTitles from './job_titles.js';
import visaTypes from './visaTypes.js';
import Educations from './educations.js';
import nationalities from './nationalities.js';
import Employees from './Employees.js';
import Documents from './documents.js';
import ResidencyStatus from './residency_status.js';
import ResidencyDocuments from './residency_documents.js';
import EmployeeEducations from './employeeEducations.js';
import Desiginations from './desiginations.js';
import EmployeeJobs from './employeeJobs.js';

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

User.hasMany(nationalities, { foreignKey: 'u_id' });
nationalities.belongsTo(User, { foreignKey: 'u_id' });

User.hasMany(Employees, { foreignKey: 'u_id' });
Employees.belongsTo(User, { foreignKey: 'u_id' });
Employees.belongsTo(nationalities, { foreignKey: 'nationalityId' });
nationalities.hasMany(Employees, { foreignKey: 'nationalityId' });
Employees.belongsTo(Titles, { foreignKey: 'titleId' });
Titles.hasMany(Employees, { foreignKey: 'titleId' });

Documents.belongsTo(User, { foreignKey: 'u_id' });
User.hasMany(Departments, { foreignKey: 'u_id' });

//residency status associations
User.hasMany(ResidencyStatus, { foreignKey: 'u_id' });
ResidencyStatus.belongsTo(User, { foreignKey: 'u_id' });

visaTypes.hasMany(ResidencyStatus, { foreignKey: 'visaTypeId' });
ResidencyStatus.belongsTo(visaTypes, { foreignKey: 'visaTypeId' });

nationalities.hasMany(ResidencyStatus, { foreignKey: 'nationalityId' });
ResidencyStatus.belongsTo(nationalities, { foreignKey: 'nationalityId' });

Employees.hasMany(ResidencyStatus, { foreignKey: 'employeeId' });
ResidencyStatus.belongsTo(Employees, { foreignKey: 'employeeId' });

//residency documents.
ResidencyStatus.hasMany(ResidencyDocuments, {
  foreignKey: 'residencyStatusId',
});

ResidencyDocuments.belongsTo(ResidencyStatus, {
  foreignKey: 'residencyStatusId',
});

User.hasMany(ResidencyDocuments, { foreignKey: 'u_id' });
ResidencyDocuments.belongsTo(User, { foreignKey: 'u_id' });

// ResidencyDocuments → Documents (one-way)
ResidencyDocuments.belongsTo(Documents, {
  foreignKey: 'documentId',
});

//employee Educations
User.hasMany(EmployeeEducations, { foreignKey: 'u_id' });
EmployeeEducations.belongsTo(User, { foreignKey: 'u_id' });

Employees.hasMany(EmployeeEducations, { foreignKey: 'employeeId' });
EmployeeEducations.belongsTo(Employees, { foreignKey: 'employeeId' });
EmployeeEducations.belongsTo(Documents, { foreignKey: 'documentId' });

//desiginations
User.hasMany(Desiginations, { foreignKey: 'u_id' });
Desiginations.belongsTo(User, { foreignKey: 'u_id' });

//employee Jobs.
User.hasMany(EmployeeJobs, { foreignKey: 'u_id' });
EmployeeJobs.belongsTo(User, { foreignKey: 'u_id' });

Departments.hasMany(EmployeeJobs, { foreignKey: 'departmentId' });
EmployeeJobs.belongsTo(Departments, { foreignKey: 'departmentId' });

jobTitles.hasMany(EmployeeJobs, { foreignKey: 'jobTitleId' });
EmployeeJobs.belongsTo(jobTitles, { foreignKey: 'jobTitleId' });

Desiginations.hasMany(EmployeeJobs, { foreignKey: 'desiginationId' });
EmployeeJobs.belongsTo(Desiginations, { foreignKey: 'desiginationId' });

Employees.hasMany(EmployeeJobs, { foreignKey: 'employeeId' });
EmployeeJobs.belongsTo(Employees, { foreignKey: 'employeeId' });

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
  nationalities,
  Employees,
  Documents,
  ResidencyDocuments,
  EmployeeEducations,
  Desiginations,
  ResidencyStatus,
  EmployeeJobs,
};
