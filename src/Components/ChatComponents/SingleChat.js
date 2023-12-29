import React, { useEffect, useState } from 'react'
import './SingleChat.css';
import { TalkState } from '../../Context/ChatProvider';
import { Avatar, Box, CircularProgress, InputAdornment, TextField, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { getSenderName, getSenderPic } from '../../config/ChatLogics';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from 'axios';
import ScrollableMessages from './ScrollableMessages';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from "../../animations/typing.json";

const ENDPOINT="https://zen-talk-backend.onrender.com";
var socket,selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => {

  const [messages,setMessages]=useState([]);
  const [newMessage,setNewMessage]=useState("");
  const [loading,setLoading]=useState(false);
  const [msgloading,setMsgLoading]=useState(false);
  const [socketConnected,setSocketConnected]=useState();
  const [typing,setTyping]=useState(false);
  const [isTyping,setIsTyping]=useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const {user, chatSelected,setChatSelected,notification,setNotification}=TalkState();

  const fetchMessages=async()=>{
     if(!chatSelected)return;

     try{
        const config={
          headers:{
          Authorization:`Bearer ${user.token}`,
          },
        };
        setLoading(true);

        // console.log(messages);

        const {data}=await axios.get(`https://zen-talk-backend.onrender.com/api/message/${chatSelected._id}`,config);
        setMessages(data);
        setLoading(false);

        socket.emit("join chat",chatSelected._id);
     }catch(err){
        console.log(err.message);
        setLoading(false);
     }
  }

  useEffect(()=>{
    socket=io(ENDPOINT);
    socket.emit("setup",user);
    socket.on("connected",()=>setSocketConnected(true));
    socket.on("typing",()=>setIsTyping(true));
    socket.on("stop typing",()=>setIsTyping(false));
 },[])


  useEffect(()=>{
    fetchMessages();
    selectedChatCompare=chatSelected;
  },[chatSelected]);

  // console.log(notification,"----------------------");
//   console.log(window.location);
  useEffect(()=>{
     socket.on("message recieved",(msgReceived)=>{
        if(!selectedChatCompare||selectedChatCompare._id!==msgReceived.chat._id){
           //give notification
           let notificPresent=false;
           for(let i=0;i<notification.length;i++){
               if(notification[i]===msgReceived){
                  notificPresent=true;
                  break;
               }
           }

           if(notificPresent)return;
           setNotification([msgReceived,...notification]);
           setFetchAgain(!fetchAgain);
        }else{
           setMessages([...messages,msgReceived]);
        }
     })

     //sending notif to all other users when a chat is created
     socket.on("groupChat created",()=>setFetchAgain(!fetchAgain));

     //sending notif to user who is deleted
     socket.on("you are removed",()=>{
      setFetchAgain(!fetchAgain);
      setChatSelected("");
   });
  });

  const sendMessage=async(e)=>{
      if(e.key!=='Enter'){
        return;
      }

      if(!newMessage){
        return;
      }

      setMsgLoading(true);
      socket.emit("stop typing",chatSelected._id);
      try{
         const config={
            headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${user.token}`,
            },
         };
         
         setNewMessage("");
         const {data}=await axios.post('https://zen-talk-backend.onrender.com/api/message',{
             content:newMessage,
             chatId:chatSelected._id
         },config);

        //  console.log(data);

         socket.emit('new message',data); 

         setMessages([...messages,data]);
         setMsgLoading(false);
      }catch(err){
         console.log(err.message);
         setMsgLoading(false);
      }
  }

  const typingHandler=(e)=>{
      setNewMessage(e.target.value);

      if(!socketConnected)return;

      if(!typing){
         setTyping(true);
         socket.emit("typing",chatSelected._id);
      }

      let lastTimeTyping=new Date().getTime();
      var timer=3000;
      setTimeout(()=>{
         var currTime=new Date().getTime();
         var timeElapsed=currTime-lastTimeTyping;
         if(timeElapsed>=timer&&typing){
            socket.emit("stop typing",chatSelected._id);
            setTyping(false);
         }
      },timer)
  }

  return (
    <>
      {chatSelected?
      <>
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',backgroundColor:'#4C4C6D',overflow:'hidden',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',height:'10%'}}> 
            <ArrowBackIosIcon onClick={()=>setChatSelected("")} sx={{cursor:'pointer',display:{xs:'flex',md:'none'},marginLeft:'5%',color:'white'}}/>
            {!chatSelected.isGroupChat?(
                // For Single Chat
                <>
                <Typography sx={{color:'white',fontFamily:"'Noto Sans', sans-serif",marginLeft:'5%',letterSpacing:'2.5px'}} fontWeight={600} fontSize={25}>
                  {getSenderName(user,chatSelected.users)}
                </Typography>
                <Avatar src={getSenderPic(user,chatSelected.users)} sx={{marginRight:'5%',border:'1px solid white'}}/>
                </>
            ):(
               <>
                <Typography sx={{margin:'auto',color:'white',letterSpacing:'2.5px'}} fontWeight={600} fontSize={25}>
                {chatSelected.chatName.toUpperCase()}
                </Typography>
                <Box sx={{marginRight:'2%'}}>
                  <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
                </Box>
               </>
            )}
        </Box>

        <Box sx={{display:'flex',flexDirection:'column',width:'100%',height:'90%',justifyContent:'flex-end'}}>
            {loading?<CircularProgress sx={{alignSelf:'center',margin:'auto'}} size={80} color='success'/>:(
              <Box className='messages'>
                {/* messages */}
                 <ScrollableMessages messages={messages}/>
              </Box>
            )}

            {/* Chat Input */}
            {/* <FormControl sx={{backgroundColor:'#C3ACD0',padding:'2%',color:'#674188'}}  variant='filled'  onKeyDown={sendMessage} id="first-name">
              <Input placeholder='Enter message...' value={newMessage} onChange={typingHandler} />
            </FormControl> */}

            {}
            <TextField variant='standard' placeholder='Enter message...' value={newMessage}  onChange={typingHandler} onKeyDown={sendMessage} sx={{backgroundColor:'#C3ACD0',color:'#674188',padding:'1.5%',borderTop:'2px inset #D4ADFC'}}   InputProps={{startAdornment:<InputAdornment position="start">
              {msgloading?<CircularProgress/>:<></>}
              {isTyping?<div><Lottie options={defaultOptions} width={45} />
            </div>:(<></>)}
            </InputAdornment>
            ,disableUnderline: true}} autoComplete='Off' disabled={msgloading} />

        </Box>
      </>:(
         <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',width:'100%',height:'100%'}}>
            <Typography variant='h3' fontFamily={"'Noto Sans', sans-serif"} fontWeight={600} color={'#FF0060'}>
                Start Chat
            </Typography>
            <Box sx={{marginTop:'5%',display:'flex',width:'20%'}}>
               <LockIcon sx={{marginRight:'2%',color:'#213555'}}/>
               <Typography sx={{color:'#4C4C6D'}}>
                End-to-end encrypted
                </Typography>
            </Box>
         </Box>
      )}
    </>
  )
}

export default SingleChat
