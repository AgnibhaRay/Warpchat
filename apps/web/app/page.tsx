'use client'
import { useState } from 'react';
import { useSocket}  from '../context/SocketProvider';
import classes from './page.module.css'
export default function Page(){
  const {sendMessage, messages} = useSocket();
  const [message, setmessage] = useState(""); 
  return (
    <div>
      
      <div>
        <input onChange={(e)=>setmessage(e.target.value)} className={classes["chat-input"]} placeholder="Enter Message" />
        <button onClick={(e) => sendMessage(message)} className={classes["button"]}>Send</button>
      </div>
      <div>
        <h1>All Messages Here</h1>
        {messages.map((e)=>(
          <li>{e}</li>
        ))}
      </div>
    </div>
  )
}