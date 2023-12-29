import React from 'react'
import './ChatContainer.css';
import { TalkState } from '../../Context/ChatProvider'
import {Box} from '@mui/material'
import SingleChat from './SingleChat';

const ChatContainer = ({fetchAgain,setFetchAgain}) => {
  const {chatSelected} = TalkState();
  return (
    <Box className='chat_box' sx={{display:{xs:chatSelected?"flex":"none",md:"flex"},width:{xs:'100%',md:'67%'},marginRight:'1%',flexDirection:'column',alignItems:'center',marginLeft:'1%',borderTopLeftRadius:'10px',borderTopRightRadius:'10px'}} >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatContainer
