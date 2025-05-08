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
      url: formData.imageUrl || "",
      alt: formData.imageAlt || "",
    },
    address: {
      state: formData.state || "",
      country: formData.country,
      city: formData.city,
      street: formData.street,
      houseNumber: formData.houseNumber,
      zip: formData.zip || 0,
    },
    isBusiness: formData.biz || false,
  };

  const { data } = await axios.post(`${BASE_URL}/users`, payload);
  return data;
};

export const login = async (credentials: SignInFormData) => {
  const { data } = await axios.post(`${BASE_URL}/users/login`, credentials);
  return data;
};
