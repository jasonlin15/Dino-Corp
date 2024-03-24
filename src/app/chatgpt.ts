'use server'
import {ChatGPTAPI, ChatMessage} from 'chatgpt';

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
