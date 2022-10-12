import React, { useState, useContext } from 'react';
import { Button, Card, Modal } from 'antd';
import { axiosPOST } from '../../helper/axios.helper';
import { useNavigate } from 'react-router-dom';
import { BookingConstant } from '../../constants';
import { UserContext } from '../../context';
const RideAccept = (props) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [status, setStatus] = useState(BookingConstant.rideStatusText[props.currentBooking.status]);

    const acceptRideRequest = () => {
        axiosPOST(`${process.env.REACT_APP_API_URL}/booking/confirm`, { bookingID: props.currentBooking._id })
            .then((response) => {
                countDown("Success", "You have accepted this ride");
                setStatus(BookingConstant.rideStatusText[BookingConstant.rideStatus.IN_PROGRESS]);
            })
            .catch(err => {
                if(err.response.status === 400) {
                    countDown("Error", err.response.data.message, true);
                }
                console.log(err)
            })
    }

    const rejectRideRequest = () => {
        countDown("Request Cancelled", "You have rejected this ride");
        navigate('/')
    }

    const finishRideRequest = () => {
        axiosPOST(`${process.env.REACT_APP_API_URL}/booking/finish`, { bookingID: props.currentBooking._id })
            .then((response) => {
                countDown("Finished", "You have completed this ride request");
                setStatus(BookingConstant.rideStatusText[BookingConstant.rideStatus.COMPLETED]);
            })
            .catch(err => {
                console.log(err)
            })
    }

    const countDown = (title, message, err = false) => {
        let secondsToGo = 10;
        let modal = null;
        if(!err) {
            modal = Modal.success({
                title: title,
                content: message,
            });
        } else {
            modal = Modal.error({
                title: title,
                content: message,
            });
        }
        
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    };

    return (
        <div className='margin-top-10'>
            <Card
                title={`Status: ${status}`}
                style={{
                    width: '100%',
                }}
            >
                <p>{props.duration} ({props.distanceText}) </p>
                <h2>Rs.{props.currentBooking.price}</h2>
                {status === BookingConstant.rideStatusText[BookingConstant.rideStatus.PENDING] &&
                    <div className='margin-top-10'>
                        <Button type="primary" size={'large'} block onClick={acceptRideRequest}>
                            Accept
                        </Button>
                    </div>
                }
                {status === BookingConstant.rideStatusText[BookingConstant.rideStatus.PENDING] &&
                    <div className='margin-top-10'>
                        <Button type="danger" size={'large'} block onClick={rejectRideRequest}>
                            Reject
                        </Button>
                    </div>
                }
                {status === BookingConstant.rideStatusText[BookingConstant.rideStatus.IN_PROGRESS] &&
                    <div className='margin-top-10'>
                        <Button type="primary" size={'large'} block onClick={finishRideRequest} disabled={props.currentBooking.rider.id === user.id ? false : true} >
                            Complete
                        </Button>
                    </div>
                }

            </Card>
        </div>
    );
};

export default RideAccept;
