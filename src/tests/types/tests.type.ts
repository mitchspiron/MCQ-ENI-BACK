export type Tests = {
  id: number;
  designation: string;
  slug: string;
  subject: string;
  yeartest: string;
  duration: number;
  datetest: Date;
  isvisible: boolean;
  isdone: boolean;
  level: number;
  user: number;
  createdAt: Date;
};

export type GetTests = {
  id: number;
  designation: string;
  slug: string;
  subject: string;
  yeartest: string;
  duration: number;
  datetest: Date;
  isvisible: boolean;
  isdone: boolean;
  levels: {
    id: number;
    designation: string;
  };
  users: {
    id: number;
    firstname: string;
    lastname: string;
    user_role: {
      id: number;
      role: string;
    };
  };
  createdAt: Date;
};
