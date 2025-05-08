import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { signinSchema } from "../../utils/validationSchemas";
import { SignInFormData, UserType } from "../../types/User";
import { login } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { TextInput, Button } from "flowbite-react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: joiResolver(signinSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const token = await login(data);
      localStorage.setItem("token", token);
      const decodedUser = jwtDecode<UserType>(token);
      dispatch(setUser(decodedUser));
      navigate("/");
    } catch {
      setServerError("Invalid email or password.");
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded bg-white p-6 shadow">
      <h2 className="mb-4 text-center text-2xl font-semibold">Sign In</h2>
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
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default SignIn;
