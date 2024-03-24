'use server'
import {ChatGPTAPI, ChatMessage} from 'chatgpt';

enum QuestionTypes {
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

const api = new ChatGPTAPI({
  apiKey: process.env.CHATGPT_API_KEY!,
  systemMessage: `You are speaking with a college professor who is creating quiz questions. Create questions that are relevant to the topic and course provided by the professor. Adapt if asked to make questions easier or harder, but start at medium difficulty.
    They will also list the types of questions desired (such as multiple choice, true/false, short answer, or long answer) and how many of each.
    You must respond with the questions in a numbered list labeled '1.', '2.', and so on. For multiple choice questions, include 4 answers below the question labeled 'A)', 'B)', 'C)', and 'D)'. Do not reveal the correct answer for any question. Group questions by type and include a header that starts with 3 hashtags (###) for each type of question. For example: '### Multiple Choice Questions'. Do not include anything in the response other than the headers and questions.`,
});

export async function generateQuestions(topic: string, course: string, multipleChoice: number, trueFalse: number, short: number, long: number): Promise<ChatMessage> {
  const query = `Make ${multipleChoice} multiple choice questions, ${trueFalse} true/false questions, ${short} short answer questions, and ${long} long answer questions about '${topic}' for a '${course}' class.`
  return await api.sendMessage(query);
}

export function parseResponse(response: string): Question[] {
  let currentType = QuestionTypes.MULTIPLE_CHOICE;
  return response
    .split('\n')
    .filter((line) => line.trim() !== '')
    .reduce((prev: Question[], curr) => {
      const currTrimmed = curr.trim()
      if (curr.startsWith('###')) {
        if (curr.toLowerCase().includes("multiple")) {
          currentType = QuestionTypes.MULTIPLE_CHOICE;
        } else if (curr.toLowerCase().includes("true")) {
          currentType = QuestionTypes.TRUE_FALSE;
        } else if (curr.toLowerCase().includes("short")) {
          currentType = QuestionTypes.SHORT_ANSWER;
        } else {
          // Maybe this is wrong if the AI screws up the response but this is probably not likely
          currentType = QuestionTypes.LONG_ANSWER;
        }
        return prev;
      }

      if (currTrimmed.startsWith('A)') || currTrimmed.startsWith('B)') || currTrimmed.startsWith('C)') || currTrimmed.startsWith('D)')) {
        if (prev.length === 0) {
          return prev;
        }
        const lastQuestion = prev[prev.length - 1];
        if (lastQuestion.type === QuestionTypes.MULTIPLE_CHOICE) {
          lastQuestion.answers = lastQuestion.answers || [];
          lastQuestion.answers.push(currTrimmed.replace(/^[A-Z]+\)/, '').trim());
        }
        return prev;
      }

      const newQuestion: Question = {
        question: currTrimmed.replace(/^[0-9]+./, '').trim(),
        type: currentType,
      };
      return [...prev, newQuestion]
    }, [])
}

export async function makeHarder(previousResponse: ChatMessage) {
  return await api.sendMessage('Make the questions harder.', {
    parentMessageId: previousResponse.id,
  });
}

export async function makeEasier(previousResponse: ChatMessage) {
  return await api.sendMessage('Make the questions easier.', {
    parentMessageId: previousResponse.id,
  });
}
