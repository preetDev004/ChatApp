import React, { useContext , useEffect } from "react";
import { authContext } from "../Context/authContext";
import { chatContext } from "../Context/chatContext";

const Message = ({message}) => {
 
  // console.log(message.dateData)
  const { currentUser } =useContext(authContext)
  const { data } =useContext(chatContext)
  useEffect(()=>{
    const scrollElement = document.getElementById('scrollElement')
    scrollElement.scrollTop = scrollElement.scrollHeight
  },[message])
 
  return (
    <>
    <div className={`p-1 flex my-1 gap-2 ${message.senderId === currentUser.uid && 'owner'}`}>
      <div className="flex flex-col items-center gap-1">
        <img
          className="w-10 h-10 object-cover rounded-full"
          src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}
          alt=""
        />
        <span className="text-sm text-black/70">{(message.dateData)}</span>
      </div>
      <div className="max-w-[40%] h-full flex flex-col gap-2 rounded-tr-lg rounded-br-lg rounded-bl-lg bg-slate-50 p-1 msgContainer">
        {message.img && <img
          className="w-full h-60 object-cover rounded-md"
          src={message.img}
          alt=""
        />}
        {message.text && <p className="p-1 ">
         {message.text}
          </p>}
      </div>
    </div>
    
    </>
  );
};

export default Message;
