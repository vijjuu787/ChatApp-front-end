import React, { useState } from 'react'
import './SearchDrawer.css';
import { Avatar, Box, Button, CircularProgress, Divider, Drawer, Menu, MenuItem, Paper, TextField, Tooltip, Typography} from '@mui/material';
import {PersonSearchOutlined} from '@mui/icons-material';
import ChatIcon from "@mui/icons-material/Chat";
import CircleNotificationsSharpIcon from '@mui/icons-material/CircleNotificationsSharp';
import { TalkState } from '../../Context/ChatProvider';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import SearchItem from './SearchItem';
import CloseIcon from '@mui/icons-material/Close';
import { getSenderName } from '../../config/ChatLogics';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";


const SearchDrawer = () => {
   const [search,setSearch]=useState();
   const [result,setResult]=useState();
   const [loading,setLoading]=useState();
   const [chatLoading,setChatLoading]=useState();
   const [drawerAnchor,setDrawerAnchor]=useState(false);

   const {user,setChatSelected,chats,setChats,notification,setNotification}=TalkState();
   const navigate=useNavigate();


   const [anchorEl,setAnchorEl]=useState(null);
   const [anchorElnotif,setAnchorElnotif]=useState(null);
   const open=Boolean(anchorEl);
   const openNotif=Boolean(anchorElnotif);

   const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose=()=>{
    setAnchorEl(null);
  }

  const handleCloseProfile = (e) => {
    setAnchorEl(null);
    navigate('/profile');
  };

  const handleCloseLogOut=(e)=>{
    setAnchorEl(null);
    setChatSelected("");
    localStorage.removeItem("userInfo");
    navigate("/");
  }

  const handleDrawerClose=()=>{
    setDrawerAnchor(false);
  }

  const openDrawer=()=>{
     setDrawerAnchor(true);
  }

  const handleSearch=async()=>{
     if(!search){
        return;
     }
     
     try{
        setLoading(true);
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`,
          },
        };

        const {data}=await axios.get(`https://zen-talk-backend.onrender.com/api/users?search=${search}`,config);
        setLoading(false);
        setResult(data);
     }catch(err){
        console.log(err.message);
     }
  }

  const accessChat=async(UserId)=>{
     try{
        setChatLoading(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        
        const {data}=await axios.post('https://zen-talk-backend.onrender.com/api/chat',{UserId},config);
        
        if(!chats.find((c)=>c._id===data._id))setChats([data,...chats]); 

        setChatSelected(data);
        setChatLoading(false);
        setDrawerAnchor(false);
     }catch(err){
        console.log(err.message);
        setChatLoading(false);
     }
  }

  const handleCloseNotif=()=>{
    setAnchorElnotif(null);
  }

  const handleNotifClick=(e)=>{
    setAnchorElnotif(e.currentTarget);
  }

  return (
    <>
      <Box className='searchDrawer_container' sx={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'15px 20px'}}>

      <Tooltip title="Search Users" arrow > 
         <Button variant='contained' onClick={openDrawer}>
           <PersonSearchOutlined/>
           <Typography sx={{display:{xs:'none',sm:'block',md:'block'},paddingLeft:'10px'}}>Search</Typography>
         </Button>
      </Tooltip>

      <Box sx={{display:'flex'}} >
         <ChatIcon sx={{alignSelf:'center',marginRight:'8px',color:'#27374D',fontSize:'35px'}}/>
         <Typography fontSize={30} fontFamily={'cursive'} fontWeight={600} color={'#40128B'}>
           ChatApp         </Typography>
      </Box>

      <Box sx={{display:'flex'}}>
         {/* Notification menu */}
         <Box>
           <Button aria-controls={openNotif ? 'notif-menu' : undefined} aria-haspopup="true" aria-expanded={openNotif ? 'true' : undefined} onClick={handleNotifClick} sx={{display:'flex',flexDirection:'column'}}>
              <NotificationBadge count={notification.length} effect={Effect.SCALE} />
              <CircleNotificationsSharpIcon sx={{fontSize:'35px'}}/>
           </Button>
           <Menu open={openNotif} id="notif-menu" anchorEl={anchorElnotif} onClose={handleCloseNotif}>
               {!notification.length&&(<MenuItem>No New Messages</MenuItem>)}
              {notification.map((notif)=>(
              <MenuItem key={notif._id} onClick={()=>{
                setChatSelected(notif.chat);
                setNotification(notification.filter((n)=>n!==notif));
              }}>
                 {notif.chat.isGroupChat?`New message from ${notif.chat.chatName}`:`New message from ${getSenderName(user,notif.chat.users)}`}
              </MenuItem>
              ))}
          </Menu>  
         </Box>

         {/* Profile Menu */}
         <Box>
           <Button aria-controls={open ? 'profile-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined}  onClick={handleClick}>
              <Avatar src={user.pic}/>
           </Button>
           <Menu open={open} id="profile-menu" anchorEl={anchorEl} 
             onClose={handleClose} PaperProps={{
                sx:{backgroundColor:'#ACBCFF',marginTop:'10px'}
             }}>
               <MenuItem sx={{color:'#2B3467',fontWeight:'600'}} onClick={handleCloseProfile}> <AccountBoxIcon sx={{marginRight:'10px'}}/> Profile</MenuItem>

               <Divider/>

               <MenuItem sx={{color:'#FF0060',fontWeight:'600'}} onClick={handleCloseLogOut}> <LogoutIcon sx={{marginRight:'10px'}}/> Logout</MenuItem>
           </Menu>  
         </Box>
      </Box>
      
    </Box>

    <Drawer anchor='top' open={drawerAnchor} onClose={handleDrawerClose}>
       <Box sx={{minHeight:'30vh',padding:'30px 30px',backgroundColor:'#AFD3E2'}}>
        
        <Button variant='contained' sx={{position:'absolute',right:'3%',height:'50px',width:'50px',borderRadius:'50%',backgroundColor:'#FF6969','&:hover':{
          backgroundColor:'#FF6969'
        }}} onClick={()=>setDrawerAnchor(false)}>  
          <CloseIcon sx={{transition: 'transform .25s','&:hover':{
            transform:'rotate(45deg)'
          }}}/>
        </Button>

        <Typography sx={{marginBottom:'20px',color:'#212A3E'}} fontSize={30} fontWeight={600}>Search Users</Typography>
        <Box sx={{display:'flex'}}>
        <TextField type='text' placeholder='enter users name...' label={<Typography fontWeight={500} >Name</Typography>} onChange={(e)=>setSearch(e.target.value)} sx={{width:'40%'}}/>
        <Button sx={{marginLeft:'20px',backgroundColor:'#9384D1'}} variant='contained' onClick={handleSearch}>search</Button>
        </Box>

        <Box sx={{marginTop:'30px'}}>
        {loading?(<ChatLoading/>):(
          result?.map((res)=>{
             return (<SearchItem key={res._id} res={res} handleChat={()=>accessChat(res._id)}/>)
          })
        )}
        {chatLoading&& <CircularProgress color='success' sx={{marginLeft:'45vw',width:'100%'}}/>}
        </Box>
       </Box>
    </Drawer>
    </>
  )
}

export default SearchDrawer
