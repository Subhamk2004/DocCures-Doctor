import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authenticate, setDisplayAlert } from '../redux/AdminSclice';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Loading';
import AlertDisplay from '../components/AlertDisplay';
import logofull from '../assets/images/logofull.png'

function Login() {
    const { isAuthenticated } = useSelector(state => state.admin);
    const [showWarning, setShowWarning] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [data, setData] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
            const response = await fetch(`${server_url}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const responseData = await response.json();
            setData(responseData);
        } catch (error) {
            console.error('Login error:', error);
            setShowWarning(true);
        }
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className='w-full h-full border bg-secondary flex flex-col items-center justify-center gap-8'>
            {showWarning && <AlertDisplay alertMessage='Invalid Credentials' alertType='warning' />}
            <h1 className='text-3xl font-bold text-primary'>Welcome Admin</h1>
            <form className='shadow-lg shadow-darkGray rounded-3xl p-8 bg-white flex flex-col gap-7 items-center px-[40px]'
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
                <button className='p-3 min-w-[300px] bg-primary rounded-xl text-2xl font-semibold text-white hover:bg-[#0000ffd3]'
                    type='submit'
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login