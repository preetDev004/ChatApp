import React, { useContext, useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { authContext } from "../Context/authContext";
import { chatContext } from "../Context/chatContext";

const Chats = () => {
  const { currentUser } = useContext(authContext);
  const { dispatch } = useContext(chatContext);
  const [chats, setChats] = useState([]);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "usersChats", currentUser.uid),
        (doc) => {
          setChats(doc.data());
        }
      );
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);
  // console.log(Object.entries(chats));
  const handleSelect = (u)=>{
    dispatch({
      type:'CHANGE_USER',
      payload:u
    })
  }
  return (

    <div className="chatsHeight overflow-y-scroll scroll-smooth scrollbar-none">
      {(Object.entries(chats).length>0) ? Object.entries(chats)?.sort((a,b)=>b[1].date-a[1].date).map((chat) => {
        return (
          <div onClick={()=>handleSelect(chat[1].userInfo)} key={chat[0]} className="flex items-center gap-2 cursor-pointer p-2  hover:bg-whatsAppBg/20 hover:drop-shadow-lg hover:rounded-md">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={chat[1].userInfo.photoURL}
              alt=""
              
            /> 
            <div>
              <span className="text-lg font-medium text-gray-100">{chat[1].userInfo.displayName}</span>
              <p className="text-[14px] text-gray-300">{chat[1]?.lastMsg ? (chat[1].lastMsg?.text ? chat[1].lastMsg.text : <><i className="fa-regular fa-image"></i> image</>):''}</p>
            </div>
          </div>
        );
      }):
      <>
      <div className="flex justify-center py-8 text-lg font-semibold text-whatsAppBg">
        SEARCH A USER FOR CHAT!
      </div>
      </>
      }
    </div>
  );
};

export default Chats;
