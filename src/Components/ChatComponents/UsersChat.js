import React, { useEffect, useState } from 'react'
import './UsersChat.css';
import { TalkState } from '../../Context/ChatProvider'
import axios from 'axios';
import { Box, Button, CircularProgress, Stack, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatLoading from './ChatLoading';
import { getSenderName} from '../../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

const UsersChat = ({fetchAgain}) => {

   const [loggedUser,setLoggedUser]=useState();
  const {user,chatSelected,setChatSelected,chats,setChats,groupChatNotify,setGroupChatNotify}=TalkState();


  const fetchChats=async()=>{
     try{
      const config = {
         headers: {
           Authorization: `Bearer ${user.token}`,
         },
       };

        const {data}=await axios.get('https://zen-talk-backend.onrender.com/api/chat',config);
        setChats(data);
        if(groupChatNotify===true){
           setGroupChatNotify(false);
        }
        console.log("fetchChats");
     }catch(err){
        console.log(err.message);
     }
  }

  useEffect(()=>{
     setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
     fetchChats();
  },[fetchAgain,groupChatNotify===true]);
 
  return (
    <Box className="my_chat_container" sx={{display:{xs:chatSelected?"none":"flex",md:"flex"},flexDirection:"column",alignItems:'center',width:{xs:'100%',md:'30%'}}} >
      <Box sx={{display:'flex',width:'96%',justifyContent:'right',position:'sticky',top:'3.5%',zIndex:'100',paddingBottom:'3%',boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',padding:'2% 2%',backgroundColor:'rgba(255,255,255,0.7)',backgroundBlendMode:'lighten'}}>
          <Typography sx={{fontSize:'25px',fontFamily:'monospace',fontWeight:'600',color:'#374259',marginRight:{xs:"30%",md:"13%"}}}>Chats</Typography>
       
          {/* Group Chat Button */}
         <GroupChatModal>
            <Tooltip arrow title='Start a new group chat'>
              <Button sx={{paddingLeft:'4px',backgroundColor:'#2B3467'}} variant='contained'><AddIcon sx={{marginRight:'5px'}}/>
              Group Chat
              </Button>
            </Tooltip>
         </GroupChatModal>
      </Box>

      {/* Render All Chats */}
      <Box sx={{display:'flex',flexDirection:'column',overflowY:'scroll',width:'92%',paddingLeft:'4%',paddingRight:'4%',paddingBottom:'2%',paddingTop:'4%'}}>
         {chats?(
            <Stack spacing={3}>
               {chats?.map((chat)=>(
                    <Box onClick={()=>setChatSelected(chat)} sx={{cursor:'pointer',padding:'8px 10px',borderRadius:'10px'}} bgcolor={chatSelected===chat?'#FFC7C7':'#8785A2'} key={chat._id}>
                        <Typography fontFamily={"'Raleway', sans-serif"} sx={{fontWeight:'600'}} color={chatSelected===chat?'black':'white'} key={chat._id}>
                        {chat.isGroupChat===false?getSenderName(loggedUser, chat.users):chat.chatName}
                        </Typography>
                    </Box>
               ))}
            </Stack>
         ):(
           <ChatLoading/>
         )}
      </Box>
    </Box>
  )
}

export default UsersChat
