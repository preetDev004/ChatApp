/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Loader from "./Loader";

const Login = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [wait, setWait] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      setWait(true);
      await signInWithEmailAndPassword(auth, email, password);
      // setCurrentUser(response.user)
      navigate("/");
      setWait(false);
    } catch (error) {
      // console.log(error);
      setErr(true);
      setTimeout(() => {
        setErr(false);
      }, 3000);
    }
  };

  return (
    <div className="w-full h-full bg-signUp flex flex-col gap-4 items-center justify-center">
      <div className="w-[80%] h-[340px] md:w-[50%] lg:w-[35%] bg-gray-100 rounded-xl drop-shadow-2xl flex items-center justify-center flex-col gap-2">
        <div className="flex items-center justify-center flex-col gap-2">
          <span className="font-bold text-3xl md:text-[2rem] text-signUp">
            WhatsApp
          </span>
          <span className="text-lg text-signUp">Log in</span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center flex-col gap-4 w-full p-4"
        >
          <input
            required
            type="email"
            placeholder="Email"
            className="bg-transparent border-b-2  border-signUp focus:outline-none w-[95%] py-1"
          />
          <input
            minLength={8}
            required
            type="password"
            placeholder="Password"
            className="bg-transparent border-b-2  border-signUp focus:outline-none w-[95%] py-1"
          />

          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 0.95 }}
            className="bg-signUp w-[95%] p-2 rounded-md text-white hover:bg-green-600 hover:drop-shadow-xl"
          >
            Log in
          </motion.button>
        </form>

        <p className="text-black/50">
          Don't have an account?{" "}
          <Link className="underline text-signUp" to="/register">
            Register Now
          </Link>
        </p>
      </div>
      {err && (
        <div className="text-xl font-bold bg-red-200 p-2 text-red-600 rounded-xl duration-150 transition-all ease-in-out">
          Something went wrong, Try Again!
        </div>
      )}
      {wait && <Loader />}
    </div>
  );
};

export default Login;
