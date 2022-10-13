import React from 'react';
const ErrorPage = () => {
    return (
        <div style={{textAlign: "center", marginTop: "50px"}}>
            <h2>Backend API Server Error</h2>
            <p>HTTP 500 Internal Server Error</p>
            <p>Please make sure <b>{process.env.REACT_APP_API_URL}</b> is working properly or not</p>
        </div>
    );
};
export default ErrorPage;