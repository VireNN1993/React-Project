import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { signupSchema } from "../../utils/validationSchemas";
import { SignupFormData } from "../../types/User";
import { signup } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Checkbox } from "flowbite-react";
import { useState } from "react";

const SignUp = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: joiResolver(signupSchema),
  });

  const onSubmit = async (formData: SignupFormData) => {
    try {
      await signup(formData); // נשלח כפורמט מלא מהפונקציה עצמה
      navigate("/signin");
    } catch {
      setServerError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-xl rounded bg-white p-6 shadow">
      <h2 className="mb-4 text-center text-2xl font-semibold">
        Create Account
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* NAME */}
        <TextInput {...register("first")} placeholder="First Name" />
        {errors.first && (
          <p className="text-sm text-red-500">{errors.first.message}</p>
        )}
        <TextInput
          {...register("middle")}
          placeholder="Middle Name (optional)"
        />
        <TextInput {...register("last")} placeholder="Last Name" />
        {errors.last && (
          <p className="text-sm text-red-500">{errors.last.message}</p>
        )}

        {/* CONTACT */}
        <TextInput {...register("phone")} placeholder="Phone" />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
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
        <TextInput {...register("country")} placeholder="Country" />
        <TextInput {...register("city")} placeholder="City" />
        <TextInput {...register("street")} placeholder="Street" />
        <TextInput
          {...register("houseNumber")}
          type="number"
          placeholder="House Number"
        />
        <TextInput
          {...register("zip")}
          type="number"
          placeholder="ZIP Code (optional)"
        />

        {/* BIZ */}
        <div className="flex items-center gap-2">
          <Checkbox {...register("biz")} />
          <Label htmlFor="biz">Register as Business</Label>
        </div>

        {/* SERVER ERROR */}
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
};

export default SignUp;
