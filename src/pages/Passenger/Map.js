import React, { useState, useRef, useCallback, useContext, useEffect } from 'react';
import { useJsApiLoader, GoogleMap, Autocomplete } from '@react-google-maps/api';
import { Col, Row } from 'antd';
import PickupRequest from './PickupRequest';
import { axiosGET } from '../../helper/axios.helper';
import { UserContext } from '../../context';

const Map = (props) => {
    const [ libraries ] = useState(['places']);
    const googleApiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleApiKey,
        libraries
    })
    const { user } = useContext(UserContext);
    let origin = useRef("");
    let destination = useRef("");
    const [googleResponse, setGoogleResponse] = useState(null);
    // const [map, setMap] = React.useState(null)
    let directionsService = useRef(null);
    let directionsRenderer = useRef(null);

    const onLoad = React.useCallback(function callback(map) {
        // const bounds = new window.google.maps.LatLngBounds(center);
        // map.fitBounds(bounds);
        // setMap(map)
        directionsService.current = new window.google.maps.DirectionsService();
        directionsRenderer.current = new window.google.maps.DirectionsRenderer({
            draggable: true,
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
                setGoogleResponse(directions);
            }
        });
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        // setMap(null)
    }, [])


    const [state, setState] = useState({
        travelMode: 'DRIVING',
        origin: '',
        destination: '',
    })
    const [currentBooking, setCurrentBooking] = useState(false);
    let autocompleteOrigin = null;
    let autocompleteDestination = null;


    useEffect(() => {
        axiosGET(`${process.env.REACT_APP_API_URL}/booking/current`)
            .then(response => {
                if (response.data.data._id) {
                    setCurrentBooking(response.data.data);
                    displayRoute(
                        response.data.data.origin.address,
                        response.data.data.destination.address,
                        directionsService.current,
                        directionsRenderer.current
                    );
                    origin.current.value = response.data.data.origin.address;
                    destination.current.value = response.data.data.destination.address;
                }
            })
            .catch(e => console.log(e));
    }, []);

    const onClick = useCallback(() => {
        if (origin.current.value !== '' && destination.current.value !== '') {
            setState({ ...state, origin: origin.current.value, destination: destination.current.value });
            displayRoute(
                origin.current.value,
                destination.current.value,
                directionsService.current,
                directionsRenderer.current
            );
        }
    }, [state])

    const originOnLoad = (autocomplete) => {
        // console.log('autocomplete: ', autocomplete)
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

    const displayRoute = (origin, destination, service, display) => {
        service
            .route({
                origin: origin,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
                avoidTolls: true,
            })
            .then((result) => {
                display.setDirections(result);
            })
            .catch((e) => {
                alert("Could not display directions due to: " + e);
            });
    }

    return isLoaded ? (
        <>
            <div>
                <Row>
                    <Col span={5} style={{ padding: "10px" }}>
                        <h3>Search Direction</h3>
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
                        <div className='margin-top-10'>
                            <button className='ant-btn ant-btn-primary ant-btn-lg ant-btn-block' type='button' onClick={onClick}>
                                Search Route
                            </button>
                        </div>

                        {googleResponse &&
                            <PickupRequest
                                pickupDetails={
                                    {
                                        from: {
                                            "lat": googleResponse.routes[0].legs[0].start_location.lat(),
                                            "lon": googleResponse.routes[0].legs[0].start_location.lng(),
                                            "address": googleResponse.routes[0].legs[0].start_address
                                        },
                                        to: {
                                            "lat": googleResponse.routes[0].legs[0].end_location.lat(),
                                            "lon": googleResponse.routes[0].legs[0].end_location.lng(),
                                            "address": googleResponse.routes[0].legs[0].end_address
                                        },
                                        distance: googleResponse.routes[0].legs[0].distance.value
                                    }
                                }
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
                                center={{
                                    lat: user.location.coordinates[1],
                                    lng: user.location.coordinates[0]
                                }}
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
export default React.memo(Map);
