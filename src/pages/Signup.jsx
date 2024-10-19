import React, { useState } from 'react';
import FormInput from '../components/FormInput';
import FormImageInput from '../components/FormImageInput';
import AlertDisplay from '../components/AlertDisplay';
import IncomponentLoading from '../components/IncomponentLoading';
import useDoctorList from '../hooks/useDoctorList';
import { Link, useNavigate } from 'react-router-dom';

function AddDoctor() {
    const serverUrl = import.meta.env.VITE_DOCCURES_SERVER_URL;

    let [showWarning, setShowWarning] = useState(false)
    let [showSuccess, setShowSuccess] = useState(false)
    let [error, setError] = useState('')
    let [isLoading, setIsLoading] = useState(false)
    let navigate = useNavigate();

    const initialDoctorState = {
        name: '',
        email: '',
        phone: '',
        password: '',
        speciality: '',
        xp: '',
        fees: '',
        degree: '',
        address: '',
        available: false,
        image: null
    };

    const [doctor, setDoctor] = useState(initialDoctorState);

    const [previewImage, setPreviewImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setDoctor({ ...doctor, image: file });
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(doctor).forEach(key => {
            if (key === 'image') {
                formData.append('image', doctor.image);
            } else {
                formData.append(key, doctor[key]);
            }
        });

        try {
            setIsLoading(true)
            const response = await fetch(`${serverUrl}/doctor/signup`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();
            console.log(data);
            if (!data.isSaved) {
                console.log(data.isSaved);
                setError(data.message)
                setShowWarning(true)
                setTimeout(() => {
                    setShowWarning(false)
                }, 17000)
            }
            else if (data.isSaved) {
                setShowSuccess(true)
                setTimeout(() => {
                    setShowSuccess(false)
                    navigate('/');
                }, 7000)
                setDoctor(initialDoctorState);
                setPreviewImage(null);
            }
        } catch (error) {
            console.error('Error adding doctor:', error);
        }
        finally {
            setIsLoading(false)
        }
    };

    console.log(isLoading);


    return (
        <div className='w-[100%] bg-softGray'>
            <div className='w-full h-full bg-softGray rounded-3xl flex flex-col items-center overflow-hidden no-scrollbar'>
                <h1 className='text-2xl lg:text-4xl font-bold mt-10'>
                    {
                        showWarning ?
                            <AlertDisplay alertType='error' alertMessage={error} />
                            :
                            null
                    }
                    {
                        showSuccess ?
                            <AlertDisplay alertType='success' alertMessage='Doctor added successfully, now please login' />
                            :
                            null
                    }
                    Register yourself as a
                    <span className='text-primary'> Doctor</span>
                </h1>
                <div className='w-[90%] md:w-[70%] max-w-[800px] h-auto mt-10 overflow-scroll no-scrollbar'>
                    <form className='w-full h-auto bg-white rounded-3xl flex flex-col items-start p-6 px-9 shadow-md shadow-darkGray gap-7 mb-4'
                        onSubmit={handleSubmit}
                    >
                        <div className='w-full h-auto flex flex-col  gap-7'>
                            <FormInput
                                title={'Name'}
                                type={'text'}
                                placeholder={'Enter your Name'}
                                labelFor={'docName'}
                                isRequired={true}
                                value={doctor.name}
                                onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
                            />
                            <FormInput
                                title={'Email'}
                                type={'email'}
                                placeholder={'Enter your Email'}
                                labelFor={'email'}
                                isRequired={true}
                                value={doctor.email}
                                onChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
                            />
                            <FormInput
                                title={'Phone number'}
                                type={'number'}
                                placeholder={'Enter your phone number'}
                                labelFor={'phone'}
                                isRequired={true}
                                value={doctor.phone}
                                onChange={(e) => setDoctor({ ...doctor, phone: e.target.value })}
                            />
                            <FormInput
                                title={'Password'}
                                type={'password'}
                                placeholder={'Password'}
                                labelFor={'password'}
                                isRequired={true}
                                value={doctor.password}
                                onChange={(e) => setDoctor({ ...doctor, password: e.target.value })}
                            />
                            <FormInput
                                title={'Speciality'}
                                isSelect={true}
                                placeholder={'Select your speciality'}
                                labelFor={'speciality'}
                                isRequired={true}
                                value={doctor.speciality}
                                onChange={(e) => setDoctor({ ...doctor, speciality: e.target.value })}
                            />
                            <FormInput
                                title={'Experience'}
                                type={'number'}
                                placeholder={'Experience in years'}
                                labelFor={'xp'}
                                isRequired={true}
                                value={doctor.xp}
                                onChange={(e) => setDoctor({ ...doctor, xp: e.target.value })}
                            />
                            <FormInput
                                title={'Doctor Fees'}
                                type={'number'}
                                placeholder={'Fees in Indian rupees'}
                                labelFor={'fees'}
                                isRequired={true}
                                value={doctor.fees}
                                onChange={(e) => setDoctor({ ...doctor, fees: e.target.value })}
                            />
                            <FormInput
                                title={'Degree'}
                                type={'text'}
                                placeholder={'Enter the highest Degree you pursued'}
                                labelFor={'degree'}
                                isRequired={true}
                                value={doctor.degree}
                                onChange={(e) => setDoctor({ ...doctor, degree: e.target.value })}
                            />
                            <FormInput
                                title={'Address'}
                                type={'text'}
                                placeholder={`Enter your current address`}
                                labelFor={'address'}
                                isRequired={true}
                                value={doctor.address}
                                onChange={(e) => setDoctor({ ...doctor, address: e.target.value })}
                            />
                            <FormInput
                                title={'Available ?'}
                                type={'checkbox'}
                                placeholder={`Are you available for appointments`}
                                labelFor={'available'}
                                isRequired={false}
                                isCheckbox={true}
                                value={doctor.available}
                                onChange={(e) => setDoctor({ ...doctor, available: e.target.checked })}
                            />
                            <FormImageInput
                                title={'Doctor Image'}
                                labelFor={'doctorImage'}
                                isRequired={true}
                                onChange={handleImageChange}
                                previewImage={previewImage}
                            />
                        </div>
                        {
                            isLoading ?
                                <button className='p-3 w-full rounded-2xl text-2xl font-bold text-white bg-[#0000ffc0] hover:shadow-md hover:shadow-[#5c6e9e]'
                                    type='submit'
                                >
                                    <IncomponentLoading isShort={true} />
                                </button>

                                :
                                <button className='p-3 bg-primary w-full rounded-2xl text-2xl font-bold text-white hover:bg-[#0000ffc0] hover:shadow-md hover:shadow-[#5c6e9e]'
                                    type='submit'
                                >
                                    Add Doctor
                                </button>
                        }
                        <p className='flex flex-row gap-1 text-textp w-full items-center justify-center'>
                            Already registered?
                            <Link to='/' className='text-primary font-semibold text-lg hover:text-[#0000ffd3] underline'>
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddDoctor;