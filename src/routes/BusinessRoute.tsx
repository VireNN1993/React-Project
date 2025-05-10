import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toast } from "react-toastify";

const BusinessRoute = () => {
  const { isLoggedIn, isBusiness } = useSelector(
    (state: RootState) => state.user,
  );

  if (!isLoggedIn) {
    toast.info("Please sign in to access this page");
    return <Navigate to="/signin" replace />;
  }

  if (!isBusiness) {
    toast.warning("This page is available only for business users");
    return <Navigate to="/" replace />;
  }

  // המשתמש מחובר והוא עסקי - אפשר להציג את הילדים
  return <Outlet />;
};

export default BusinessRoute;
