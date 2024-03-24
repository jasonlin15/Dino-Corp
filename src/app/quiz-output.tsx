import {ILastResponse, Question} from "@/app/types";
import {generateDoc} from "@/app/doc-generator";
import * as question from "@/app/questions";
import {Dispatch, SetStateAction, useState} from "react";

export default function QuizOutput({questions, setQuestions, prevResp, setPrevResp,}: { questions: Question[], setQuestions: Dispatch<SetStateAction<Question[]>>, prevResp: ILastResponse, setPrevResp: Dispatch<SetStateAction<ILastResponse>>,}) {
  const [gptRunning, setGptRunning] = useState(false)

  async function makeEasier() {
    if (!prevResp.lastResponse || gptRunning) return
    setGptRunning(true)
    const newMsg = await question.makeEasier(prevResp.lastResponse)
    setPrevResp({lastResponse: newMsg})
    const newQs = await question.parseResponse(newMsg.text)
    setQuestions(newQs)
    setGptRunning(false)
  }

  async function makeHarder() {
    if (!prevResp.lastResponse || gptRunning) return
    setGptRunning(true)
    const newMsg = await question.makeHarder(prevResp.lastResponse)
    setPrevResp({lastResponse: newMsg})
    const newQs = await question.parseResponse(newMsg.text)
    setQuestions(newQs)
    setGptRunning(false)
  }

  return (
    <>
      <h1 className='text-4xl text-center mb-4'>Your Quiz Output</h1>
      <div className="p-6 mx-auto bg-white rounded-xl shadow-md grid grid-cols-1 md:grid-cols-3">
        {
          questions.map((question, index) => (
            <div key={index} className="mt-4 bg-blue-100 p-4 m-2 rounded-md">
              <h2 className="font-bold text-lg mb-2 text-gray-700">Question {index + 1}</h2>
              <h3 className="font-bold text-sm mb-2 text-gray-600">{question.type}</h3>
              <p className="text-gray-700">{question.question}</p>
              {
                question.answers && question.answers.map((answer, i) => (
                  <p key={i} className="ml-2 text-gray-600">{String.fromCharCode(65 + i)}) {answer}</p>
                ))
              }
            </div>
          ))
        }
      </div>
      <div className="md:columns-2">
        <form>
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4" onClick={makeHarder} disabled={gptRunning}>
            Make Questions Harder
          </button>
        </form>
        <form>
          <button className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={makeEasier} disabled={gptRunning}>
            Make Questions Easier
          </button>
        </form>
        <form>
          <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={(e) => {
            e.preventDefault()
            generateDoc(questions)
          }}>
            Download Quiz as Word Document
          </button>
        </form>
        <form>
          <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={(e) => {
            e.preventDefault()
            setQuestions([])
          }}>
            Make New Quiz
          </button>
        </form>
      </div>
    </>
  );
}