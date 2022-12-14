import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { chatContext } from "../Context/chatContext";
import { db } from "../firebaseConfig";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(chatContext);
  
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if(doc.exists()){ ;
       setMessages(((doc.data().messages)))
        // setMessages(All[0])
      }
    });
    return () => {
      unsub();
    };
  }, [data.chatId]);
  return (
    <div id='scrollElement' className="overflow-y-scroll w-full h-full scroll-smooth scrollbar-none">
      {messages.length>0 && messages.map((message) => {
        return <Message key={message.id} message={message} />;
      })}
    </div>
  );
};

export default Messages;
