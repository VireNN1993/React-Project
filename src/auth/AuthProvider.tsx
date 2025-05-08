// src/auth/AuthProvider.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { jwtDecode } from "jwt-decode";
import { UserType } from "../types/User";
import axios from "axios";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        try {
          // פענוח הטוקן לפי טיפוס UserType הקיים
          const decoded = jwtDecode<UserType>(token);

          // שימוש ב-type assertion להוספת השדות של JWT
          const jwtDecoded = decoded as UserType & {
            exp?: number;
            iat?: number;
          };

          // בדיקת תוקף הטוקן (אופציונלי)
          const currentTime = Date.now() / 1000;
          if (jwtDecoded.exp && jwtDecoded.exp < currentTime) {
            console.log("Token expired, logging out");
            localStorage.removeItem("token");
            return;
          }

          // הגדרת טוקן כדיפולט לכל בקשות axios
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // עדכון סטייט Redux
          dispatch(setUser(decoded));

          console.log("User authenticated from stored token");
        } catch (error) {
          console.error("Error decoding token:", error);
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      }
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
