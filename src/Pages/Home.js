import React, { useEffect, useState } from "react";
// import {useHistory} from 'react-router-dom';
import "./Home.css";

import { Container, Box, Typography,Tabs,Tab } from "@mui/material";

import ChatIcon from "@mui/icons-material/Chat";
import SignUp from "../Components/Auth/SignUp";
import Login from "../Components/Auth/Login";
import { useNavigate } from "react-router-dom";

const Home = () => {

   const navigate=useNavigate();

   useEffect(()=>{
     const userInfo=JSON.parse(localStorage.getItem("userInfo"));

     if(userInfo){
        // history.push("/chats");
        navigate("/chats");
     }
   },[navigate]);

   const [currTabIndex,setCurrTabIndex]=useState(0);

   const handleTabChange =(e,tabIndex)=>{
     setCurrTabIndex(tabIndex);
   }

  return (
    <Container
      maxWidth="xl"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
        className="title_box"
        sx={{ width: "53.5%", textAlign: "center" }}
        mt={5}
        p={1}
        bgcolor={"#4C4C6D"}
      >
        <ChatIcon
          sx={{ alignSelf: "center", fontSize: "2.3rem", color: "white" }}
        />
        <Typography className="title" fontSize={30} ml={2}>
          Chat
        </Typography>
      </Box>

      <Box className={"auth_box"} sx={{width:'50%'}} mt={4} p={4}>
        <Tabs centered value={currTabIndex} onChange={handleTabChange} variant="standard" textColor="primary" indicatorColor="secondary">
          <Tab className="tab" label={<Typography fontWeight={550} className={currTabIndex===0?"tab_label_On":"tab_label"}>SignUp</Typography>} sx={{marginRight:'0.5rem',backgroundColor:'#A0C3D2'}}/>
          <Tab className="tab" label={<Typography fontWeight={550} className={currTabIndex===1?"tab_label_On":"tab_label"}>Login</Typography>} sx={{marginLeft:'0.5rem',backgroundColor:'#A0C3D2'}}/>
        </Tabs>


        {/* SignUp Tab */}
        {currTabIndex===0 && (
          <div>
            <SignUp/>
          </div>
        )}

        {/* Login Tab */}
        {currTabIndex===1 && (
          <div>
            <Login/>
          </div>
        )}

      </Box>
    </Container>
  );
};

export default Home;
