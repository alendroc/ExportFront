import { Navigate } from "react-router-dom"; // Necesitamos Navigate de react-router-dom para redirigir

function ProtectedRoute({ children, isAuthenticated, userRole, allowedRoles }) {
  if (!isAuthenticated || !Array.isArray(allowedRoles) || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return (<Navigate to="/Navegacion/ver" replace />);
  }

  return children;
}

export default ProtectedRoute;