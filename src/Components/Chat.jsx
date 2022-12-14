import React, { useContext } from "react";
import { motion } from "framer-motion";
import Messages from "./Messages";
import Input from "./Input";
import { chatContext } from "../Context/chatContext";

const Chat = () => {
  const { data } = useContext(chatContext);
  return (
    <div className="basis-3/4 w-full h-full relative">
      {data && data?.user && Object.keys(data.user).length !== 0 ? (
        <>
          <img
            className="absolute  w-full object-cover"
            src="https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png"
            alt=""
          />
          <div className="absolute w-full bg-[#127644] h-[66px] p-4 flex items-center justify-between text-gray-100">
            <div className="flex gap-2 items-center">
              {data.user.photoURL && (
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={data.user?.photoURL}
                  alt=""
                />
              )}
              <span>{data.user?.displayName}</span>
            </div>
            <div className="flex gap-2 items-center">
              <motion.i
                whileTap={{ scale: 0.85 }}
                className="px-2 fa-solid fa-video"
              ></motion.i>
              <motion.i
                whileTap={{ scale: 0.85 }}
                className="px-2 fa-solid fa-user-plus"
              ></motion.i>
              <motion.i
                whileTap={{ scale: 0.85 }}
                className="px-2 fa-solid fa-ellipsis"
              ></motion.i>
            </div>
          </div>
          <div className=" absolute w-full top-[66px] p-2 height">
            <Messages />
          </div>
          <div className="absolute w-full bottom-0 bg-white">
            <Input />
          </div>
        </>
      ) : (
        <div className="bg-whatsAppBg/50 text-3xl text-signUp font-bold w-full h-full flex items-center justify-center">
          CHOOSE A CHAT TO START CONVERSATION!
        </div>
      )}
    </div>
  );
};

export default Chat;
