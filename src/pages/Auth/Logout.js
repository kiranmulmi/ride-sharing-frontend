import React from 'react';
import { Navigate } from 'react-router-dom';
const Logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user');

    return <Navigate to="/login" />
};

export default Logout;
