import { Box, Button, CircularProgress, Modal, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { TalkState } from '../../Context/ChatProvider';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import SearchItem from './SearchItem';
import SearchBadgeItem from './SearchBadgeItem';
import io from 'socket.io-client';
 
const ENDPOINT="https://zen-talk-backend.onrender.com";
var socket;


const GroupChatModal = ({children}) => {
  const [groupChatName,setGroupChatName]=useState();
  const [selectedUsers,setSelectedUsers]=useState([]);
  const [search,setSearch]=useState();
  const [results,setResults]=useState([]);
  const [loading,setLoading]=useState();

  const {user,chats,setChats,setGroupChatNotify}=TalkState();

  const [openModel,setOpenModel]=useState(false);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () =>{
      setResults([]);
      setSelectedUsers([]);
      setOpenModel(false);
  } 

  useEffect(()=>{
   socket=io(ENDPOINT);
},[])

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

  const handleSubmit=async()=>{
    if(!groupChatName||!selectedUsers){
       return;
    }
    try{

       const config={
          headers:{
             Authorization:`Bearer ${user.token}`,
          },
       };

       const {data}=await axios.post('https://zen-talk-backend.onrender.com/api/chat/group',{
           name:groupChatName,
           users:JSON.stringify(selectedUsers?.map((u)=>u?._id))
       },config);
       socket.emit("groupChat created",selectedUsers);
       setChats([data,...chats]);
       setGroupChatNotify(true);
       setOpenModel(false);
    }catch(err){
       console.log('Message is in GroupChatModal Page: ',err.message);
    }
  }


  const handleGroup=(userToAdd)=>{
       console.log(selectedUsers);
       for(let i=0;i<selectedUsers.length;i++){
          if(selectedUsers[i]._id===userToAdd?._id){
             return;
          }
       }
      
      setSelectedUsers([...selectedUsers,userToAdd]);

  }

  const handleDelete=(userToBeDeleted)=>{
     setSelectedUsers(selectedUsers.filter((u)=>u._id!==userToBeDeleted._id));
  }

  return (
    <>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={openModel}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{display:'flex',alignItems:'center',justifyContent:'center'}}
      >
        <Box sx={{width:'30%',backgroundColor:'#F8E8EE',padding:'15px 20px',borderRadius:'15px',maxHeight:'70vh',overflowY:'scroll'}}>
           <Typography sx={{display:'flex',justifyContent:'center'}} variant='h6'>Create Group</Typography>

           <Box sx={{display:'flex',flexDirection:'column',marginBottom:'15px'}}>
            <TextField placeholder='Enter Chat Name...' label='Chat Name' sx={{marginBottom:'30px',marginTop:'20px',backgroundColor:'#F9F5F6'}} onChange={(e)=>setGroupChatName(e.target.value)}/>
            <TextField placeholder='Add Users' label='Add Users' sx={{backgroundColor:'#F9F5F6'}} onChange={(e)=>handleSearch(e.target.value)}/>
           </Box>
           {/* Selected Users */}
           <Box sx={{width:'100%',display:'flex',flexWrap:'wrap'}}>
           {selectedUsers?.map((u)=>{
               return (<SearchBadgeItem key={u._id} user={u} handleSelectedUser={()=>handleDelete(u)}/>)
            })}
           </Box>

           {/* render search users */}
           {loading ?(<CircularProgress/>):(
              results?.slice(0,4).map((res)=>{
                return (<SearchItem key={res._id} res={res} handleChat={()=>handleGroup(res)}/>)
              })
           )}
           <Button sx={{position:'sticky',bottom:'0',float:'right'}} onClick={handleSubmit} variant='contained'><AddIcon/></Button>
        </Box>
      </Modal>
    </>
  )
}

export default GroupChatModal
