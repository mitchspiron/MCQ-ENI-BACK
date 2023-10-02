export type Users = {
  id: number;
  firstname: string;
  lastname: string;
  registrationnumber: string;
  slug: string;
  phone: string;
  email: string;
  password: string;
  levels: {
    id: number;
    designation: string;
  };
  isadmin: boolean;
  user_role: {
    id: number;
    role: string;
  };
  createdAt: Date;
};

export type UsersCreate = {
  id: number;
  firstname: string;
  lastname: string;
  registrationnumber: string;
  slug: string;
  phone: string;
  email: string;
  password: string;
  level: number;
  isadmin: boolean;
  role: number;
  createdAt: Date;
};

export type UsersPassword = {
  id: number;
  password: string;
};

export type UserTokenWithoutPassword = [
  {
    id: number;
    firstname: string;
    lastname: string;
    registrationnumber: string;
    slug: string;
    phone: string;
    email: string;
    level: number;
    isadmin: boolean;
    role: number;
  },
  {
    access_token: string;
  },
];
