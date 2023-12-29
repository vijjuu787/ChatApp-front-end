import { createContext, useContext, useEffect, useState } from 'react';
// // import {useHistory} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

const ChatContext=createContext();

//Wrapping whole app inside context provider
const TalkProvider=({children})=>{

    const [user,setUser]=useState();
    const [chatSelected,setChatSelected]=useState();
    const [chats,setChats]=useState([]);
    const [notification,setNotification]=useState([]);
    const navigate=useNavigate();

    const [groupChatNotify,setGroupChatNotify]=useState(false);

    // //fetching users info from local storage
    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        // console.log(userInfo);
        if(!userInfo){
            //problem
            navigate("/");
        }
    },[navigate])

    return (
        <ChatContext.Provider value={{user,setUser,chatSelected,setChatSelected,chats,setChats,groupChatNotify,setGroupChatNotify,notification,setNotification}}>
            {children}
        </ChatContext.Provider>
    )
};

export const TalkState=()=>{
    return useContext(ChatContext);
}

export default TalkProvider;

