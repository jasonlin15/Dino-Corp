export enum QuestionTypes {
  MULTIPLE_CHOICE = 'multiple choice',
  TRUE_FALSE = 'true/false',
  SHORT_ANSWER = 'short answer',
  LONG_ANSWER = 'long answer',
}

export interface Question {
  question: string;
  // Only applies to multiple choice
  answers?: string[];
  type: QuestionTypes;
}