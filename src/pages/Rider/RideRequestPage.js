import React, { useState, useRef, useEffect } from 'react';
import { useJsApiLoader, GoogleMap, Autocomplete } from '@react-google-maps/api';
import { Col, Row } from 'antd';
import { axiosGET } from '../../helper/axios.helper';
import RideAccept from './RideAccept';
import { useSearchParams } from 'react-router-dom';

const RideRequestPage = (props) => {
    const [ libraries ] = useState(['places']);
    const googleApiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleApiKey,
        libraries
    })
    const [searchParams] = useSearchParams();
    let origin = useRef("");
    let destination = useRef("");
    const [googleResponse, setGoogleResponse] = useState(null);
    let directionsService = useRef(null);
    let directionsRenderer = useRef(null)

    const onLoad = React.useCallback(function callback(map) {
        directionsService.current = new window.google.maps.DirectionsService();
        directionsRenderer.current = new window.google.maps.DirectionsRenderer({
            draggable: false,
            map,
            panel: document.getElementById("panel"),
            polylineOptions: {
                strokeColor: 'red'
            }
        });

        directionsRenderer.current.addListener("directions_changed", () => {
            const directions = directionsRenderer.current.getDirections();

            if (directions) {
                origin.current.value = directions.routes[0].legs[0].start_address
                destination.current.value = directions.routes[0].legs[0].end_address
                // console.log(directions);
                setGoogleResponse(directions)
            }
        });
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        // setMap(null)
    }, [])

    const [currentBooking, setCurrentBooking] = useState(false);
    let autocompleteOrigin = null;
    let autocompleteDestination = null;


    useEffect(() => {
        const bookingID = searchParams.get('bookingID');
        axiosGET(`${process.env.REACT_APP_API_URL}/booking/details?bookingID=${bookingID}`)
            .then(response => {
                if (response.data.data._id) {
                    setCurrentBooking(response.data.data);
                    displayRoute(
                        response.data.data.origin.address,
                        response.data.data.destination.address,
                        // directionsService.current,
                        // directionsRenderer.current
                    );

                    origin.current.value = response.data.data.origin.address;
                    destination.current.value = response.data.data.destination.address;
                }
            })
            .catch(e => console.log(e));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const originOnLoad = (autocomplete) => {
        //console.log('autocomplete: ', autocomplete)
        autocompleteOrigin = autocomplete;
    }

    const originOnPlaceChanged = () => {
        if (autocompleteOrigin !== null) {
            // console.log(autocompleteOrigin.getPlace())
        } else {
            console.log('Autocomplete origin is not loaded yet!')
        }
    }

    const destinationOnLoad = (autocomplete) => {
        //console.log('autocomplete: ', autocomplete)
        autocompleteDestination = autocomplete;
    }

    const destinationOnPlaceChanged = () => {
        if (autocompleteDestination !== null) {
            //console.log(autocompleteDestination);
            //console.log(autocompleteDestination.getPlace())
        } else {
            console.log('Autocomplete destination is not loaded yet!')
        }
    }

    const displayRoute = (origin, destination) => {
        if (directionsService.current) {
            directionsService.current
                .route({
                    origin: origin,
                    destination: destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                    avoidTolls: true,
                })
                .then((result) => {
                    directionsRenderer.current.setDirections(result);
                })
                .catch((e) => {
                    alert("Could not display directions due to: " + e);
                });
        } else {
            setTimeout(() => displayRoute(origin, destination), 1000);
        }
    }

    return isLoaded ? (
        <>
            <div>
                <Row>
                    <Col span={5} style={{ padding: "10px" }}>
                        <h3>Ride Details</h3>
                        <div className='col-md-6 col-lg-4'>
                            <div className='form-group'>
                                <label htmlFor='ORIGIN'>From</label>
                                <br />
                                <Autocomplete
                                    onLoad={originOnLoad}
                                    onPlaceChanged={originOnPlaceChanged}
                                >
                                    <input id='ORIGIN' className='ant-input' type='text' ref={origin} placeholder="From" />
                                </Autocomplete>
                            </div>
                        </div>

                        <div className='margin-top-10'>
                            <div className='form-group'>
                                <label htmlFor='DESTINATION'>To</label>
                                <br />
                                <Autocomplete
                                    onLoad={destinationOnLoad}
                                    onPlaceChanged={destinationOnPlaceChanged}
                                >
                                    <input id='DESTINATION' className='ant-input' type='text' ref={destination} placeholder="Destination" />
                                </Autocomplete>
                            </div>
                        </div>

                        {googleResponse &&
                            <RideAccept
                                distanceValue={googleResponse.routes[0].legs[0].distance.value}
                                distanceText={googleResponse.routes[0].legs[0].distance.text}
                                duration={googleResponse.routes[0].legs[0].duration.text}
                                currentBooking={currentBooking} />
                        }
                    </Col>
                    <Col span={19} style={{ padding: "10px" }} >
                        <div className='map-container'>
                            <GoogleMap
                                mapContainerStyle={{
                                    height: '600px',
                                    width: '100%'
                                }}
                                zoom={14}
                                onLoad={onLoad}
                                onUnmount={onUnmount}
                            >
                            </GoogleMap>

                        </div>
                    </Col>
                </Row>
            </div>
            <div>
                {googleResponse && <h3>Route Details</h3>}
                <div id="panel"></div>
            </div>
        </>
    ) : <></>
};
export default React.memo(RideRequestPage);
