import React, { useContext } from "react";
import logo from "../img/logo.svg";
import { motion } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { authContext } from "../Context/authContext";
import { chatContext } from "../Context/chatContext";

const Navbar = () => {
  const { currentUser } = useContext(authContext);
  const { dispatch } = useContext(chatContext);
  const handleLogout = () => {
    signOut(auth);
    localStorage.removeItem("user");
    dispatch({
      type:"LOGOUT_USER",
      payload:{}
    })
  };
  // console.log(currentUser)
  return (
    <div className="flex h-[65px] w-full bg-whatsAppBg/50 items-center justify-between p-2 ">
      <span className="flex items-center gap-1 font-semibold">
        <img className="w-7 h-7" src={logo} alt="WhatsApp" />
        WhatsApp
      </span>
      <div className="flex items-center gap-2">
        <img
          className="bg-green-100 w-7 h-7 rounded-full object-cover"
          src={currentUser.photoURL}
          alt=""
        />
        <span>{currentUser.displayName}</span>
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 0.95 }}
          className="w-12 h-7 bg-[#10a549] p-1 rounded-md hover:drop-shadow-md outline-none text-xs"
        >
          Logout
        </motion.button>
      </div>
    </div>
  );
};

export default Navbar;
