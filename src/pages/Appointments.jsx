import React from 'react'
import useAppointments from '../hooks/useAppointments.mjs';
import Loading from '../components/Loading';
import AlertDisplay from '../components/AlertDisplay';
import UpcomingAppointmentList from '../components/upcomingAppointments';
import PreviousAppointmentList from '../components/PreviousAppointments';
import IncomponentLoading from '../components/IncomponentLoading';


function Appointments() {

    const { isLoading, error } = useAppointments();

    if (isLoading) {
        return <div className='md:w-[65%] lg:w-[80%] md:bg-primary p-4'>
            <div className='w-full h-full bg-softGray rounded-3xl flex flex-col items-center overflow-hidden no-scrollbar'>
                <IncomponentLoading />
            </div>
        </div>
    }

    if (error) {
        return <AlertDisplay />
    }
    return (
        <div className='md:w-[65%] xl:w-[100%]  md:bg-primary p-4'>
            <div className='w-full h-full bg-white md:bg-softGray rounded-3xl flex flex-col items-center overflow-hidden'>
                <h1 className='text-2xl lg:text-4xl font-bold mt-5'>
                    <span className='text-primary'>All</span> Appointments
                </h1>
                <div className='md:w-[95%] flex-col lg:w-[85%] md:p-5 flex xl:flex-row gap-6 overflow-scroll no-scrollbar mb-5 items-center'>
                    <UpcomingAppointmentList />
                    <PreviousAppointmentList />
                </div>
            </div>
        </div>
    )
}

export default Appointments