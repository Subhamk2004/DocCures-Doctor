import React from 'react'
import { Mail, Phone, MapPinCheck, Edit, LogOut, Trash, IndentIcon, TicketMinus, Book, Star, CaseLower, Box, User2Icon, UserCircleIcon, UserCheck } from 'lucide-react';
import Verified from '../assets/images/verified.png';

function ProfilePreview({
    name,
    email,
    phone,
    address,
    image,
    color,
    isLocalImage = false,
    previewImage,
    degree,
    speciality,
    experience,
    available
}) {
    let imageUrl = previewImage;
    if (isLocalImage && typeof previewImage !== 'string') {
        imageUrl = URL.createObjectURL(previewImage);
    }

    return (
        <div className='flex flex-col gap-7 items-center mt-10 px-6 justify-center'>
            <div className='p-1 border-4 border-primary rounded-full relative'>
                <div className='w-[150px] h-[150px] flex flex-col rounded-full overflow-hidden items-center justify-center'>
                    {
                        isLocalImage ?
                            <img
                                src={imageUrl}
                                alt="Preview"
                                className="w-[100%] h-52 object-cover object-top rounded-2xl"
                            />
                            :
                            <>
                                {
                                    image === "null" ?
                                        <div className="w-full h-[150px] bg-white flex justify-center items-center">
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
                                            <p className='absolute text-3xl font-semibold'>
                                                {name[0].toUpperCase()}
                                            </p>
                                        </div>
                                        :
                                        (
                                            <img
                                                src={image}
                                                alt={`Dr. ${name}`}
                                                className="w-[100%] h-52 object-cover object-top rounded-2xl"
                                            />
                                        )
                                }
                            </>
                    }
                </div>
                <img src={Verified} className='bg-white p-1 rounded-full w-[45px] absolute bottom-0 right-0' alt="Verified" />
            </div>
            <div className='flex flex-col items-start gap-3 w-full '>
                <div className='w-full flex flex-row items-center justify-center'>
                    <span className='text-[33px] text-center flex justify-center font-bold text-textp flex-row gap-2 relative items-center'>
                        {name}

                        {
                            degree &&
                            <>
                                {available ? (
                                    <div className='flex flex-row  items-center gap-2 absolute -right-28'>
                                        <div className='w-[20px] h-[20px] rounded-full bg-[#a5ffa5] flex flex-row justify-center items-center'>
                                            <div className='w-[10px] h-[10px] rounded-full bg-[#2ec92e]'>
                                            </div>
                                        </div>
                                        <p className='text-lg font-semibold text-[green]'>Available</p>
                                    </div>
                                ) : (
                                    <div className='flex flex-row  items-center gap-2 absolute -right-32'>
                                        <div className='w-[20px] h-[20px] rounded-full bg-[#ffa5a5] flex flex-row justify-center items-center'>
                                            <div className='w-[10px] h-[10px] rounded-full bg-[#dd4444]'>
                                            </div>
                                        </div>
                                        <p className='text-lg font-semibold text-[red]'>Unavailable</p>
                                    </div>
                                )}
                            </>
                        }
                    </span>
                </div>

                <div className='flex flex-row items-start gap-2'>
                    <Phone className='w-[22px] h-[22px] mt-1' />
                    <p className='text-xl font-semibold text-primary'>{phone}</p>
                </div>
                <div className='flex flex-row items-start gap-2'>
                    <Mail className='w-[22px] h-[22px] mt-1' />
                    <p className='text-xl font-semibold text-primary'>{email}</p>
                </div>
                <div className='flex flex-row items-start gap-2'>
                    <MapPinCheck className='w-[22px] h-[22px] mt-1' />
                    <p className='text-xl font-semibold text-primary'>{address}</p>
                </div>
                {
                    degree &&
                    <>
                        <div className='flex flex-row items-start gap-2'>
                            <UserCheck className='w-[22px] h-[22px] mt-1' />
                            <p className='text-xl font-semibold text-primary'>{speciality}</p>
                        </div>
                        <div className='flex flex-row items-start gap-2'>
                            <Star className='w-[22px] h-[22px] mt-1' />
                            <p className='text-xl font-semibold text-primary'>{experience} years of experience</p>
                        </div>
                        <div className='flex flex-row items-start gap-2'>
                            <Book className='w-[22px] h-[22px] mt-1' />
                            <p className='text-xl font-semibold text-primary'>Highest degree in {degree}</p>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default ProfilePreview