import React, { useState } from 'react'
import './Login.css';
// import {useHistory} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import {Stack,FormControl,TextField, InputAdornment, IconButton,Button, Typography, Snackbar} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const Login = () => {

    const [name,setName]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [loading,setLoading]=useState(false);
    const [open,setOpen]=useState(1);
   //  const history=useHistory();
   const navigate=useNavigate();
  
    const [showPassword, setShowPassword] = useState(false);

  
    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleSubmit=async()=>{
        if(!email||!password){
          setOpen(2);
          setLoading(false);
          return;
        }

        try{
           const config={
             headers:{
               "Content-type":"application/json",
             },
           };

           const {data}=await axios.post("https://zen-talk-backend.onrender.com/api/users/login",{email,password},config);

           localStorage.setItem("userInfo",JSON.stringify(data));
           setLoading(false);
         //   history.push("/chats");
           navigate("/chats");
        }catch(err){
         console.log(err);
           setLoading(false);
        }
    }  

   const handleClose=()=>{
      setOpen(1);
   } 

  return (
    <Stack spacing={4.7} color='black' mt={4}>
           <TextField type={'email'} placeholder='Enter Email...' label={<Typography fontWeight={500} className={"label"}>Email</Typography>} onChange={(e)=>setEmail(e.target.value)}/>

           <TextField type={showPassword ? 'text' : 'password'} placeholder='Enter Password...' label={<Typography fontWeight={500} className={"label"}>Password</Typography>} onChange={(e)=>setPassword(e.target.value)} InputProps={{
              endAdornment: <InputAdornment  position='end'>
                 <IconButton onClick={handleClickShowPassword}>
                    {showPassword?<VisibilityOff/>:<Visibility/>}
                 </IconButton>
              </InputAdornment>
           }}/>

        <Button variant='contained' onClick={handleSubmit}>
            Login
        </Button>
        <Snackbar onClose={handleClose} open={open===2} message={"Fill all the required fields"} autoHideDuration={2000} ContentProps={{sx:{background: "coral"}}}/>
    </Stack>
  )
}

export default Login
