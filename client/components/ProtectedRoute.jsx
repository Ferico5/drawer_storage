import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || !user._id) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;