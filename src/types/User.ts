export type UserType = {
  _id: string;
  name: {
    first: string;
    middle?: string;
    last: string;
  };
  phone: string;
  email: string;
  image?: {
    url?: string;
    alt?: string;
  };
  address?: {
    state?: string;
    country: string;
    city: string;
    street: string;
    houseNumber: number;
    zip?: number;
  };
  isAdmin: boolean;
  isBusiness: boolean;
};

export type SignupFormData = {
  first: string;
  middle?: string;
  last: string;
  phone: string;
  email: string;
  password: string;
  imageUrl?: string;
  imageAlt?: string;
  state?: string;
  country: string;
  city: string;
  street: string;
  houseNumber: number;
  zip?: number;
  biz?: boolean;
};

export type SignInFormData = {
  email: string;
  password: string;
};
