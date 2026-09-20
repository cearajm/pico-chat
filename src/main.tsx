import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Puppy from './Puppy.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Puppy />
  </StrictMode>,
)
