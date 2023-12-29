import React, { useState } from 'react'
// import {useHistory} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import './SignUp.css';
import axios from 'axios';
import {Stack,TextField, InputAdornment, IconButton,Button, Typography,Snackbar} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const SignUp = () => {
  const [name,setName]=useState();
  const [email,setEmail]=useState();
  const [password,setPassword]=useState();
  const [confirmPassword,setConfirmPassword]=useState();
  const [pic,setPic]=useState();
  const [loading,setLoading]=useState(false);
  const [imageMsg,setImageMsg]=useState(false);
  const [open,setOpen]=useState(1);
  //1->success 2->Unfilled 3->password does not match
//   const history=useHistory();
  const navigate=useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const postDetail=async(pics)=>{
      setLoading(true);
      if(pics===undefined){
         setLoading(false);
         return;
      }

      if(pics.type==="image/jpeg"||pics.type==="image/png"){
         //  console.log(pics);
          const data=new FormData();
          data.append("file",pics);
          data.append("upload_preset","zen-talk");
          data.append("cloud_name","dz0fxifsz");
          await fetch("https://api.cloudinary.com/v1_1/dz0fxifsz/image/upload",{
             method:'post',
             body:data,
          }).then((res)=>res.json())
          .then((data)=>{
            if(data.url){
               setPic(data.url);
               console.log(data);
               setLoading(false);
            }else{
               setImageMsg(true);
               setPic();
               setLoading(false);
            }
          })
          .catch((err)=>{
            console.log(err.message);
            setImageMsg(true);
            setPic();
            setLoading(false);
          });
          
      }else{
         setImageMsg(true);
         setPic();
         setLoading(false);
         return;
      }
  }

  const handleSubmit=async()=>{
     if(!name||!email||!password||!confirmPassword){
         setOpen(2);
         return ;
       }
       if(password!==confirmPassword){
         setOpen(3);
         return;
       }

       try{
         const config={
            headers:{
               "Content-type":"application/json",
            },
         };

         const {data}=await axios.post("https://zen-talk-backend.onrender.com/api/users",{name,email,password,pic},config);

         localStorage.setItem("userInfo",JSON.stringify(data));

         setLoading(false);
         // history.push('/chats');
         navigate('/chats');
       }catch(err){
          console.log(err.message);
          setLoading(false);
       }
  }


  const handleClose=()=>{
     setOpen(1);
  }

  const handleCloseImage=()=>{
   setImageMsg(false)
  }


  return (
    <Stack spacing={3} color='black' mt={4} className='signUp_container'>
           <TextField type={'text'} placeholder='Enter Name...' label={<Typography fontWeight={500} className={"label"}>Name</Typography>} onChange={(e)=>setName(e.target.value)} />

           <TextField type={'email'} placeholder='Enter Email...' label={<Typography fontWeight={500} className={"label"}>Email</Typography>} onChange={(e)=>setEmail(e.target.value)}/>

           <TextField type={showPassword ? 'text' : 'password'} placeholder='Enter Password...' label={<Typography fontWeight={500} className={"label"}>Password</Typography>} onChange={(e)=>setPassword(e.target.value)} InputProps={{
              endAdornment: <InputAdornment  position='end'>
                 <IconButton onClick={handleClickShowPassword}>
                    {showPassword?<VisibilityOff/>:<Visibility/>}
                 </IconButton>
              </InputAdornment>
           }}/>

           <TextField type={showPassword ? 'text' : 'password'} placeholder='Confirm Password...' label={<Typography fontWeight={500}  className={"label"}>Confirm Password</Typography>} onChange={(e)=>setConfirmPassword(e.target.value)} InputProps={{
              endAdornment: <InputAdornment  position='end'>
                 <IconButton onClick={handleClickShowPassword}>
                    {showPassword?<VisibilityOff/>:<Visibility/>}
                 </IconButton>
              </InputAdornment>
           }}/>

           <TextField type={'file'} inputProps={{accept:'image/*'}} onChange={(e)=>postDetail(e.target.files[0])}/>

        <Button variant='contained' disabled={loading} onClick={handleSubmit} >
            SignUp
        </Button>
        <Snackbar onClose={handleCloseImage} open={imageMsg} message={"Upload the image again"} autoHideDuration={2000} ContentProps={{sx:{background: "coral"}}}/>
        <Snackbar onClose={handleClose} open={open===2} message={"Fill all the required fields"} autoHideDuration={2000} ContentProps={{sx:{background: "coral"}}}/>
        <Snackbar onClose={handleClose} open={open===3} message={"Password and confirm password does not match"} autoHideDuration={2000} ContentProps={{sx:{background: "#D8000C"}}}/>
        
    </Stack>
  )
}

export default SignUp
