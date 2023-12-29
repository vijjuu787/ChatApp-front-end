import { Box, Typography } from '@mui/material'
import React from 'react'
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import { TalkState } from '../../Context/ChatProvider';

const SearchBadgeItem = ({user,handleSelectedUser}) => {

  const {chatSelected}=TalkState();

  return (
    <Box component={'span'}  sx={{padding:'8px 10px',display:'flex',margin:'6px 5px',fontFamily:"'PT Mono', monospace",borderRadius:'15px'}} bgcolor={'#FF6969'}>
      <Typography component={'span'} sx={{marginRight:'5px',color:'white'}}>
         {user?.name}  
      </Typography>
      <DoDisturbOnOutlinedIcon onClick={handleSelectedUser} sx={{color:'white',cursor:'pointer'}}/>
    </Box>
  )
}

export default SearchBadgeItem
