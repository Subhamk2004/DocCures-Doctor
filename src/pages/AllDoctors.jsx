import React, { useState } from 'react'
import useDoctorList from '../hooks/useDoctorList';
import IncomponentLoading from '../components/IncomponentLoading';
import DoctorProfile from '../components/ProfileCard';

function AllDoctors() {

    let [showWarning, setShowWarning] = useState(false)
    let { doctorList, isLoading, error } = useDoctorList();


    return (
        <div className='w-[65%] lg:w-[80%] bg-primary p-4'>
            <div className='w-full h-full bg-softGray rounded-3xl flex flex-col items-center overflow-hidden no-scrollbar'>
                <div className='h-[15%] w-full flex flex-col items-center'>
                    <h1 className='text-2xl lg:text-4xl font-bold mt-10'>
                        {
                            showWarning ?
                                <AlertDisplay alertType='error' alertMessage={error} />
                                :
                                null
                        }
                        <span className='text-primary'>All</span> Doctors
                    </h1>
                </div>
                <div className='h-[85%] w-full items-center flex flex-col gap-5 p-4 overflow-scroll no-scrollbar'>
                    {
                        isLoading ?
                            <IncomponentLoading />
                            :
                            null
                    }
                    <DoctorProfile
                        list={doctorList}
                        type={'doctors'}
                    />
                </div>
            </div>
        </div>
    )
}

export default AllDoctors