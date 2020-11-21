export interface BaseQuestion {
  id: number;
  question: string;
}

export interface ClientQuestion extends BaseQuestion {
  answers: [string, string, string, string];
}