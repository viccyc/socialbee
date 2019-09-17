import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
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
import { signupUser } from "../redux/actions/userActions";

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
            errors: {}
        }
    }
    // need to set state if there are errors as they don't get set straight away
    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.UI.errors) {
            this.setState({ errors: nextProps.UI.errors });
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
        this.props.signupUser(newUserData, this.props.history);
    };
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const { classes, UI: { loading } } = this.props;
        const { errors } = this.state;

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
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    UI:state.UI
});

export default connect(mapStateToProps, { signupUser })(withStyles(styles)(Signup));


