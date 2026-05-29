import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    // If token is not available, redirect to login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // If token exists, allow access to the route
    return children;
};

export default PrivateRoute;
