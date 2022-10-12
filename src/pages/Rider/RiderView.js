import React, {useContext} from 'react';
import { UserContext } from '../../context';
const RiderView = () => {
    const { user } = useContext(UserContext);
    return (
        <>
            <div><h3>Dear Rider</h3></div>
            <div>You will recive <b>Ride Request</b> link in you email based on your location</div>
            <br/>
            <div>Your Email: {user.email}</div>
            <br/>
            <div>Keep checking your email</div>
        </>
    );
};

export default RiderView;
