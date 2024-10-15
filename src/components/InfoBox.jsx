import React from 'react'
import IncomponentLoading from './IncomponentLoading'
import { Link } from 'react-router-dom'

function InfoBox({
    title,
    value,
    image,
    ImgclassName,
    className,
    isLoading,
    to
}) {
    return (
        <Link to={to} className={`px-4 py-4 bg-white flex flex-row  justify-between rounded-2xl shadow-md shadow-darkGray w-[400px] h-[95px] cursor-pointer overflow-hidden ${className}`}>
            <div>
                <p className='font-semibold'>
                    {title}
                </p>
                {
                    isLoading ?
                        <IncomponentLoading />
                        :
                        <span className='text-xl font-bold text-[#18c418]'>
                            {value}
                        </span>
                }
            </div>
            <img src={image} alt='doc' className={`${ImgclassName}`} />
        </Link>
    )
}

export default InfoBox