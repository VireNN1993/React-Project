// src/pages/SignUp/SignUp.tsx
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { signupSchema } from "../../utils/validationSchemas";
import { SignupFormData } from "../../types/User";
import { signup } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Label, TextInput, Button, Checkbox, Spinner } from "flowbite-react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: joiResolver(signupSchema),
  });

  const onSubmit = async (formData: SignupFormData) => {
    try {
      setIsSubmitting(true);
      setServerError("");

      await signup(formData);
      toast.success("Registration successful! Please sign in.");
      navigate("/signin");
    } catch (error: unknown) {
      let errorMessage = "Registration failed. Please try again.";

      if (axios.isAxiosError(error) && error.response) {
        console.error("Signup failed:", error.response.data);
        // בדיקה ספציפית לשגיאות שכיחות
        if (error.response.status === 400) {
          // אם יש אובייקט שגיאה מהשרת עם הודעה
          if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }

          // בדיקה ספציפית אם המשתמש כבר רשום
          if (
            typeof error.response.data === "string" &&
            error.response.data.includes("User already registered")
          ) {
            errorMessage =
              "This email is already registered. Please use a different email or try to sign in.";
          } else if (
            error.response.data?.message?.includes("User already registered")
          ) {
            errorMessage =
              "This email is already registered. Please use a different email or try to sign in.";
          }
        }
      } else if (error instanceof Error) {
        console.error("Signup failed:", error.message);
      } else {
        console.error("Signup failed:", error);
      }

      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-xl rounded bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="mb-4 text-center text-2xl font-semibold dark:text-white">
        Create Account
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* NAME */}
        <div>
          <TextInput {...register("first")} placeholder="First Name" />
          {errors.first && (
            <p className="mt-1 text-sm text-red-500">{errors.first.message}</p>
          )}
        </div>

        <TextInput
          {...register("middle")}
          placeholder="Middle Name (optional)"
        />

        <div>
          <TextInput {...register("last")} placeholder="Last Name" />
          {errors.last && (
            <p className="mt-1 text-sm text-red-500">{errors.last.message}</p>
          )}
        </div>

        {/* CONTACT */}
        <div>
          <TextInput {...register("phone")} placeholder="Phone" />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <TextInput {...register("email")} placeholder="Email" />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <TextInput
            {...register("password")}
            type="password"
            placeholder="Password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* IMAGE */}
        <TextInput
          {...register("imageUrl")}
          placeholder="Image URL (optional)"
        />
        <TextInput
          {...register("imageAlt")}
          placeholder="Image Alt (optional)"
        />

        {/* ADDRESS */}
        <TextInput {...register("state")} placeholder="State (optional)" />

        <div>
          <TextInput {...register("country")} placeholder="Country" />
          {errors.country && (
            <p className="mt-1 text-sm text-red-500">
              {errors.country.message}
            </p>
          )}
        </div>

        <div>
          <TextInput {...register("city")} placeholder="City" />
          {errors.city && (
            <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>

        <div>
          <TextInput {...register("street")} placeholder="Street" />
          {errors.street && (
            <p className="mt-1 text-sm text-red-500">{errors.street.message}</p>
          )}
        </div>

        <div>
          <TextInput
            {...register("houseNumber")}
            type="number"
            placeholder="House Number"
          />
          {errors.houseNumber && (
            <p className="mt-1 text-sm text-red-500">
              {errors.houseNumber.message}
            </p>
          )}
        </div>

        <TextInput
          {...register("zip")}
          type="number"
          placeholder="ZIP Code (optional)"
        />

        {/* BIZ */}
        <div className="flex items-center gap-2">
          <Checkbox id="biz" {...register("biz")} />
          <Label htmlFor="biz" className="cursor-pointer">
            Register as Business
          </Label>
        </div>

        {/* SERVER ERROR */}
        {serverError && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            <p>{serverError}</p>
            {serverError.includes("already registered") && (
              <p className="mt-2">
                <Link
                  to="/signin"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign in instead
                </Link>
              </p>
            )}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Registering...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>

        <div className="mt-4 text-center">
          <span className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
          </span>
          <Link
            to="/signin"
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
