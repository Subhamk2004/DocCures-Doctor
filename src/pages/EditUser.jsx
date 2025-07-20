import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RandomColorGenerator from '../utils/RandomColorGenerator.mjs';
import FormInput from '../components/FormInput';
import FormImageInput from '../components/FormImageInput';
import IncomponentLoading from '../components/IncomponentLoading';
import ProfilePreview from '../components/ProfilePreview';
import AlertDisplay from '../components/AlertDisplay';
import { updateDoctor } from '../redux/DoctorSlice.mjs';
import { useNavigate } from 'react-router-dom';


function EditProfile() {
    const { name, email, phone, address, image, available, speciality, xp, fees, degree } = useSelector(state => state.doctor);
    const serverUrl = import.meta.env.VITE_DOCCURES_SERVER_URL;
    let [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(image);
    const [showWarning, setShowWarning] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');
    let navigate = useNavigate();
    let dispatch = useDispatch();
    const initialDoctorState = {
        name: name,
        email: email,
        phone: phone,
        speciality: speciality,
        xp: xp,
        fees: fees,
        degree: degree,
        address: address,
        available: available,
        image: image
    };


    const [user, setUser] = useState(initialDoctorState);
    let color = RandomColorGenerator();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(user).forEach(key => {
          if (key === 'image' && user[key] instanceof File) {
            formData.append('image', user[key]);
          } else {
            formData.append(key, user[key]);
          }
        });
        
        try {
          setIsLoading(true);
          const response = await fetch(`${serverUrl}/doctor/update`, {
            method: 'PUT',
            body: formData,
            credentials: 'include'
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          if (!data.isUpdated) {
            setError(data.message);
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 17000);
          } else {
            setShowSuccess(true);
            console.log(data.user);
            dispatch(updateDoctor(data.user));
            setTimeout(() => {
              setShowSuccess(false);
              navigate('/profile');
            }, 7000);
          }
        } catch (error) {
          console.error('Error updating user:', error);
          setError('An unexpected error occurred. Please try again.');
          setShowWarning(true);
        } finally {
          setIsLoading(false);
        }
      };
      

    let handleImageChange = (e) => {
        const file = e.target.files[0];
        setUser(prevUser => ({ ...prevUser, image: file }));
        setPreviewImage(URL.createObjectURL(file));
    }

    return (
        <div className='w-[65%] lg:w-[80%] bg-primary p-4'>
            <div className='w-full h-full bg-softGray rounded-3xl flex flex-col items-center overflow-scroll no-scrollbar'>
                {showWarning && <AlertDisplay alertType='error' alertMessage={error} />}
                {showSuccess && (
                    <AlertDisplay
                        alertType='success'
                        alertMessage='Doctor updated successfully'
                    />
                )}
                <ProfilePreview
                    name={user.name}
                    email={user.email}
                    phone={user.phone}
                    address={user.address}
                    isLocalImage={true}
                    previewImage={user.image}
                    color={color}
                    speciality={user.speciality}
                    degree={user.degree}
                    experience={user.xp}
                    available={user.available}
                />
                <div className='w-[80%] max-w-[900px] h-auto mt-10 overflow-scroll no-scrollbar'>
                    <form
                        className='w-full h-auto bg-white rounded-3xl flex flex-col items-start p-6 px-9 shadow-md shadow-darkGray gap-7 mb-4'
                        onSubmit={handleSubmit}
                    >
                        <div className='w-full h-auto flex flex-col gap-7'>
                            <FormInput
                                title='Name'
                                type='text'
                                placeholder='Enter your Name'
                                labelFor='name'
                                isRequired={true}
                                value={user.name}
                                onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
                            />
                            <FormInput
                                title='Email'
                                type='email'
                                placeholder='Enter new email'
                                labelFor='email'
                                isRequired={true}
                                value={user.email}
                                onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                            />
                            <FormInput
                                title='Address'
                                type='text'
                                placeholder='Enter your current address'
                                labelFor='address'
                                isRequired={true}
                                value={user.address}
                                onChange={(e) => setUser(prev => ({ ...prev, address: e.target.value }))}
                            />
                            <FormInput
                                title={'Speciality'}
                                isSelect={true}
                                placeholder={'Select your speciality'}
                                labelFor={'speciality'}
                                isRequired={true}
                                value={user.speciality}
                                onChange={(e) => setUser(prev => ({ ...prev, speciality: e.target.value }))}
                            />
                            <FormInput
                                title={'Experience'}
                                type={'number'}
                                placeholder={'Experience in years'}
                                labelFor={'xp'}
                                isRequired={true}
                                value={user.xp}
                                onChange={(e) => setUser(prev => ({ ...prev, xp: e.target.value }))}
                            />
                            <FormInput
                                title={'Doctor Fees'}
                                type={'number'}
                                placeholder={'Fees in Indian rupees'}
                                labelFor={'fees'}
                                isRequired={true}
                                value={user.fees}
                                onChange={(e) => setUser(prev => ({ ...prev, fees: e.target.value }))}
                            />
                            <FormInput
                                title={'Degree'}
                                type={'text'}
                                placeholder={'Enter the highest Degree doctor pursued'}
                                labelFor={'degree'}
                                isRequired={true}
                                value={user.degree}
                                onChange={(e) => setUser(prev => ({ ...prev, degree: e.target.value }))}
                            />
                            <FormInput
                                title={'Available ?'}
                                type={'checkbox'}
                                placeholder={`Are you available for appointments`}
                                labelFor={'available'}
                                isRequired={false}
                                isCheckbox={true}
                                value={user.available}
                                onChange={(e) => setUser(prev => ({ ...prev, available: !user.available }))}
                            />
                            <FormImageInput
                                title='User Profile Avatar'
                                labelFor='profilePic'
                                isRequired={false}
                                onChange={handleImageChange}
                                previewImage={previewImage}
                            />
                        </div>
                        <button
                            className='p-3 w-full rounded-2xl text-2xl font-bold text-white bg-primary hover:bg-[#0000ffc0] hover:shadow-md hover:shadow-[#5c6e9e]'
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? <IncomponentLoading isShort={true} /> : 'Update Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditProfile