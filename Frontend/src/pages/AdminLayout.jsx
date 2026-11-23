import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const tab = (to, label, end) => (
    <NavLink to={to} end={end} className={({ isActive }) => (isActive ? "tab on" : "tab")}>{label}</NavLink>
  );
  return (
    <div className="admin">
      <h2>Admin</h2>
      <div className="tabs">
        {tab("/admin", "Dashboard", true)}
        {tab("/admin/products", "Products")}
        {tab("/admin/orders", "Orders")}
        {tab("/admin/users", "Customers")}
        {tab("/admin/feedback", "Feedback")}
      </div>
      <Outlet />
    </div>
  );
}
