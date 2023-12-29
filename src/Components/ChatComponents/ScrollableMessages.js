import React from 'react'
import ScrollableFeed from 'react-scrollable-feed';
import {Avatar, Box, Tooltip} from '@mui/material'
import { TalkState } from '../../Context/ChatProvider';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser, isSenderLoggedInUser } from '../../config/ChatLogics';

const ScrollableMessages = ({messages}) => {

  const {user}= TalkState();

  return (
    <ScrollableFeed>
      {
        messages && messages.map((m,i)=>(
            <Box sx={{display:'flex'}} key={m._id}>
                {
                   (isSameSender(messages,m,i,user._id)||isLastMessage(messages,i,user._id))
                   && (
                    <Tooltip title={m.sender.name} placement='bottom-start'>
                      <Avatar src={m.sender.pic} sx={{cursor:'pointer',marginTop:isSameUser(messages,m,i,user._id)?'1%':'3%',marginLeft:'1%',marginRight:'0.5%',alignSelf:'center'}} />
                    </Tooltip>
                   )
                }
                <Box style={{
                    backgroundColor:`${
                        m.sender._id===user._id?'#00DFA2':'#9BABB8'
                    }`,
                    borderRadius:'25px',
                    maxWidth:'75%',
                    padding:'8px',
                    marginLeft:isSameSenderMargin(messages,m,i,user._id),
                    marginTop:isSameUser(messages,m,i,user._id)?'1%':'3%',
                    marginRight:isSenderLoggedInUser(m,user._id)?'1.5%':'0',
                }}>
                  <Box sx={{width:'100%',fontFamily:"'Roboto Slab', serif",marginTop:'0.7%',marginLeft:'0.6%',letterSpacing:'0.7px',color:'#27374D'}} fontWeight={600} fontSize={15}>
                   {m.sender.name}
                  </Box>
                   <span style={{color:'#393646',fontFamily:"'Roboto Slab', serif",fontSize:'0.85rem'}}>
                    {m.content}
                   </span>
                </Box>
            </Box>
        ))
      }
    </ScrollableFeed>
  )
}

export default ScrollableMessages
