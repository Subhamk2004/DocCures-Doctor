import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import useAuth from "./hooks/useAuth";
import { useSelector } from "react-redux";
import Loading from "./components/Loading";
import AlertDisplay from "./components/AlertDisplay";
import Footer from "./components/Footer";

function Router() {
    const { isLoading, error } = useAuth();
    let { isAuthenticated } = useSelector(state => state.doctor);
    let navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        if (!isAuthenticated) {
            console.log(isAuthenticated);
            navigate('/');
        }
        else {
            console.log(isAuthenticated);
        }
    }, [isAuthenticated])


    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <AlertDisplay />;
    }

    return (
        <div className="h-[100%] flex flex-col md:flex-row relative">
            {isAuthenticated && <Navbar />}
            <Outlet />
            { windowWidth < 768 && <Footer/>}
        </div>
    );
}

export default Router;