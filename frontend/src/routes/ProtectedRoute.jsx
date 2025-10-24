import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const u_id = localStorage.getItem('u_id');

  // if either token or u_id missing → redirect
  if (!token || !u_id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
