'use client'
import Input from "./input"
import QuizOutput from "@/app/quiz-output";
import {ILastResponse, Question, QuestionTypes} from "@/app/types";
import {useState} from "react";

export default function Home() {
  const testQuestions: Question[] = [
    {
      question: "What is the main purpose of a file system in an operating system?",
      type: QuestionTypes.MULTIPLE_CHOICE,
      answers: ["To store only executable files", "To manage and organize files on storage devices", "To control the flow of data between hardware components", "To allocate memory for running processes"]
    },
    {
      question: "Which of the following is not a type of file system?",
      type: QuestionTypes.MULTIPLE_CHOICE,
      answers: ["FAT32", "NTFS", "HTML", "ext4"]
    },
    // {
    //   question: "What does FAT stand for in relation to file systems?",
    //   type: QuestionTypes.MULTIPLE_CHOICE,
    //   answers: ["File Access Table", "File Allocation Table", "Fast Action Table", "Folder Allocation Table"]
    // },
    {
      question: "This is true.",
      type: QuestionTypes.TRUE_FALSE,
    },
    {
      question: "This is a short answer.",
      type: QuestionTypes.SHORT_ANSWER,
    },
    {
      question: "This is a long answer.",
      type: QuestionTypes.LONG_ANSWER,
    }
  ]
  const [questions, setQuestions] = useState([] as Question[])
  const [prevResp, setPrevResp] = useState({} as ILastResponse)
  const [courseName, setCourseName] = useState('');
  const [subject, setSubject] = useState('');

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {questions.length === 0 ? <Input setQuestions={setQuestions} setPrevResp={setPrevResp} /> : <QuizOutput questions={questions} setQuestions={setQuestions} prevResp={prevResp} setPrevResp={setPrevResp}/>}
    </main>
  );
}