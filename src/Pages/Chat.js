import React, { useEffect, useState } from 'react'
import './Chat.css';
import axios from 'axios'
import { TalkState } from '../Context/ChatProvider'
import { Box } from '@mui/material';
import SearchDrawer from '../Components/ChatComponents/SearchDrawer';
import UsersChat from '../Components/ChatComponents/UsersChat';
import ChatContainer from '../Components/ChatComponents/ChatContainer';
// import {useNavigate} from 'react-router-dom';

const Chat = () => {
  const {user}= TalkState();
  const [fetchAgain,setFetchAgain]=useState(false);

  // const navigate=useNavigate();

  // if(!user){
  //    navigate("/");  
  // }

  return (
    <div className='main_chat_container'>
      {/* LeftSide */}
      {user && <SearchDrawer/>}
      <Box sx={{display:'flex',justifyContent:'space-between',height:'86vh',padding:'10px'}} >
        {user && <UsersChat fetchAgain={fetchAgain}/>}
        {user && <ChatContainer fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default Chat
