import React from "react";
import { useAuth } from "./useAuth";
import { Navigate, useLocation } from "react-router-dom";

export function RequireAuth({ children, token, accepted }) {
    let auth = useAuth();
    let location = useLocation();
    const role = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))?.role : ''

    if (!auth.token && !token) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    
    if(accepted !== role){
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}