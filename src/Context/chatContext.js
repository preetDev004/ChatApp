import { createContext , useContext, useReducer } from "react";
import { authContext } from "./authContext";

export const chatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { currentUser } =useContext(authContext)
    const INITIAL_STATE = {
        chatId:"null",
        user:{}
    }
    const chatReducer = (state , action)=>{
        switch (action.type) {
            case "CHANGE_USER":
                return{
                    user:action.payload,
                    chatId:currentUser.uid > action.payload.uid ? currentUser.uid+action.payload.uid : action.payload.uid+ currentUser.uid
                }
            case "LOGOUT_USER":
                return{
                    user:action.payload,
                    chatId:"null"
                }
        
            default:
                return state
        }
    }
    const [state , dispatch] = useReducer(chatReducer,INITIAL_STATE)
  return (
    <chatContext.Provider value={{data:state , dispatch }}>
      {children}
    </chatContext.Provider>
  );
};
