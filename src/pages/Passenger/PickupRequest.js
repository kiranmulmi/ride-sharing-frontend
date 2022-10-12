import React, { useEffect, useState } from 'react';
import { Button, Card, Modal } from 'antd';
import { axiosGET, axiosPOST } from '../../helper/axios.helper';
const PickupRequest = (props) => {
    const [bookingID, setBookingID] = useState(props.currentBooking._id ? props.currentBooking._id : 0);
    const [sendRequest, setSendRequest] = useState(props.currentBooking._id ? true : false);
    const [cost, setCost] = useState(0);
    useEffect(() => {
        axiosGET(`${process.env.REACT_APP_API_URL}/booking/cost?distance=${props.distanceValue}`)
            .then(response => {
                setCost(Math.ceil(response.data.data.cost));
            })
            .catch(e => console.log(e));
    }, [props.distanceValue])

    const sendPickupRequest = () => {
        countDown();
        setSendRequest(true);
        axiosPOST(`${process.env.REACT_APP_API_URL}/booking/sendPickupRequest`, props.pickupDetails)
            .then((response) => {
                setBookingID(response.data.data.bookingID);
            })
            .catch(err => {
                console.log(err)
            })
    }

    const cancelPickupRequest = () => {
        setSendRequest(false);
        axiosPOST(`${process.env.REACT_APP_API_URL}/booking/cancel`, {
            bookingID: bookingID
        })
            .then((response) => {
                setBookingID(0);
            })
            .catch(err => {
                console.log(err)
            })
    }

    const countDown = () => {
        let secondsToGo = 5;
        const modal = Modal.success({
            title: 'Success',
            content: `Pickup request is sent to nearest riders. You will soon receive confirmation.`,
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    };

    return (
        <div className='margin-top-10'>
            <Card
                title="Ride Summary"
                style={{
                    width: '100%',
                }}
            >
                <p>{props.duration} ({props.distanceText}) </p>
                <h2>Rs.{cost}</h2>
                <div className='margin-top-10'>
                    {!sendRequest && <Button type="danger" size={'large'} block onClick={sendPickupRequest}>
                        Send Pickup Request
                    </Button>
                    }
                    {sendRequest && <Button type="danger" size={'large'} block onClick={cancelPickupRequest}>
                        Cancel
                    </Button>
                    }
                </div>
                <div className='margin-top-10' style={{ color: 'grey' }}>
                    <i>Note: you can drag marker for accurate location</i>
                </div>
            </Card>
        </div>
    );
};

export default PickupRequest;
