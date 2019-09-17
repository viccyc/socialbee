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
import { loginUser } from "../redux/actions/userActions";

const Link = require("react-router-dom").Link;

const styles = (theme) => ({
    ...theme.spreadTheme
});

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
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
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(userData, this.props.history);
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
                        Login
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
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button className={classes.button} type="submit"
                                variant="contained" color="primary"
                                disabled={loading}>
                            Login
                            {loading && (
                                <CircularProgress size={30} className={classes.progress}/>
                            )}
                        </Button>
                        <br/>
                        <br/>
                        <small>Don't have an account? Sign up <Link to="/signup">here</Link></small>
                    </form>
                </Grid>
                <Grid item sm/>
            </Grid>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
   user: state.user,
   UI: state.UI
});

const mapActionsToProps = {
    loginUser
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Login));


