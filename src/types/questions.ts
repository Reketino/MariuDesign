export type ProductQuestion = {
  id: string;
  product_id: string;
  title: string;
  content: string;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductAnswer = {
  id: string;
  question_id: string;
  user_id: string | null;
  content: string;
  is_official: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductQuestionWithAnswers = ProductQuestion & {
  product_answers: ProductAnswer[];
};

export type CreateProductQuestionInput = {
  product_id: string;
  title: string;
  content: string;
};

export type CreateProductAnswerInput = {
  question_id: string;
  content: string;
};
