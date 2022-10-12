import { List } from 'antd';
import React, { useState, useEffect, useContext } from "react";
import { BookingConstant, UserConstant } from '../../constants';
import { axiosGET } from '../../helper/axios.helper';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context';

const HistoryPage = () => {
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {

    }, [])
    const loadMoreData = () => {
        if (loading) {
            return;
        }

        setLoading(true);

        axiosGET(`${process.env.REACT_APP_API_URL}/booking/getAll`)
            .then(response => {
                setBookings(response.data.data);
            })
            .catch(e => console.log(e));
    };
    useEffect(() => {
        loadMoreData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <h2>Ride History</h2>
            <List
                dataSource={bookings}
                renderItem={(item) => {
                    return (
                        <List.Item key={item.email}>
                            <List.Item.Meta
                                avatar={
                                    <div>
                                        <Moment format="YYYY/MM/DD">{item.createdAt}</Moment>
                                    </div>
                                }
                                title={
                                    <div>
                                        {user.type === UserConstant.userType.PASSENGER && <div>{item.rider ? "Rider: " + item.rider.name : ""}</div>}
                                        {user.type === UserConstant.userType.RIDER && <div>{item.rider ? "Passenger: " + item.passenger.name : ""}</div>}
                                        <div>From: {item.origin.address}</div>
                                        <div>To: {item.destination.address}</div>
                                    </div>
                                }
                                description={
                                    <div>
                                        <div>Rs.{item.price}</div>
                                        <div><Link to={`/rideRequest?bookingID=${item._id}`}>View Request</Link></div>
                                    </div>}
                            />
                            <div>{BookingConstant.rideStatusText[item.status]}</div>
                        </List.Item>
                    )
                }}
            />
        </>
    );
};

export default HistoryPage;
