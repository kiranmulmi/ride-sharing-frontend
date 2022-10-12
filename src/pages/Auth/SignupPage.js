import React, { useState, useEffect, useRef } from "react";
import logo from '../../logo.svg'
import { Button, Radio, Space, Alert } from 'antd';
import { axiosGET, axiosPOST } from '../../helper/axios.helper';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { UserConstant } from "../../constants";
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

const SignupPage = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        libraries: ["places"]
    })

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState({
        id: "",
        email: "",
        name: "",
        type: "",
        active: "",
        location: {}
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [userType, setUserType] = useState(UserConstant.userType.PASSENGER);

    let autocompleteOrigin = useRef(null);
    let origin = useRef("");

    useEffect(() => {
        // HANDELING OAUTH REDIRECTION
        const accessToken = searchParams.get('access_token');
        if (accessToken) {
            localStorage.setItem("access_token", accessToken);
            axiosGET(`${process.env.REACT_APP_API_URL}/auth/jwt/user`)
                .then(response => {
                    setErrorMessage("")
                    if (response.data.data.type && response.data.data.location && response.data.data.location.type) {
                        navigate('/', { replace: true })
                    }
                    // localStorage.setItem('user', JSON.stringify(response.data));
                    setUser(response.data.data);
                })
                .catch(e => console.log(e));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const options = [
        { label: 'Passenger', value: UserConstant.userType.PASSENGER },
        { label: 'Rider', value: UserConstant.userType.RIDER }
    ];

    const onChange4 = ({ target: { value } }) => {
        setUserType(value);
    };

    const handleSubmitClick = () => {
        try {
            let updatingUser = { ...user };
            updatingUser.type = userType;
            updatingUser.active = 1;
            if (origin.current.value) {
                updatingUser.location = {
                    type: 'Point',
                    coordinates: [
                        autocompleteOrigin.current.getPlace().geometry.location.lng(),
                        autocompleteOrigin.current.getPlace().geometry.location.lat()
                    ]
                }
            }
            if (!updatingUser.location) {
                throw new Error("Location field is required");
            }
            if (updatingUser.type === "") {
                throw new Error("Select rider type");
            }
            setErrorMessage("");
            axiosPOST(`${process.env.REACT_APP_API_URL}/user/completeSignup`, {
                id: user.id,
                type: userType,
                location: updatingUser.location
            })
                .then((response) => {
                    localStorage.setItem('access_token', response.data.data.accessToken);
                    // localStorage.setItem('user', JSON.stringify(updatingUser));
                    setUser(updatingUser);
                    navigate("/", { replace: true });
                })
                .catch(err => {
                    console.log(err)
                })
        } catch (e) {
            setErrorMessage(e.message);
        }
    }

    const originOnLoad = (autocomplete) => {
        console.log('autocomplete: ', autocomplete)
        autocompleteOrigin.current = autocomplete;
    }

    const originOnPlaceChanged = () => {
        if (autocompleteOrigin.current !== null) {
            // console.log(autocompleteOrigin.getPlace())
        } else {
            console.log('Autocomplete origin is not loaded yet!')
        }
    }

    return isLoaded ? (
        <div className="complete-signup-wrap">
            <div><img src={logo} className="App-logo" alt="logo" height={70} /></div>
            <div><h2>Welcome to Ride Sharing App</h2></div>
            <Space direction="vertical">
                <h3>Hi, {user.name}</h3>
                {errorMessage !== "" && <Alert message={errorMessage} type="error" />}
                <div>
                    <label>You are a </label>
                    <Radio.Group
                        options={options}
                        onChange={onChange4}
                        value={userType}
                    />
                </div>
                <div>
                    <Autocomplete
                        onLoad={originOnLoad}
                        onPlaceChanged={originOnPlaceChanged}
                    >
                        <input id='location' className='ant-input' type='text' ref={origin} placeholder="You Location" />
                    </Autocomplete>
                </div>
                <div>
                    <Button
                        type="primary"
                        onClick={handleSubmitClick}> Complete Signup</Button>
                </div>
            </Space>
        </div>
    ) : <></>
}

export default SignupPage;