import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, LogOut, Trash } from 'lucide-react';
import RandomColorGenerator from '../utils/RandomColorGenerator.mjs';
import ConfirmAlert from '../components/ConfirmAlert';
import { logoutDoctor } from "../redux/DoctorSlice.mjs";
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';
import ProfilePreview from '../components/ProfilePreview';
import AlertDisplay from '../components/AlertDisplay';
import UpcomingAppointmentList from '../components/upcomingAppointments';
import PreviousAppointmentList from '../components/PreviousAppointments';
import useAppointments from '../hooks/useAppointments.mjs';
import IncomponentLoading from '../components/IncomponentLoading';
import { clearAppointments } from '../redux/AppointmentSlice.mjs';


function Profile() {
    const { name, email, phone, address, image, degree, speciality, xp, available, fees } = useSelector(state => state.doctor);
    const serverUrl = import.meta.env.VITE_DOCCURES_SERVER_URL;
    let { appointments, isLoading: loadingBookings, error: bookingError } = useAppointments();
    const dispatch = useDispatch();
    let [isLoading, setIsLoading] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    let [isDeleted, setIsDeleted] = useState(null);
    let color = RandomColorGenerator();


    const handleDeleteConfirm = async (confirmed) => {

        if (confirmed) {
            console.log('Deleting account', email);

            try {
                setIsLoading(true);
                let response = await fetch(`${serverUrl}/doctor/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email: email })
                })

                let data = await response.json();
                console.log(data);
                if (data.isDeleted) {
                    setIsDeleted(true)
                    setTimeout(() => {
                        setIsDeleted(null)
                    }, 7000)
                    dispatch(logoutDoctor());
                }
                else {
                    setIsDeleted(false)
                    setTimeout(() => {
                        setIsDeleted(null)
                    }, 12000)
                }

            } catch (error) {
                console.error('Error during account deletion:', error);
            }
            finally {
                setIsLoading(false);
            }
        }
        setShowDeleteConfirm(false);
    };

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className='md:w-[65%] lg:w-[80%] md:bg-primary p-4'>
            <div className='w-full h-full bg-white shadow-xl md:shadow-none md:bg-softGray rounded-3xl flex flex-col items-center overflow-scroll no-scrollbar'>
                {showLogoutConfirm && (
                    <ConfirmAlert
                        confirmMessage='Are you sure you want to logout?'
                        confirmType='warning'
                        confirm={handleLogoutConfirm}
                    />
                )}
                {showDeleteConfirm && (
                    <ConfirmAlert
                        confirmMessage='Are you sure you want to delete your account? This action cannot be undone.'
                        confirmType='warning'
                        confirm={handleDeleteConfirm}
                    />
                )}
                {
                    isDeleted &&
                    <AlertDisplay alertType='success' alertMessage='User Deleted successfully' />
                }
                {
                    isDeleted === false &&
                    <AlertDisplay alertType='error' alertMessage="Can't delete user right now, please try again!" />
                }

                <ProfilePreview
                    name={name}
                    email={email}
                    phone={phone}
                    address={address}
                    isLocalImage={false}
                    image={image}
                    color={color}
                    degree={degree}
                    speciality={speciality}
                    experience={xp}
                    available={available}
                    fees={fees}
                />

                <hr className='w-[95%] border-none h-[2px] bg-darkGray mt-5' />
                <h2 className='text-xl md:text-2xl font-semibold mt-5'>Your Appointments with patients</h2>

                <div className='mt-6 w-[95%] flex flex-col lg:flex-row gap-8 items-center'>
                    {
                        loadingBookings ? <IncomponentLoading /> :
                            <>
                                <UpcomingAppointmentList page={'profile'} />
                                <PreviousAppointmentList page={'profile'} />
                            </>
                    }

                </div>
                <Link to='/appointments' className='mt-10 px-5 p-3 flex flex-row items-center gap-2 bg-primary rounded-xl w-[250px] justify-center text-white text-lg font-semibold hover:bg-[#2929ff]'>
                    All Appointments
                </Link>
                <hr className='w-[95%] border-none h-[2px] bg-darkGray mt-5 md:mb-0 mb-5' />
                <div className='w-[95%] py-6 px-3 bg-secondary rounded-2xl shadow-md shadow-darkGray flex flex-col md:flex-row justify-around gap-3 mb-5 md:mb-0' >
                    <Link to="/editProfile" className='px-5 p-3 flex flex-row items-center gap-2 bg-primary rounded-xl md:w-[200px] justify-center text-white text-lg font-semibold hover:bg-[#2929ff] '>
                        Edit Profile
                        <Edit className='w-6' />
                    </Link>

                    <button
                        className='px-5 p-3 flex flex-row items-center gap-2 bg-[#ec3333] rounded-xl md:w-[200px] justify-center text-white text-lg font-semibold hover:bg-[red]'
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        Delete Account
                        <Trash className='w-6' />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;