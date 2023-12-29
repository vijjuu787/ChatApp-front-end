import { Box, Button, CircularProgress, Modal, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import GroupsIcon from '@mui/icons-material/Groups';
import { TalkState } from '../../Context/ChatProvider';
import SearchBadgeItem from './SearchBadgeItem';
import axios from 'axios';
import SearchItem from './SearchItem';
import io from 'socket.io-client';
 
const ENDPOINT="https://zen-talk-backend.onrender.com";
var socket;


const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {

  const {user,chatSelected,setChatSelected}=TalkState();
  const [groupChatName,setGroupChatName]=useState();
  const [search,setSearch]=useState("");
  const [results,setResults]=useState([]);
  const [loading,setLoading]=useState(false);
  const [groupNameloading,setGroupNameLoading]=useState(false);

  const [openModal,setOpenModal]=useState(false);

  const handleOpen = () =>{
      setOpenModal(true);
  } 

  const handleClose = () => {
      setOpenModal(false);
      setResults([]);
      setGroupChatName("");
  } 

  //deleting users from group
  const handleDelete=async(u)=>{
     if(chatSelected.groupAdmin._id!==user._id){
        return;
     }

     if(user._id===u._id){
        return;
     }

     if(chatSelected.users.length===3){
       return;
     }

     try{
       setLoading(true);
       const config={
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      };

       const {data}=await axios.put('https://zen-talk-backend.onrender.com/api/chat/removeFromGroup',{
        chatId:chatSelected._id,
        userId:u._id,
       },config);

       socket=io(ENDPOINT);


       //sending notif to other users when they are removed
       socket.emit("you are removed",chatSelected);

       u._id===user._id?chatSelected():setChatSelected(data);


       setFetchAgain(!fetchAgain);
       fetchMessages();
       setLoading(false);
     }catch(err){
        console.log(err.message);
        setLoading(false);
     }
  }

  const handleRename=async()=>{
      if(!groupChatName)return;

      try{
         setGroupNameLoading(true);

         const config={
           headers:{
             Authorization:`Bearer ${user.token}`,
           },
         };

         const {data}=await axios.put('https://zen-talk-backend.onrender.com/api/chat/renameGroup',{
            chatId:chatSelected._id,
            chatName:groupChatName,
         },config);

         setChatSelected(data);
         setFetchAgain(!fetchAgain);
         setGroupNameLoading(false);
         setGroupChatName("");
      }catch(err){
        console.log(err.mesaage);
        setGroupNameLoading(false);
         setGroupChatName("");
      }
  }

  const handleSearch=async(query)=>{
      setSearch(query);
      
      if(!query)return;
    
       try{
        setLoading(true);
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`,
              },
        };
         

        const {data}=await axios.get(`https://zen-talk-backend.onrender.com/api/users?search=${search}`,config);

        setLoading(false);
        setResults(data);
      }catch(err){
        console.log(err.message);
        setLoading(false);
      }
  }

  const handleLeave=async(u)=>{
      if(chatSelected.users.length===3){
        return;
      }

      if(chatSelected.groupAdmin._id===user._id){
        //Implement it later 
        return;
      }

      var nextGroupAdmin;

      for(let i=0;i<chatSelected.users.length;i++){
         if(chatSelected.users[i]!==u){
            nextGroupAdmin=chatSelected.users[i];
            break;
         }
      }

      try{
        setLoading(true);
        const config={
         headers:{
           Authorization:`Bearer ${user.token}`,
         },
       };
 
        const {data}=await axios.put('https://zen-talk-backend.onrender.com/api/chat/removeFromGroup',{
         chatId:chatSelected._id,
         userId:u._id,
        },config);

        //adminUpdation feature still to be implemented
 
        setChatSelected();
        setFetchAgain(!fetchAgain);
        setLoading(false);
        // socket.emit("you are removed",chatSelected);
      }catch(err){
         console.log(err.message);
         setLoading(false);
      }
      
  }

  const handleAddUser=async(u)=>{
    if(chatSelected.users.find((us)=>us._id===u._id)){
      return;
    }
    
    if(chatSelected.groupAdmin._id!==user._id){
      // selected user is not admin
      return;
    }
    // console.log("enter 97");

      try{
        setLoading(true);
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`,
              },
        };

        const {data}=await axios.put('https://zen-talk-backend.onrender.com/api/chat/addToGroup',{
            chatId:chatSelected._id,
            userId:u._id,
        },config);

        setChatSelected(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      }catch(err){
        console.log(err.message);
        setLoading(false);
      }
  }

  return (
    <>
      <GroupsIcon sx={{cursor:'pointer',color:'white',fontSize:'40px'}} onClick={handleOpen}/>
      <Modal open={openModal} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" sx={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Box sx={{width:'30%',padding:'2%',backgroundColor:'#FCC8D1',borderRadius:'10px',maxHeight:'70vh',overflowY:'scroll'}}>
          <Typography sx={{textAlign:'center',fontFamily:"'Raleway', sans-serif",marginBottom:'2%',color:'#0A4D68',fontSize:'20px',fontWeight:'600'}}>{chatSelected.chatName}</Typography>

          <Box sx={{width:'100%',display:'flex',flexWrap:'wrap',marginBottom:'2%'}}>
            {
                chatSelected?.users?.map((u)=>(
                    <SearchBadgeItem key={u._id} user={u} handleSelectedUser={()=>handleDelete(u)}/>
                ))
            }
          </Box>
        
          <Box sx={{display:'flex',flexDirection:'column',marginBottom:'3%'}}>
             <Box sx={{display:'flex',marginBottom:'2%'}}>
                <TextField placeholder='New chat name' label='Chat name' sx={{width:'77%',backgroundColor:'#FFF9DE'}} value={groupChatName}  onChange={(e)=>{
                    setGroupChatName(e.target.value)
                }}/>
                <Button sx={{width:'20%',marginLeft:'3%'}} onClick={handleRename} disabled={groupNameloading} variant='contained'>Rename</Button>
             </Box>
             <Box>
                <TextField placeholder='Add user' label='Add user' sx={{width:'100%',backgroundColor:'#FFF9DE'}} onChange={(e)=>handleSearch(e.target.value)}/>
                {loading?<CircularProgress/>:(
                  results?.slice(0,4).map((user)=>(
                      <SearchItem key={user._id} res={user} handleChat={()=>handleAddUser(user)}/>
                  ))
                )}
             </Box>
          </Box>

          <Button sx={{position:'sticky',bottom:'0',float:'left'}} onClick={()=>handleLeave(user)} variant='contained' color='error'>Leave</Button>
          <Button onClick={handleClose}  variant='contained' sx={{position:'sticky',bottom:'0',float:'right'}}>Close</Button>

        </Box>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
