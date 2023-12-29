import React, { useEffect } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom'
import { TalkState } from '../Context/ChatProvider';
import { Box, Button } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

const Profile = () => {

  const navigate=useNavigate();

  useEffect(()=>{
    const userInfo=JSON.parse(localStorage.getItem("userInfo"));
    if(userInfo){
        navigate('/profile');
    }
  },[navigate]);

  const {user} =TalkState();

  const handleGoBack=()=>{
    navigate('/chats');
  }

  return (
    <Box sx={{width:'100%',display:'flex',justifyContent:'center'}}>
      <Button variant='contained' sx={{position:'absolute',left:'40px',top:'20px',backgroundColor:'#4F709C'}} onClick={handleGoBack}>
        <ArrowBackRoundedIcon sx={{fontSize:'30px'}}/>
        Go Back
      </Button>
     <Box className='profile_container' >
      <img alt='#' src={user?.pic} style={{width:'100%',height:'70%',objectFit:'contain'}}/>
      <Box sx={{alignSelf:'center',display:'flex'}}>
        <Box className='profile_title'>Name: </Box>
        <Box className='profile_title_value'>{user?.name}</Box>
      </Box>
      <Box sx={{alignSelf:'center',display:'flex'}}>
        <Box className='profile_title'>Email: </Box>
        <Box className='profile_title_value'>{user?.email}</Box>
      </Box>
     </Box>
    </Box>
  )
}

export default Profile
