export type UserAnswer = {
  id: number;
  content: string;
  iscorrect: boolean;
  iscorrected: boolean;
  question: number;
  user: number;
  createdAt: Date;
};

export type GetUserAnswer = {
  id: number;
  content: string;
  iscorrect: boolean;
  iscorrected: boolean;
  question_to_answer: {
    id: number;
    content: string;
    tests: {
      id: number;
      designation: string;
      slug: string;
      subject: string;
    };
  };
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
  createdAt: Date;
};
