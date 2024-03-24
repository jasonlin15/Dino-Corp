import {ChatMessage} from "chatgpt";

export enum QuestionTypes {
  MULTIPLE_CHOICE = 'Multiple Choice',
  TRUE_FALSE = 'True/False',
  SHORT_ANSWER = 'Short Answer',
  LONG_ANSWER = 'Long Answer',
}

export interface Question {
  question: string;
  // Only applies to multiple choice and true/false
  answers?: string[];
  type: QuestionTypes;
}

export interface ILastResponse {
  lastResponse?: ChatMessage
}