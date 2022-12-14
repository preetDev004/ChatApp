import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import addGallary from "../img/addGalary.png";
import { authContext } from "../Context/authContext";
import { chatContext } from "../Context/chatContext";
import {
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";

const Input = () => {
  let d = new Date();
  const { currentUser } = useContext(authContext);
  const { data } = useContext(chatContext);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [err, setErr] = useState(false);
  const [msg, setMsg] = useState("");
  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, `chatImages/${uuid()}`);

      const uploadTask = uploadBytesResumable(storageRef, img);
      try {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // console.log(snapshot)
          },
          (error) => {
            // console.log(error);
            setErr(true);
            setMsg("Error");
            setTimeout(() => {
              setErr(false);
              setMsg("");
            }, 3000);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then(async (downloadURL) => {
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    img: downloadURL,
                    senderId: currentUser.uid,
                    dateData: `${
                      d.toDateString().split(" ")[0]
                    }, ${d.getHours()}:${d.getMinutes()}`,
                  }),
                });
              })
              .catch((err) => {
                setErr(true);
                setMsg("Error");
                setTimeout(() => {
                  setErr(false);
                  setMsg("");
                }, 3000);
              });
          }
        );
      } catch (error) {
        setErr(true);
        setMsg("Error");
        setTimeout(() => {
          setErr(false);
          setMsg("");
        }, 3000);
      }
    } else {
      if (!text.replace(/\s/g, "").length) {
        setErr(true);
        setMsg("Type Something...");
        setTimeout(() => {
          setErr(false);
          setMsg("");
        }, 2000);
        return;
      }
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: text,
          senderId: currentUser.uid,
          dateData: `${
            d.toDateString().split(" ")[0]
          }, ${d.getHours()}:${d.getMinutes()}`,
        }),
      });
    }
    await updateDoc(doc(db, "usersChats", currentUser.uid), {
      [data.chatId + ".lastMsg"]: {
        text: text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "usersChats", data.user.uid), {
      [data.chatId + ".lastMsg"]: {
        text: text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setText("");
    setImg(null);
  };
  const handleKey = (e) => {
    e.code === "Enter" && handleSend();
  };
  return (
    <div className="flex w-full h-[66px] items-center justify-between">
      {err && (
        <div className="text-lg font-bold bg-red-200 p-2 text-red-600 rounded-xl duration-150 transition-all ease-in-out">
          {msg}
        </div>
      )}
      <input
        className="p-2 w-full outline-none bg-transparent placeholder:text-gray-400"
        placeholder="Type Something..."
        type="text"
        value={text}
        disabled={img ? true : false}
        onKeyDown={handleKey}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center gap-2 px-2">
        <i className="fa-lg cursor-pointer text-gray-400 fa-rotate-270 fa-solid fa-paperclip"></i>
        <label>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            disabled={text ? true : false}
            onChange={(e) => {
              setImg(e.target.files[0]);
            }}
          />
          <img
            className="cursor-pointer w-10 h-7 rounded-full"
            src={addGallary}
            alt=""
          />
        </label>
        <motion.button
          onClick={handleSend}
          whileTap={{ scale: 0.75 }}
          className="bg-[#127644] rounded-md hover:drop-shadow-lg text-gray-200 p-2"
        >
          Send
        </motion.button>
      </div>
    </div>
  );
};

export default Input;
