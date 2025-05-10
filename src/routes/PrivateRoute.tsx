import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toast } from "react-toastify";

const PrivateRoute = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  if (!isLoggedIn) {
    // שמירת הנתיב הנוכחי כדי לחזור אליו לאחר התחברות מוצלחת
    toast.info("Please sign in to access this page");
    return (
      <Navigate to="/signin" state={{ from: location.pathname }} replace />
    );
  }

  // המשתמש מחובר - אפשר להציג את הילדים
  return <Outlet />;
};

export default PrivateRoute;
