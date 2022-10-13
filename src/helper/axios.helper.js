import axios from "axios";

export const axiosGET = (URL) => {
    return new Promise((resolve, reject) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            axios.get(URL, { headers: { Authorization: accessToken } })
                .then(response => {
                    resolve(response)
                })
                .catch((error) => {
                    console.log(error);
                    if(error.response.status === 401) {
                        window.location = '/login'
                    } else if (error.code === 'ERR_NETWORK' || error.response.status === 500) {
                        window.location = '/serverError'
                    }
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

export const axiosPOST = (URL, data) => {
    return new Promise((resolve, reject) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            axios.post(URL, data, { headers: { Authorization: accessToken } })
                .then(response => {
                    console.log("fsadfsdafsd")
                    resolve(response)
                })
                .catch((error) => {
                    console.log(error);
                    if(error.response.status === 401) {
                        window.location = '/login'
                    } else if (error.code === 'ERR_NETWORK' || error.response.status === 500) {
                        window.location = '/serverError'
                    }
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

export const axiosPATCH = (URL, data) => {
    return new Promise((resolve, reject) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            axios.patch(URL, data, { headers: { Authorization: accessToken } })
                .then(response => {
                    resolve(response)
                })
                .catch((error) => {
                    console.log(error);
                    if(error.response.status === 401) {
                        window.location = '/login'
                    } else if (error.code === 'ERR_NETWORK' || error.response.status === 500) {
                        window.location = '/serverError'
                    }
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}