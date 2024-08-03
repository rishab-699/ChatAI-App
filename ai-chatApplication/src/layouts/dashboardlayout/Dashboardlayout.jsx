import { Link, Outlet, useNavigate } from 'react-router-dom';
import './dashboardlayout.css'
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import Chatlist from '../../components/chatlist/Chatlist';

const DashboardLayout = ()=>{
    const {userId, isLoaded} = useAuth();
    const navigate = useNavigate()
    useEffect(() => {
        if (isLoaded && !userId) {
            navigate("/sign-in");
        }
    }, [isLoaded, userId, navigate]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div className="DashboardLayout">
            <div className="menu">
                <Chatlist/>
            </div>
            <div className="content">
                <Outlet></Outlet>
            </div>
        </div>
    )
}

export default DashboardLayout;