// src/pages/SignIn/SignIn.tsx
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { signinSchema } from ".././utils/validationSchemas";
import { SignInFormData, UserType } from ".././types/User";
import { login } from ".././services/userService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from ".././redux/slices/userSlice";
import { TextInput, Button, Spinner } from "flowbite-react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: joiResolver(signinSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      setServerError("");

      // ניקוי כל הטוקנים הקיימים
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];

      // ניסיון התחברות
      const token = await login(data);

      if (!token) {
        throw new Error("No token received from server");
      }

      // שמירת הטוקן
      localStorage.setItem("token", token);

      // פענוח הטוקן
      const decodedUser = jwtDecode<UserType>(token);

      // לוג לדיבוג
      console.log("Login successful:", {
        token: token.substring(0, 15) + "...",
        user: {
          id: decodedUser._id,
          name: decodedUser.name?.first,
          isAdmin: decodedUser.isAdmin,
          isBusiness: decodedUser.isBusiness,
        },
      });

      // הגדרת הדר Authorization לבקשות עתידיות
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // עדכון מצב המשתמש ב-Redux
      dispatch(setUser(decodedUser));

      toast.success(`Welcome back, ${decodedUser.name?.first || "User"}`);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);

      // טיפול משופר בשגיאות
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || "Invalid email or password",
        );
      } else if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Invalid email or password");
      }

      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="mb-4 text-center text-2xl font-semibold dark:text-white">
        Sign In
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextInput {...register("email")} placeholder="Email" />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
        <TextInput
          {...register("password")}
          type="password"
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Signing in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </div>
  );
};

export default SignIn;
