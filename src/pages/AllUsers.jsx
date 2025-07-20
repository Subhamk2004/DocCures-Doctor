import React, {useState, useEffect} from 'react'
import UserProfile from '../components/ProfileCard.jsx'
import IncomponentLoading from '../components/IncomponentLoading';
import useUsers from '../hooks/useUsers.mjs';

function AllUsers() {

    let [showWarning, setShowWarning] = useState(false)
    let { users, isLoadingUsers, error } = useUsers();

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
                        <span className='text-primary'>All</span> Users
                    </h1>
                </div>
                <div className='h-[85%] w-full items-center flex flex-col gap-5 px-4 overflow-scroll no-scrollbar'>
                    {
                        isLoadingUsers ?
                            <IncomponentLoading />
                            :
                            null
                    }
                    <UserProfile
                        list={users}
                        type={'user'}
                    />
                </div>
            </div>
        </div>
    )
}

export default AllUsers