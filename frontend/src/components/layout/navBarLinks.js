export const SidebarMenu = [
  { name: 'Dashboard', icon: '🏠', path: '/dashboard/home' },
  {
    name: 'Employees',
    icon: '👤',
    subMenu: [
      { name: 'Add Employee', path: '/dashboard/employee/add' },
      { name: 'Employee List', path: '/dashboard/employee/list' },
      { name: 'Documents', path: '/dashboard/employee/documents' },
    ],
  },
  {
    name: 'Residency',
    icon: '🛂',
    subMenu: [
      { name: 'Visa Management', path: '/dashboard/residency/visa' },
      { name: 'Expiring Soon', path: '/dashboard/residency/expiring' },
    ],
  },
  {
    name: 'Departments & Roles',
    icon: '🏢',
    subMenu: [
      { name: 'Departments', path: '/dashboard/departments' },
      { name: 'Job Titles', path: '/dashboard/job-titles' },
    ],
  },
  {
    name: 'Reports',
    icon: '📊',
    subMenu: [
      { name: 'Summary Report', path: '/dashboard/reports/summary' },
      { name: 'Expiry Report', path: '/dashboard/reports/expiry' },
    ],
  },
  { name: 'Settings', icon: '⚙️', path: '/dashboard/settings' },
];
