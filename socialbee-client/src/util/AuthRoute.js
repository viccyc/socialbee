import React, {Component} from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
});

AuthRoute.propTypes = {
    user: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(AuthRoute);


