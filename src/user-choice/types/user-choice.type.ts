export type UserChoice = {
  id: number;
  user: number;
  choice: number;
  createdAt: Date;
};

export type GetUserChoice = {
  id: number;
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
  choices: {
    id: number;
    content: string;
    iscorrect: boolean;
    question_to_choice: {
      id: number;
      content: string;
    };
  };
  createdAt: Date;
};
