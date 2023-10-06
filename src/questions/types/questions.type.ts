export type Questions = {
  id: number;
  content: string;
  test: number;
};

export type Choices = {
  id: number;
};

export type GetQuestionsToAnswer = {
  id: number;
  content: string;
  tests: {
    id: number;
    designation: string;
    slug: string;
    subject: string;
  };
  createdAt: Date;
};

export type GetQuestionsToChoice = {
  id: number;
  content: string;
  tests: {
    id: number;
    designation: string;
    slug: string;
    subject: string;
  };
  choices: {
    id: number;
    content: string;
    iscorrect: boolean;
  }[];
  createdAt: Date;
};
