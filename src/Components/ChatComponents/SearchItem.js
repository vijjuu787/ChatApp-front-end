import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'

const SearchItem = ({res,handleChat}) => {
  return (
    <Box onClick={handleChat} sx={{display:'flex',backgroundColor:"#394867",padding:'15px 15px',borderRadius:'10px',cursor:'pointer',color:'#F0F0F0','&:hover':{
        backgroundColor:'#9BA4B5',color:'#212A3E'
    }}} mb={2} mr={2} mt={3}>
      <Avatar src={res?.pic} />
      <Box ml={2}>
        <Typography fontFamily={'monospace'}><span>Name: </span>{res?.name}</Typography>
        <Typography fontFamily={'monospace'}><span>Email: </span>{res?.email}</Typography>
      </Box>
    </Box>
  )
}

export default SearchItem
