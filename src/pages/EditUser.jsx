import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import RandomColorGenerator from '../utils/RandomColorGenerator.mjs';
import ProfilePreview from '../components/ProfilePreview';
import AlertDisplay from '../components/AlertDisplay';
import { useNavigate } from 'react-router-dom';
import { Trash } from 'lucide-react';
import ConfirmAlert from '../components/ConfirmAlert';


function EditProfile({
    user: fetchedUser
}) {

    const serverUrl = import.meta.env.VITE_DOCCURES_SERVER_URL;
    let [isLoading, setIsLoading] = useState();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    let [isDeleted, setIsDeleted] = useState(null);
    let navigate = useNavigate();
    let color = RandomColorGenerator();

    const handleDeleteConfirm = async (confirmed) => {
        if (confirmed) {
            try {
                setIsLoading(true);
                let userType = 'user'
                if (fetchedUser.degree) {
                    userType = 'doctor'
                }
                let response = await fetch(`${serverUrl}/user/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        email: fetchedUser.email,
                        from: 'admin',
                        userType: userType
                    })
                })

                let data = await response.json();
                console.log(data);
                if (data.isDeleted) {
                    setIsDeleted(true)
                    setTimeout(() => {
                        setIsDeleted(null)
                        if (fetchedUser.degree) {
                            navigate('/allDoctors')
                        }
                        else {
                            navigate('/allUsers')
                        }
                    }, 7000)
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

    return (
        <div className='w-full h-full flex flex-col items-center'>
            <div className='w-full h-[70%]'>
                {
                    isDeleted &&
                    <AlertDisplay alertType='success' alertMessage='Deletion Successfull' />
                }
                {
                    isDeleted === false &&
                    <AlertDisplay alertType='error' alertMessage="Can't delete user right now, please try again!" />
                }
                {showDeleteConfirm && (
                    <ConfirmAlert
                        confirmMessage='Are you sure you want to delete your account? This action cannot be undone.'
                        confirmType='warning'
                        confirm={handleDeleteConfirm}
                    />
                )}
                {
                    fetchedUser.degree ?
                        <ProfilePreview
                            name={fetchedUser.name}
                            email={fetchedUser.email}
                            phone={fetchedUser.phone}
                            address={fetchedUser.address}
                            isLocalImage={false}
                            image={fetchedUser.image}
                            color={color}
                            degree={fetchedUser.degree}
                            speciality={fetchedUser.speciality}
                            experience={fetchedUser.xp}
                            available={fetchedUser.available}
                        />
                        :
                        <ProfilePreview
                            name={fetchedUser.name}
                            email={fetchedUser.email}
                            phone={fetchedUser.phone}
                            address={fetchedUser.address}
                            isLocalImage={false}
                            image={fetchedUser.image}
                            color={color}
                        />
                }
            </div>

            <div className="w-[85%] flex flex-row justify-center items-end mb-5 mt-10 h-[30%] ">
                <button
                    className='px-5 p-3 flex flex-row items-center gap-2 bg-[#ec3333] rounded-2xl w-full h-[60px] justify-center text-white text-lg font-semibold hover:bg-[red]'
                    onClick={() => setShowDeleteConfirm(true)}
                >
                    Delete Account
                    <Trash className='w-6' />
                </button>
            </div>
        </div>
    )
}

export default EditProfile