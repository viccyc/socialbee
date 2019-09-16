import React, {Component} from 'react';
import { Route, Redirect } from 'react-router-dom';

// if not authenticated, will redirect to either login or signup component
// - depending which is passed (spread the ...rest of the properties which have been added)
const AuthRoute = ({ component: Component, authenticated, ...rest })=> (
    <Route
        {...rest}
        render={(props) =>
            authenticated === true ? <Redirect to={'/'}/> : <Component {...props}/>
        }
    />
);

export default AuthRoute;


