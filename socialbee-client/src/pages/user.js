import React, {Component} from 'react';
import axios from 'axios';
import Buzz from '../components/buzz/Buzz';
import {connect} from "react-redux";
import {signupUser} from "../redux/actions/userActions";
import PropTypes from 'prop-types';
import AppIcon from '../images/favicon.ico';

// MUI imports
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
// Redux imports
import { connect } from 'react-redux';
import { getUserData } from "../redux/actions/dataActions";
import Profile from "./home";

const Link = require("react-router-dom").Link;

class User extends Component {
    state = {
        profile: null
    };
    componentDidMount() {
        const handle = this.props.match.params.handle;
        this.props.getUserData(handle);
        axios.get(`/user/${handle}`)
            .then((res) => {
                this.setState({
                    profile: res.data.user
                })
            })
            .catch((err) => console.log(err));
    }
    render() {
        const { buzzes, loading } = this.props.data;
        const buzzesMarkup  = loading ? (
            <p>Loading data....</p>
        ) : buzzes === null ? (
            <p>No buzzes for this user yet</p>
        ) : (
            buzzes.map(buzz => <Buzz key={buzz.buzzId} buzz={buzz}/>)
        );
        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {buzzesMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <StaticProfile profile={this.state.profile}/>
                </Grid>
            </Grid>
        );
    }
}

User.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    data: state.data
});

export default connect(mapStateToProps, { getUserData })(User);
