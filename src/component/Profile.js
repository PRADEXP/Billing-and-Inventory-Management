import React, { useContext } from 'react';
import { Authcontext } from './Authentication';
import './Profile.css';

export default function Profile() {
    const { userlogin, setuserlogin } = useContext(Authcontext);

    const handlelogout = () => {
        setuserlogin({ status: false });
    };

    return (
        <div className="profile-container">
            <h1>Name: {userlogin.name}</h1>
            <h1>ID: {userlogin.id}</h1>
            <button onClick={handlelogout}>Logout</button>
        </div>
    );
}
