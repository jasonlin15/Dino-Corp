'use client'
import * as React from "react";
import { useState } from "react";
import "../css/input.css"

export default function Choice() {
  const [courseName, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("Multiple Choice");
  const [num, setNum] = useState("1");
  const optionQuestion = [ 
    { value: "Multiple Choice Question", label: "Multiple Choice Question" }, 
    { value: "True or False", label: "True or False" }, 
    { value: "Short Answer", label: "Short Answer" }, 
    { value: "Long Answer", label: "Long Answer"}
  ]; 

  const click = () => {
    if (courseName && subject && question && num) {
      alert("Course Name: " + courseName + "\nSubject: " + subject + "\nQuestion: " + question + "\nNumber:" + num);
    }
    else {
      alert("Please fill out all info");
    }
  }
  const changeName = event => {
    setName(event.target.value);
  }
  const changeSubject = event => {
    setSubject(event.target.value);
  }

  return (
    <div className="inputContainer">
      <div>
        <p className="text-white">Enter Your Course Name</p>
        <input className="courseName" onChange={changeName} value={courseName}/>
      </div>
      <div className="my-3">
        <p className="text-white">Enter Your Subject</p>
        <input className="subjectName" onChange={changeSubject} value={subject}/>
      </div>
      <div className="my-2">
        <p className="text-white">Select A Question Type</p>
        <select className="question" value={question} onChange={e => setQuestion(e.target.value)}> 
          {optionQuestion.map(option => ( 
          <option key={option.value} value={option.value}> 
            {option.label} 
          </option> ))} 
        </select> 
      </div>
      <div className="my-2">
        <p className="text-white">Number of Questions</p>
        <select className="numQuestion" onChange={e => setNum(e.target.value)}>
          {[...Array(10)].map((_, i) => i + 1).map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      <button className="generate" onClick={click}>Generate</button>
    </div>
  )
}