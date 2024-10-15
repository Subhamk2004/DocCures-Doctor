import React from 'react';
import { useSelector } from 'react-redux';
import { Book, TimerReset } from 'lucide-react';
import RandomColorGenerator from '../utils/RandomColorGenerator.mjs';

const UpcomingAppointmentList = ({ page = 'bookings' }) => {
    const appointments = useSelector((state) => state.appointments);
    let color = RandomColorGenerator();
    console.log(appointments, 'inside the listing');
    let upcomingAppointments = appointments.filter((booking) => {
        let appointmentDate = new Date(booking.date).getTime();
        let currentTime = new Date().getTime();
        return appointmentDate > currentTime;
    });
    if (page === 'profile') {
        upcomingAppointments = upcomingAppointments.filter((booking, index) => {
            if (index < 2) {
                return booking;
            }
        });
    }

    return (
        <div className=' flex flex-row gap-6 mt-6 xl:w-1/2 h-full'>
            <div className='p-3 w-full flex flex-col items-center bg-secondary py-6 rounded-xl shadow-md shadow-darkGray gap-3 overflow-scroll no-scrollbar'>
                <h3 className='text-xl font-semibold text-textp flex flex-row items-center gap-2 mb-6'>
                    <Book className='w-[22px] h-[22px]' />
                    Upcoming Appointments
                </h3>
                {
                    upcomingAppointments.map((booking, index) => {

                        return (
                            <div className='w-full p-3 bg-white rounded-xl shadow-lg shadow-darkGray flex flex-col items-center'>
                                <div className='w-full flex flex-row items-start justify-between'>

                                    <div className='flex flex-row text-textp'>
                                        <img src={booking.doctorImage}
                                            className='w-20 rounded-full'
                                        />
                                        <div className='flex flex-col justify-center'>
                                            <p className='text-lg font-semibold text-black flex flex-row items-center justify-between'>Dr. {booking.doctorName}
                                            </p>
                                            <p>{booking.doctorSpecialisation}</p>
                                        </div>
                                    </div>
                                    <TimerReset className='w-[22px] h-[22px]' />
                                </div>
                                <hr className='w-[85%] border-none h-[2px] bg-secondary my-5' />
                                <div className='w-full flex flex-row items-start justify-between'>
                                    <div className='flex flex-row gap-3 text-textp'>
                                        <div className='ml-2 w-[70px] h-[70px] flex flex-col rounded-full overflow-hidden items-center justify-center'>

                                            {
                                                booking.patientImage === "null" ?
                                                    <div className="w-full h-[150px] bg-white flex justify-center items-center relative">
                                                        <div
                                                            className=' opacity-45'
                                                            style={{
                                                                backgroundColor: `#${color}`,
                                                                width: '150px',
                                                                height: '150px',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                        </div>
                                                        <p className='absolute text-2xl font-semibold text-black'>
                                                            {booking.patientName[0].toUpperCase()}
                                                        </p>
                                                    </div>
                                                    :
                                                    (
                                                        <img
                                                            src={booking.patientImage}
                                                            alt={`Dr. ${booking.patientName}`}
                                                            className="w-[100%] h-52 object-cover object-top rounded-2xl"
                                                        />
                                                    )
                                            }

                                        </div>
                                        <div className='flex flex-col justify-center'>
                                            <p className='text-lg font-semibold text-black flex flex-row items-center justify-between'> {booking.patientName}
                                            </p>
                                            <p>{booking.patientPhone}</p>
                                        </div>
                                    </div>
                                </div>
                                <hr className='w-[85%] border-none h-[2px] bg-secondary my-5' />
                                <p className='text-lg w-full flex flex-row justify-between font-semibold text-textp items-center mt-1 px-4'>
                                    {new Date(booking.date).toLocaleDateString()}
                                    <span>{booking.time}</span>
                                </p>

                                {
                                    booking.isPaid ?
                                        <p className='w-full px-4 text-lg font-semibold text-[#19a319]'>Appointment Fee Paid</p>
                                        :
                                        <p className='w-full px-4 text-lg font-semibold text-[#c92626]'>Fees Pending</p>

                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default UpcomingAppointmentList;