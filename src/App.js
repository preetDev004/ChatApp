import "./App.css";
import { Home, Login, Register } from "./Components";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "./Context/authContext";

function App() {
  const { currentUser } = useContext(authContext)
  const ProtectedRoute =({children})=>{
    if (!currentUser) {
      return <Navigate to='/login'/>
    }
    else{
      return children
    }
  }
  return (
    <>
      <AnimatePresence>
        <Router>
        <div className="w-screen h-screen">
          <Routes>
            <Route path="/" exact='/' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
            <Route path="/login" exact='/login' element={<Login/>}/>
            <Route path="/register" exact='/register' element={<Register/>}/>
          </Routes>
          {/* <Register /> */}
          {/* <Login/> */}
        </div>
        </Router>
      </AnimatePresence>
    </>
  );
}

export default App;
