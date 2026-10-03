import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import '@/src/index.css'
import Puppy from '@/src/Puppy.tsx'
import Profile from '@/src/Profile.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Puppy />,
  },
  {
    path: "profile",
    element: <Profile />,
  }
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
