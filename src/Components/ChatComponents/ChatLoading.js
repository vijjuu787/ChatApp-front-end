import { Skeleton, Stack } from '@mui/material'
import React from 'react'

const ChatLoading = () => {
  return (
    <Stack spacing={2}>
      <Skeleton height={40} animation='wave'/>
      <Skeleton height={40} animation='wave'/>
      <Skeleton height={40} animation='wave'/>
      <Skeleton height={40} animation='wave'/>
      <Skeleton height={40} animation='wave'/>
      <Skeleton height={40} animation='wave'/>
      <Skeleton height={40} animation='wave'/>
    </Stack>
  )
}

export default ChatLoading
