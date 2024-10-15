import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useSingleUser from '../hooks/useSingleUser.mjs';
import EditProfile from './EditUser';
import { useLocation } from 'react-router-dom';


function LoadUser() {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    
    const userType = searchParams.get('userType');

    const { id } = useParams();
    const { user: fetchedUser, isLoadingUsers } = useSingleUser(id, userType);
    let [user, setUser] = useState();

    useEffect(() => {
        console.log(fetchedUser);
        if(fetchedUser) {
            setUser(fetchedUser);
        }
    }, [fetchedUser])

    return (
        <div className='w-[65%] lg:w-[80%] bg-primary p-4'>
            <div className='w-full h-full bg-softGray rounded-3xl flex flex-col items-center overflow-hidden'>
                {
                    user && 
                    <EditProfile user={user} />
                }
            </div>
        </div>
    )
}

export default LoadUser