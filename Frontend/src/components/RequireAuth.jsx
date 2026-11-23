import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../AppContext.jsx";

// <RequireAuth>            must be logged in
// <RequireAuth admin>      must be the admin
// <RequireAuth customer>   must be logged in, and admins are sent to /admin
export default function RequireAuth({ admin, customer, children }) {
  const { user, isAdmin } = useApp();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (customer && isAdmin) return <Navigate to="/admin" replace />;
  if (admin && !isAdmin)
    return <div className="checkout-container single"><h2>Admin only</h2><p>Log in as the admin user to manage the store.</p></div>;
  return children;
}

// For pages guests may see (cart, wishlist) but the admin should not use
export function NotAdmin({ children }) {
  const { isAdmin } = useApp();
  return isAdmin ? <Navigate to="/admin" replace /> : children;
}
