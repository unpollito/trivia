export interface AnswerRequestBody {
  id: number;
  answer: string;
}

export interface AnswerResponseBody {
  isCorrect: boolean;
}
