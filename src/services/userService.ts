// src/services/userService.ts
import axios from "axios";
import { SignupFormData, SignInFormData } from "../types/User";

export const BASE_URL = "https://monkfish-app-z9uza.ondigitalocean.app/bcard2";

export const signup = async (formData: SignupFormData) => {
  const payload = {
    name: {
      first: formData.first,
      middle: formData.middle || "",
      last: formData.last,
    },
    phone: formData.phone,
    email: formData.email,
    password: formData.password,
    image: {
      url:
        formData.imageUrl?.trim() ||
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      alt: formData.imageAlt || "User image",
    },
    address: {
      state: formData.state || "",
      country: formData.country,
      city: formData.city,
      street: formData.street,
      houseNumber: formData.houseNumber,
      zip: formData.zip ?? 0,
    },
    isBusiness: formData.biz ?? false,
  };

  const { data } = await axios.post(`${BASE_URL}/users`, payload);
  return data;
};

export const login = async (credentials: SignInFormData) => {
  const { data } = await axios.post(`${BASE_URL}/users/login`, credentials);
  return data;
};

export const getUser = async (userId: string, token: string) => {
  const { data } = await axios.get(`${BASE_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const updateUser = async (
  userId: string,
  userData: Partial<SignupFormData>,
  token: string,
) => {
  const { data } = await axios.put(`${BASE_URL}/users/${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const getAllUsers = async (token: string) => {
  const { data } = await axios.get(`${BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const deleteUser = async (userId: string, token: string) => {
  await axios.delete(`${BASE_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeBusinessStatus = async (userId: string, token: string) => {
  const { data } = await axios.patch(
    `${BASE_URL}/users/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};
