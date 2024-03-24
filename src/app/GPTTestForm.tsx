'use client'
import {useState} from 'react'

import * as gpt from './chatgpt'
import {ChatMessage} from 'chatgpt'

interface ILastResponse {
  lastResponse?: ChatMessage
}

export default function GPTTestForm() {
  const [response, setResponse] = useState('')
  const [lastMsg, setLastMsg] = useState<ILastResponse>({})

  async function send() {
    const msg = await gpt.generateQuestions("File Systems", "Operating Systems", 4, 2, 2, 2)
    setResponse(msg.text)
    setLastMsg(({lastResponse: msg}))
  }

  async function harder() {
    if (!lastMsg.lastResponse) return
    const msg = await gpt.makeHarder(lastMsg.lastResponse)
    setResponse(msg.text)
    setLastMsg(({lastResponse: msg}))
  }

  async function easier() {
    if (!lastMsg.lastResponse) return
    const msg = await gpt.makeEasier(lastMsg.lastResponse)
    setResponse(msg.text)
    setLastMsg(({lastResponse: msg}))
  }

  return (
    <>
      <form action={send}>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Test Query
        </button>
      </form>
      <form action={harder}>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Make Questions Harder
        </button>
      </form>
      <form action={easier}>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Make Questions Easier
        </button>
      </form>
      <pre>{response}</pre>
    </>
  );
}
