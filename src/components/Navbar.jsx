import React, { useState } from 'react'
import logo from '../assets/images/logo.png'
import logoFull from '../assets/images/logofull.png'
import create from '../assets/images/create.png'
import login from '../assets/images/login.png'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import home from '../assets/images/home.png'
import homeBlack from '../assets/images/homeBlack.png'
import group from '../assets/images/group.png'
import groupBlack from '../assets/images/groupBlack.png'
import calendar from '../assets/images/calendar.png'
import calendarBlack from '../assets/images/calendarBlack.png'
import add from '../assets/images/add.png'
import addBlack from '../assets/images/addBlack.png'
import logoutIcon from '../assets/images/logout.png'
import useAuth from '../hooks/useAuth'
import Loading from './Loading.jsx'
import emergency from '../assets/images/emergency.png'
import emergencyBlack from '../assets/images/emergencyBlack.png'
import { logoutDoctor, clearAppointments } from '../redux/DoctorSlice.mjs'
import IncomponentLoading from './IncomponentLoading.jsx'
import { useNavigate } from 'react-router-dom'


function Navbar() {
  let { isAuthenticated } = useSelector(state => state.doctor);
  let { isLoading } = useAuth();
  let [loading, setLoading] = useState(false);
  const server_url = import.meta.env.VITE_DOCCURES_SERVER_URL;
  let dispatch = useDispatch();
  let navigate = useNavigate();


  let activeLink = 'text-primary font-bold w-full flex flex-row gap-3 items-center text-[19px] lg:text-[22px] cursor-pointer bg-white px-4 py-3 shadow-md shadow-darkGray rounded-2xl hover:text-primary  transition-all  hover:shadow-[#9f9fe9]'

  let inactiveLink = 'text-textp flex flex-row  items-center text-[19px] lg:text-[21px] gap-3 w-full px-4 py-3 rounded-2xl font-semibold cursor-pointer hover:text-black hover:bg-white hover:rounded-2xl hover:px-2 hover:text-[20px] transition-all  hover:shadow-[#9f9fe9] hover:shadow-md'

  const logout = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${server_url}/logout/doctor`, {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        dispatch(clearAppointments());
        dispatch(logoutDoctor());
        navigate('/')
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
    finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className=' w-[35%] lg:max-w-[400px] h-screen flex flex-col items-center '>
      <nav className=' h-screen flex flex-col items-start w-full  bg-primary gap-16 py-4 '>
        <NavLink to='/dashboard' className='flex flex-row items-center'>
          <img src={logo}
            className='lg:h-full md:w-[35%]'
          />
          <div className='flex flex-col justify-start'>
            <h1 className='font-bold md:text-[24px] lg:text-[28px] text-white '>
              DocCures
            </h1>
            <p className='-mt-1 text-xs text-white py-1 border border-darkGray rounded-3xl text-center'>Doctor</p>
          </div>
        </NavLink>
        <ul className='flex flex-col items-start lg:gap-7 gap-4 px-4 font-semibold text-textp text-[18px] w-[93%] bg-softGray mx-4 p-4 rounded-2xl'>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => isActive ? activeLink : inactiveLink}
          >
            {({ isActive }) => (
              <>
                <img src={isActive ? home : homeBlack} className='w-[23px] lg:w-[25px]' alt="Home" />
                Dashboard
              </>
            )}
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? activeLink : inactiveLink
            }>
            {({ isActive }) => (
              <>
                <img src={isActive ? group : groupBlack} className='w-[23px] lg:w-[25px]' alt="Home" />
                Profile
              </>
            )}
          </NavLink>
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              isActive ? activeLink : inactiveLink
            }>
            {({ isActive }) => (
              <>
                <img src={isActive ? calendar : calendarBlack} className='w-[23px] lg:w-[25px]' alt="Home" />
                Appointments
              </>
            )}
          </NavLink>
          <NavLink
            to="/emergency"
            className={({ isActive }) =>
              isActive ? activeLink : inactiveLink
            }>
            {({ isActive }) => (
              <>
                <img src={isActive ? emergency : emergencyBlack} className='w-[23px] lg:w-[25px]' alt="Home" />
                Emergency
              </>
            )}
          </NavLink>
        </ul>
        {
          !isAuthenticated ?
            <div className='flex flex-row items-center gap-2 lg:gap-3'>
              <NavLink to='/signup' className="p-2 bg-primary rounded-2xl px-2 lg:px-4 text-white font-semibold  flex flex-row gap-2 items-center hover:bg-[#28479c]">
                Sign up
                <img src={create} className='md:h-[25px] lg:w-[30px] lg:h-[30px]' />
              </NavLink>
              <NavLink to='/login' className="p-2 bg-primary rounded-2xl px-2 lg:px-4 text-white font-semibold  flex flex-row gap-2 items-center hover:bg-[#28479c]">
                Login
                <img src={login} className='md:h-[25px] lg:w-[30px] lg:h-[30px]' />
              </NavLink>
            </div>
            :
            <div className='h-full w-full flex justify-center items-end '>
              <button className="bg-white rounded-2xl text-black font-semibold w-full justify-center text-xl ml-3 overflow-hidden group hover:shadow-md hover:shadow-[#404b7c]" onClick={logout}>
                <div
                  className='p-3 w-full flex flex-row rounded-2xl text-2xl font-semibold text-textp bg-[#ffdcdc] hover:bg-[#ffd4d4] hover:shadow-md hover:shadow-[#5c6e9e]'
                  type='submit'
                  disabled={loading}
                >

                  {loading ?
                    <div className='w-full h-full bg-primary flex flex-row items-center justify-center'>
                      <IncomponentLoading isShort={true} />
                    </div> :
                    <div className='flex flex-row items-center justify-center w-full gap-2 h-full'>
                      Logout
                      <img
                        src={logoutIcon}
                        className='w-[22px] transition-transform duration-300 group-hover:translate-x-2'
                        alt="Logout"
                      />
                    </div>
                  }
                </div>
              </button>
            </div>
        }
      </nav>
    </div>
  )
}

export default Navbar