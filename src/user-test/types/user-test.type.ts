export type UserTest = {
  id: number;
  user: number;
  test: number;
  isfinished: boolean;
  createdAt: Date;
};

export type GetUserTest = {
  id: number;
  isfinished: boolean;
  users: {
    id: number;
    firstname: string;
    lastname: string;
    registrationnumber: string;
    levels: {
      id: number;
      designation: string;
      slug: string;
    };
  };
  tests: {
    id: number;
    designation: string;
    slug: string;
    subject: string;
  };
  createdAt: Date;
};
