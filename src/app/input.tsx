import * as React from "react";
import {ChangeEvent, Dispatch, SetStateAction, useState} from "react";
import "../css/input.css"
import {generateQuestions} from "./questions";
import {parseResponse} from "./questions"
import {ILastResponse, Question} from "@/app/types";

export default function Choice({setQuestions, setPrevResp}: {setQuestions: Dispatch<SetStateAction<Question[]>>, setPrevResp: Dispatch<SetStateAction<ILastResponse>>}) {
  const [courseName, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [mcq, setMCQ] = useState(0);
  const [tf, setTF] = useState(0);
  const [sa, setSA] = useState(0);
  const [la, setLA] = useState(0);

  const click = async () => {
    if (courseName && subject) {
      const quary = await generateQuestions (subject, courseName, mcq, tf, sa, la);
      setPrevResp({lastResponse: quary})
      const result = await parseResponse(quary.text);
      setQuestions(result)
    }
    else {
      alert("Please fill out all info");
    }
  }

  const changeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }
  const changeSubject = (event: ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
  }

  return (
    <div className="inputContainer">
      <h1 className="text-white text-2xl">Question Generator</h1>
      <p className="text-white text-xs italic">Sponsored by Dino Luzzi</p>
      <div className="my-10">
        <p className="text-white">Enter Your Course Name</p>
        <input className="courseName" onChange={changeName} value={courseName} placeholder="Enter A Course Name"/>
      </div>
      <div>
        <p className="text-white">Enter Your Subject</p>
        <input className="subjectName" onChange={changeSubject} value={subject} placeholder="Enter A Subject"/>
      </div>
      <div className="wtf">
        <p className="text-white">Number of Questions for Multiple Choice</p>
        <select className="numQuestion" onChange={e => setMCQ(Number(e.target.value))}>
          {[...Array(11)].map((_, i) => i).map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      <div className="wtf">
        <p className="text-white">Number of Questions for True or False</p>
        <select className="numQuestion" onChange={e => setTF(Number(e.target.value))}>
          {[...Array(11)].map((_, i) => i).map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      <div className="wtf">
        <p className="text-white">Number of Questions for Short Answer</p>
        <select className="numQuestion" onChange={e => setSA(Number(e.target.value))}>
          {[...Array(11)].map((_, i) => i).map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      <div className="wtf">
        <p className="text-white">Number of Questions for Long Answer</p>
        <select className="numQuestion" onChange={e => setLA(Number(e.target.value))}>
          {[...Array(11)].map((_, i) => i).map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      <button className="generate" onClick={click}>Generate</button>
    </div>
  )
}