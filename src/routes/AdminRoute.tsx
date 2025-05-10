// src/routes/AdminRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toast } from "react-toastify";
import { useEffect } from "react";

const AdminRoute = () => {
  const { isLoggedIn, isAdmin } = useSelector((state: RootState) => state.user);

  // הוסף לוג לדיבוג
  useEffect(() => {
    console.log("AdminRoute user status:", { isLoggedIn, isAdmin });

    // בדיקת טוקן
    const token = localStorage.getItem("token");
    console.log("Token exists in AdminRoute:", !!token);
  }, [isLoggedIn, isAdmin]);

  if (!isLoggedIn) {
    toast.info("Please sign in to access this page");
    return <Navigate to="/signin" replace />;
  }

  if (!isAdmin) {
    toast.warning("This page is available only for administrators");
    return <Navigate to="/" replace />;
  }

  // המשתמש מחובר והוא מנהל - אפשר להציג את הילדים
  return <Outlet />;
};

export default AdminRoute;
