import React from 'react';
import { Edit, Phone, Mail } from 'lucide-react';
import verified from '../assets/images/verified.png'
import RandomColorGenerator from '../utils/RandomColorGenerator.mjs';
import { Link } from 'react-router-dom';

function ProfileCard({ list, type }) {
    return (
        <div className="flex flex-row flex-wrap items-center justify-evenly gap-6 px-6">
            {list.map((user) => {
                const color = RandomColorGenerator();
                const truncatedEmail = user.email.length > 25 ? `${user.email.slice(0, 25)}...` : user.email;
                return (
                    <div key={user._id} className="bg-white rounded-2xl shadow-md shadow-darkGray overflow-hidden transition-all duration-300 hover:shadow-lg w-[280px]">
                        <div className="relative flex justify-center pt-4">
                            {user.image !== 'null' ? (
                                <img
                                    src={user.image}
                                    alt={`Dr. ${user.name}`}
                                    className="w-[97%] h-52 object-cover object-top rounded-2xl"
                                />
                            ) : (
                                <div className="w-full h-[208px] bg-white flex justify-center items-center">
                                    <div
                                        className='shadow-md shadow-[#383838] opacity-45'
                                        style={{
                                            backgroundColor: `#${color}`,
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                    </div>
                                    <p className='absolute text-3xl font-semibold'>
                                        {user.name[0].toUpperCase()}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <div className='flex flex-row items-center gap-1 mb-1'>
                                <h2 className="text-2xl font-semibold text-gray-800 ">
                                    {
                                        type === 'user' ?
                                            user.name :
                                            <p>Dr. {user.name}</p>
                                    }
                                </h2>
                                <img src={verified} className='w-[20px]' alt="Verified" />
                            </div>
                            <p className=" text-gray-600 mb-1">{user.speciality}</p>
                            <div className="w-full mb-4">
                                {
                                    type === 'doctors' ?
                                        <>
                                            {user.available ? (
                                                <div className='flex flex-row  items-center gap-2'>
                                                    <div className='w-[20px] h-[20px] rounded-full bg-[#a5ffa5] flex flex-row justify-center items-center'>
                                                        <div className='w-[10px] h-[10px] rounded-full bg-[#2ec92e]'>
                                                        </div>
                                                    </div>
                                                    <p className='text-lg font-semibold text-[green]'>Available</p>
                                                </div>
                                            ) : (
                                                <div className='flex flex-row  items-center gap-2'>
                                                    <div className='w-[20px] h-[20px] rounded-full bg-[#ffa5a5] flex flex-row justify-center items-center'>
                                                        <div className='w-[10px] h-[10px] rounded-full bg-[#dd4444]'>
                                                        </div>
                                                    </div>
                                                    <p className='text-lg font-semibold text-[red]'>Unavailable</p>
                                                </div>
                                            )}
                                        </>
                                        :
                                        <div className='flex flex-col  justify-center gap-2'>
                                            <p className='flex flex-row items-center gap-1'>
                                                <Phone className='h-4 w-4 mr-2 text-primary' />
                                                {user.phone}
                                            </p>
                                            <p className='flex flex-row items-center gap-1'>
                                                <Mail className='h-4 w-4 mr-2 text-primary' />
                                                {truncatedEmail}
                                            </p>
                                        </div>
                                }

                            </div>
                            <div className="flex items-center justify-between w-full">
                                <Link to={`/viewUser/${user._id}?userType=${user.degree}`} className="w-full flex items-center px-3 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-[#0000ffb6] duration-300">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ProfileCard;