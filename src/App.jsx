import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Router from "./Router"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import AllDoctors from "./pages/AllDoctors"
import AddDoctor from "./pages/AddDoctor"
import Appointments from "./pages/Appointments"
import AllUsers from "./pages/AllUsers"
import EditProfile from "./pages/EditUser"
import LoadUser from "./pages/LoadUser"

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
          path: 'alldoctors',
          element: <AllDoctors />
        },
        {
          path: 'addDoc',
          element: <AddDoctor />
        },
        {
          path: 'appointments',
          element: <Appointments />
        },
        {
          path: 'allUsers',
          element: <AllUsers />
        },
        {
          path: 'viewUser/:id',
          element: <LoadUser />
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
