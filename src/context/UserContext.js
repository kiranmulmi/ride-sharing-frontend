import React, { createContext, useEffect, useState } from 'react'
import { axiosGET } from '../helper/axios.helper';
export const UserContext = createContext();

const UserContextProvider = (props) => {
    const [user, setUser] = useState({
        id: "",
        email: "",
        name: "",
        active: 1,
        type: "",
        location: {}
    })
    useEffect(() => {
        axiosGET(`${process.env.REACT_APP_API_URL}/auth/jwt/user`)
            .then((response) => {
                setUser({
                    id: response.data.data.id,
                    email: response.data.data.email,
                    name: response.data.data.name,
                    active: response.data.data.active,
                    type: response.data.data.type,
                    location: response.data.data.location,
                });
            })
            .catch(err => {
                console.log(err)
            })

    }, []);
    return (
        <UserContext.Provider value={{user, setUser}}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;