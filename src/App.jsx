import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Router from "./Router"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import AllDoctors from "./pages/Emergency"
import AddDoctor from "./pages/AddDoctor"
import Appointments from "./pages/Appointments"
import Emergency from "./pages/Emergency"
import LoadUser from "./pages/LoadUser"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import EditProfile from "./pages/EditUser"

function App() {

  let router = createBrowserRouter([
    {
      path: '/',
      element: <Router />,
      children: [
        {
          path: '',
          element: <Login />
        },
        {
          path: 'dashboard',
          element: <Dashboard />
        },
        {
          path: 'emergency',
          element: <Emergency />
        },
        {
          path: 'editProfile',
          element: <EditProfile />
        },
        {
          path: 'appointments',
          element: <Appointments />
        },
        {
          path: 'profile',
          element: <Profile />
        },
        {
          path: 'viewUser/:id',
          element: <LoadUser />
        },
        {
          path:'signup',
          element: <Signup />
        }
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
