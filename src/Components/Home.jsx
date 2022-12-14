import React from "react";
import Chat from "./Chat";
import Sidebar from "./Sidebar";

const Home = () => {
  return (
    <div className="bg-whatsApp/30 w-full h-full flex items-center justify-center">
      <div className="w-screen h-screen flex overflow-hidden">
        <Sidebar/>
        <Chat/>
        
      </div>
    </div>
  );
};

export default Home;
