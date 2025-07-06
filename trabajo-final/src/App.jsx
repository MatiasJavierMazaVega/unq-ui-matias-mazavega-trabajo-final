import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StartDiffSelectionPage from './pages/StartDiffSelectionPage'
//import './App.css'

function App() {
  

  return (
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<StartDiffSelectionPage />} />
  </Routes>
  </BrowserRouter> 
 
  )
}

export default App
