import { Routes, Route, Navigate } from 'react-router-dom';
import App from '../components/Home/App'; // ✅ your login/signup wrapper
import ProtectedRoute from './ProtectedRoute.jsx';
import Inde from '../pages/dashboard/Inde.jsx';
import Layout from '../components/layout/Layout.jsx';
import EmployeeForm from '../components/Employees/employeeForm.jsx';
import EmployeeList from '../pages/Employees/Employees.jsx';
import DepartmentList from '../pages/Department/Departments.jsx';
import DocumentsList from '../pages/documents/Documents.jsx';
import VisaTypeList from '../pages/visaTypes/VisaTypes.jsx';
import CountryList from '../pages/Countries/Countries.jsx';
import CityList from '../pages/Cities/Cities.jsx';
import DesignationList from '../pages/Desginations/DesginationList.jsx';
import TitlesList from '../pages/Titles/Titles.jsx';
import ResidencyStatus from '../pages/ResidencyStatus/ResidencyStatus.jsx';

const AppRoutes = () => {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      {/* Auth Page (SignIn/SignUp) */}
      <Route
        path="/login"
        element={!token ? <App /> : <Navigate to="/dashboard" replace />}
      />

      {/* Dashboard (Protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Inde />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employee/add" element={<EmployeeForm />} />
        <Route path="employee/residencystatus" element={<ResidencyStatus />} />
        <Route path="departments" element={<DepartmentList />} />
        <Route path="documents" element={<DocumentsList />} />
        <Route path="visatypes" element={<VisaTypeList />} />
        <Route path="countries" element={<CountryList />} />
        <Route path="cities" element={<CityList />} />
        <Route path="desginations" element={<DesignationList />} />
        <Route path="titles" element={<TitlesList />} />
      </Route>

      {/* Default Redirect */}
      <Route
        path="*"
        element={<Navigate to={token ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
