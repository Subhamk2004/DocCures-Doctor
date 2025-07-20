import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import AlertDisplay from '../components/AlertDisplay';
import stocks from '../assets/images/stocks.webp'
import adminDocPic from '../assets/images/adminDocPic.png'
import guy from '../assets/images/guy.png'
import InfoBox from '../components/InfoBox';
import useDoctorList from '../hooks/useDoctorList';
import useUsers from '../hooks/useUsers.mjs';
import appointmentImg from '../assets/images/booking.png';
import useAppointments from '../hooks/useAppointments.mjs';

function Dashboard() {


  const { isAuthenticated, fees } = useSelector(state => state.doctor);
  const appointments = useSelector((state) => state.appointments);
  const navigate = useNavigate();
  const [alertShown, setAlertShown] = useState(false);
  const { doctorList, isLoading } = useDoctorList();
  const { users, isLoadingUsers } = useUsers();
  const { isLoading: loadingBookings } = useAppointments();
  let [totalRevenue, setTotalRevenue] = useState(0);
  let [totalAppointments, setTotalAppointments] = useState(0);

  let totalRevenueFn = () => {
    let total = 0;
    appointments.map((appointment) => {
      if(appointment.isPaid) {
        total ++;
        setTotalAppointments(total);
      }
    })
  }

  useEffect(() => {
    totalRevenueFn();
  }, [appointments])

  console.log(totalAppointments);
  

  useEffect(() => {
    if (!isAuthenticated) {
      console.log(isAuthenticated);
      navigate('/');
    } else {
      setAlertShown(true);
      console.log(isAuthenticated);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className=' w-full md:w-[65%] lg:w-[80%] md:bg-primary md:p-4'>
      <div className='w-full h-full bg-softGray rounded-3xl flex flex-col items-center overflow-hidden'>
        <div className='md:h-[20%] p-2'>
          {isAuthenticated && alertShown && (
            <AlertDisplay
              alertType='success'
              alertMessage='Successfully logged in'
              display={true}
            />
          )}
          <h1 className='text-2xl lg:text-4xl font-bold mb-10 md:mb-0'>
            <span className='text-primary'>Doctor</span> Dashboard
          </h1>
        </div>
        <div className='h-full md:h-[80%] w-full md:bg-secondary p-4 px-8 rounded-[60px] shadow-[0_-20px_26px_-1px_rgba(0,0,0,0.1),0_-10px_14px_-11px_rgba(0,0,0,0.1)] flex flex-row flex-wrap gap-4 justify-around pb-10 md:pb-0 rounded-br-none rounded-bl-none'>
          <InfoBox
            title={'Total revenue made'}
            value={totalAppointments*fees}
            image={stocks}
            ImgclassName={'-mr-3 h-24'}
            className={'mt-10'}
          />
          <InfoBox
            title={'Total Appointments Booked'}
            value={appointments.length}
            image={appointmentImg}
            isLoading={loadingBookings}
            ImgclassName={'-mr-3 h-14 md:h-24'}
            className={'mt-10'}
            to={'/appointments'}
          />
         
        </div>
      </div>
    </div>
  )
}

export default Dashboard