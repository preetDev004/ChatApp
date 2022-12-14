import React, { useContext , useState } from "react";
import {
  collection,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  // onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getDocs, getDoc, doc } from "firebase/firestore";
import { authContext } from "../Context/authContext";
import { chatContext } from "../Context/chatContext";


const Search = () => {
  const [user, setUser] = useState([]);
  const [username, setUsername] = useState("");
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(authContext);
  const { dispatch } = useContext(chatContext);
 
  const handleSearch = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("displayName", "==", username)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length === 0) {
        setErr(true);
        setTimeout(() => {
          setErr(false);
        }, 3000);
      }

      setUser(querySnapshot.docs);
    } catch (error) {
      setErr(true);
      setTimeout(() => {
        setErr(false);
      }, 3000);
    }
  };
  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };
  const handleSelect = async (user) => {
    if (currentUser.uid === user.data().uid) {
      // console.log('true')
      return;
    }
    dispatch({
      type:'CHANGE_USER',
      payload:user.data()
    })
    // check weather the group exits or not, if not create new one .
    const combinedId =
      currentUser.uid > user.data().uid
        ? currentUser.uid + user.data().uid
        : user.data().uid + currentUser.uid;
    try {
      const response = await getDoc(doc(db, "chats", combinedId));
      if (!response.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "usersChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.data().uid,
            displayName: user.data().displayName,
            photoURL: user.data().photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "usersChats", user.data().uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {}
    setUser([]);
    setUsername("");
  };

  return (
    <div className="border-b border-white/70">
      <div className="flex items-center p-2 justify-between ">
        <div className="flex items-center ">
          <i className="fa-solid fa-magnifying-glass text-gray-300"></i>
          <input
            className="bg-transparent focus:outline-none w-full p-2 placeholder:text-gray-300 placeholder:text-sm"
            type="text"
            placeholder="Find a user"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
            onKeyDown={handleKey}
          />
        </div>
        <i
          onClick={handleSearch}
          className="cursor-pointer fa-solid fa-arrow-right text-gray-300"
        ></i>
      </div>
      {user.length > 0 &&
        user.map((u) => {
          return (
            <div
              key={u.data().uid}
              className="flex items-center gap-2 cursor-pointer p-2 hover:bg-whatsAppBg/20 hover:drop-shadow-lg hover:rounded-md"
              onClick={() => handleSelect(u)}
            >
              <img
                className="w-10 h-10 rounded-full"
                src={u.data().photoURL}
                alt=""
              />
              <div>
                <span className="text-lg font-medium text-gray-100">
                  {u.data().displayName}
                </span>
              </div>
            </div>
          );
        })}
      {err && (
        <div className="w-full text-center p-2">
          <span>No Results!</span>
        </div>
      )}
    </div>
  );
};

export default Search;
