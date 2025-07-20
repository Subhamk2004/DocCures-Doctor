import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authenticate, setDisplayAlert } from '../redux/DoctorSlice.mjs';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Loading';
import AlertDisplay from '../components/AlertDisplay';
import logofull from '../assets/images/logofull.png'
import IncomponentLoading from '../components/IncomponentLoading';

function Login() {
    const { isAuthenticated } = useSelector(state => state.doctor);
    const [showWarning, setShowWarning] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [data, setData] = useState();
    const navigate = useNavigate();
    let [error, setError] = useState('')
    let [showSuccess, setShowSuccess] = useState(false)
    let [showError, setShowError] = useState(false)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { isLoading } = useAuth();

    const server_url = import.meta.env.VITE_DOCCURES_SERVER_URL;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate])

    useEffect(() => {
        if (data) {
            if (data.isAuthenticated) {
                setShowWarning(false);
                dispatch(authenticate(data));
                navigate('/dashboard');
            } else {
                setShowWarning(true);
            }
        }
    }, [data, dispatch, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setDisplayAlert(Date.now()))
        setShowWarning(false);

        try {
            setLoading(true);
            const response = await fetch(`${server_url}/doctor/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            let newData = await response.json();
            setData(newData);
            console.log(newData);

            if (newData.auth) {
                setShowSuccess(true)
                setTimeout(() => {
                    navigate('/dashboard')
                    setShowSuccess(false)
                }, 7000)
            }
            else {
                setShowError(true)
                setError(newData.message)
                setTimeout(() => {
                    setShowError(false)
                }, 12000)
            }

        } catch (error) {
            console.error('Login error:', error);
            setShowWarning(true);
        } finally {
            setLoading(false);
        }
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className='w-full h-full mt-10 md:mt-0 md:bg-secondary flex flex-col items-center justify-center gap-8'>
            
            {
                showSuccess ?
                    <AlertDisplay alertType='success' alertMessage='Login successful' />
                    :
                    null
            }
            {
                showError ?
                    <AlertDisplay alertType='error' alertMessage={error} />
                    :
                    null
            }
            <h1 className='text-3xl font-bold text-primary'>Welcome Doctor</h1>
            <form className='w-[90%] md:w-auto shadow-lg shadow-darkGray rounded-3xl p-8 bg-white flex flex-col gap-7 items-center px-[40px]'
                onSubmit={handleSubmit}
            >
                <img src={logofull} alt="Logo" className='w-[100px]' />
                <div className='flex flex-col gap-1'>
                    <label htmlFor='email' className='text-xl font-semibold'>Email</label>
                    <input type='email'
                        id='email'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='outline-none min-w-[300px] p-2 bg-secondary rounded-xl shadow-md shadow-darkGray' />
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='password' className='text-xl font-semibold'>Password</label>
                    <input type='password'
                        id='password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='outline-none min-w-[300px] p-2 bg-secondary rounded-xl shadow-md shadow-darkGray' />
                </div>
                {
                    loading ?
                        <button className='p-3 w-full rounded-2xl text-2xl font-bold text-white bg-[#0000ffc0] hover:shadow-md hover:shadow-[#5c6e9e]'
                            type='submit'
                            disabled={loading}
                        >
                            <IncomponentLoading isShort={true} />
                        </button>

                        :
                        <button className='p-3 bg-primary w-full rounded-2xl text-2xl font-bold text-white hover:bg-[#0000ffc0] hover:shadow-md hover:shadow-[#5c6e9e]'
                            type='submit'
                            disabled={loading}
                        >
                            Login
                        </button>
                }
                <p className='flex flex-row gap-1 text-textp'>
                    Not registered?
                    <Link to='/signup' className='text-primary font-semibold text-lg hover:text-[#0000ffd3] underline'>
                        Register
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Login