export type Token = {
  access_token: string;
};

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  registrationnumber: string;
  phone: string;
  email: string;
  password: string;
  level: number;
  isadmin: boolean;
  role: number;
  createdAt: Date;
};

export type UserToken = [
  {
    id: number;
    firstname: string;
    lastname: string;
    registrationnumber: string;
    phone: string;
    email: string;
    password: string;
    level: number;
    isadmin: boolean;
    role: number;
  },
  {
    access_token: string;
  },
];
