import React, { Component} from "react";
import { Route, Navigate } from "react-router";
import authHelper from "./auth-helper";

const PrivateRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={routeProps => (
            authHelper.isAuthenticated() ? (
                <Component {...routeProps} />
            ) : (
                <Navigate to="/signin" state={{from: routeProps.location}} />
            )
        )} />
    );
}

export default PrivateRoute;