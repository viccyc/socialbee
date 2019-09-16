import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/favicon.ico';
import axios from 'axios';

// MUI imports
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const Link = require("react-router-dom").Link;

const styles = (theme) => ({
    ...theme.spreadTheme
});

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            handle: '',
            loading: false,
            errors: {}
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        };
        axios.post('/signup', newUserData)
            .then((res) => {
                console.log(res.data);
                localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`);
                this.setState({
                    loading: false
                });
                this.props.history.push('/');
            })
            .catch((err) => {
                this.setState({
                    errors: err.response.data,
                    loading: false
                })
            })
    };
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const { classes } = this.props;
        const { errors, loading } = this.state;

        return (
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm>
                    <img className={classes.image} src={ AppIcon } alt="app icon"/>
                    <Typography variant="h2" className={classes.pageTitle}>
                        Signup
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField className={classes.textField}
                                   id="email" name="email"
                                   type="email" label="Email"
                                   value={this.state.email}
                                   helperText={errors.email}
                                   error={errors.email ? true : false}
                                   onChange={this.handleChange}
                                   fullWidth/>
                        <TextField className={classes.textField}
                                   id="password" name="password"
                                   type="password" label="password"
                                   value={this.state.password}
                                   helperText={errors.password}
                                   error={errors.password ? true : false}
                                   onChange={this.handleChange}
                                   fullWidth/>
                        <TextField className={classes.textField}
                                   id="confirmPassword" name="confirmPassword"
                                   type="password" label="Confirm Password"
                                   value={this.state.confirmPassword}
                                   helperText={errors.confirmPassword}
                                   error={errors.confirmPassword ? true : false}
                                   onChange={this.handleChange}
                                   fullWidth/>
                        <TextField className={classes.textField}
                                   id="handle" name="handle"
                                   type="text" label="Handle"
                                   value={this.state.handle}
                                   helperText={errors.handle}
                                   error={errors.handle ? true : false}
                                   onChange={this.handleChange}
                                   fullWidth/>
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button className={classes.button} type="submit"
                                variant="contained" color="primary"
                                disabled={loading}>
                            Signup
                            {loading && (
                                <CircularProgress size={30} className={classes.progress}/>
                            )}
                        </Button>
                        <br/>
                        <br/>
                        <small>Already have an account? Login <Link to="/login">here</Link></small>
                    </form>
                </Grid>
                <Grid item sm/>
            </Grid>
        );
    }
}

Signup.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Signup);


