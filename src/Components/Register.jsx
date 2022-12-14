/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState } from "react";
import { motion } from "framer-motion";
import addAvatar from "../img/addAvatar.png";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, storage, db } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Loader from "./Loader";

const Register = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [wait, setWait] = useState(false);
  const [msg, setMsg] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    if (!file || !displayName || !email || !password) {
      setErr(true);
      setMsg("Enter All Details To Proceed!");
      setTimeout(() => {
        setErr(false);
        setMsg("");
      }, 3000);
      return;
    }

    try {
      setWait(true);
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          // console.log(error);
          setErr(true);
          setMsg("Something went wrong, Try again!");
          setTimeout(() => {
            setErr(false);
            setMsg("");
          }, 3000);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
              await updateProfile(response.user, {
                displayName: displayName,
                photoURL: downloadURL,
              });
              await setDoc(doc(db, "users", response.user.uid), {
                displayName: displayName,
                email: email,
                photoURL: downloadURL,
                uid: response.user.uid,
              });
              await setDoc(doc(db, "usersChats", response.user.uid), {});
              setWait(false);
              navigate("/");
            })
            .catch((err) => {
              setErr(true);
              setMsg("Something went wrong, Try again!");
              setTimeout(() => {
                setErr(false);
                setMsg("");
              }, 3000);
            });
        }
      );
    } catch (error) {
      // console.log(error);
      setErr(true);
      setMsg("Something went wrong, Try again!");
      setTimeout(() => {
        setErr(false);
        setMsg("");
      }, 3000);
    }
  };
  return (
    <>
      <div className="w-full h-full bg-signUp flex flex-col gap-4 items-center justify-center">
        <div className="w-[80%] h-[400px] md:w-[50%] md:h-[400px] lg:w-[35%] lg:h-[400px] bg-gray-100 rounded-xl drop-shadow-2xl flex items-center justify-center flex-col gap-2">
          <div className="flex items-center justify-center flex-col gap-2">
            <span className="font-bold text-3xl md:text-[2rem] text-signUp">
              WhatsApp
            </span>
            <span className="text-lg text-signUp">Register</span>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex items-center flex-col gap-3 w-full p-4"
          >
            <input
              required
              minLength={3}
              maxLength={8}
              type="text"
              placeholder="Display name"
              className="bg-transparent border-b-2  border-signUp focus:outline-none w-[95%] py-1"
            />
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
            <label className="flex items-center gap-1 mr-auto cursor-pointer">
              <img
                className="w-6 h-6 md:w-9 md:h-9 rounded-full"
                src={addAvatar}
                alt="Avatar"
              />
              <span className="text-xs md:text-sm text-signUp">
                Add Profile Picture
              </span>

              <input
                type="file"
                accept="image/*"
                className="hidden focus:outline-none w-full px-2"
              />
            </label>
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 0.95 }}
              className="bg-signUp w-[95%] p-2 rounded-md text-white hover:bg-green-600 hover:drop-shadow-xl"
            >
              Sign Up
            </motion.button>
          </form>

          <p className="text-black/50">
            Already have an account?{" "}
            <Link className="underline text-signUp" to="/login">
              Login
            </Link>
          </p>
        </div>
        {err && (
          <div className="text-xl font-bold bg-red-200 p-2 text-red-600 rounded-xl duration-150 transition-all ease-in-out">
            {msg}
          </div>
        )}
        {wait && <Loader />}
      </div>
    </>
  );
};

export default Register;
