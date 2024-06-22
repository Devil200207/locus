import { useState } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from './Componets/Login/Login'
import SignupPage from './Componets/Signup/SignupPage'
import FileUploadComponent from './Componets/upload/Upload';


function App() {
  const [count, setCount] = useState(0)

  return (
    
     <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/upload" element={<FileUploadComponent />} />
      </Routes>
    </Router>

  )
}

export default App
