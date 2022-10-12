import React, { useContext } from 'react';
import { UserConstant } from '../../constants';
import { UserContext } from '../../context';
import { PassengerView } from '../Passenger';
import { RiderView } from '../Rider';

const City = () => {
    const { user } = useContext(UserContext);
    return(
        <div>
            {user.type === UserConstant.userType.PASSENGER && <PassengerView/>}
            {user.type === UserConstant.userType.RIDER && <RiderView/>}
        </div>
    );
};

export default City;
