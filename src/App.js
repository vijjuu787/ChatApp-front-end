import React, { useEffect } from 'react'
import './App.css'
import {Navigate, Route, Routes} from 'react-router-dom';
import Home from './Pages/Home';
import Chat from './Pages/Chat';
import Profile from './Pages/Profile';


const App = () => {
  return (
    <div className='app'>
      <Routes>
      <Route path="/" element={<Home/>} exact/>
      <Route path="/chats" element={<Chat/>}/>
      <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </div>
  )
}

export default App
