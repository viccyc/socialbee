import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types'; // ES6
import MyButton from '../util/Mybutton';
// Redux imports
import { connect } from 'react-redux';
// MUI Imports
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import {postBuzz} from "../redux/actions/dataActions";

const styles = theme => ({
    ...theme.mainTheme,
    submitButton: {
        position: 'relative'
    },
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '90%',
        top: '10%'
    }
});

class PostBuzz extends Component {
    state = {
        open: false,
        body: '',
        errors: {}
    };
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            })
        }
    }
    handleOpen = () => {
        this.setState({ open: true });
    };
    handleClose = () => {
        this.setState({ open: false });
    };
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value})
    };
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.postBuzz({ body: this.state.body });
    };
    render() {
        const { errors } = this.state;
        const { classes, UI: { loading }} = this.props;
        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip="Post a Buzz!">
                    <AddIcon/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose}
                        fullWidth maxWidth="sm">
                    <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon/>
                    </MyButton>
                    <DialogTitle>Post a new Buzz</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                name="body"
                                type="text"
                                label="BUZZ!!"
                                multiline
                                rows="3"
                                placeholder="Buzz at your fellow beeees"
                                error={errors.comment ? true : false}
                                helperText={errors.comment}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                            />
                                <Button type="submit" variant="contained" color="primary"
                                        className={classes.submitButton} disabled={loading}>
                                    Submit
                                    {loading && (
                                        <CircularProgress size={30} className={classes.progressSpinner}/>
                                    )}
                                </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

PostBuzz.propTypes = {
    postBuzz: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    UI: state.UI
});

export default connect(mapStateToProps, { postBuzz })(withStyles(styles)(PostBuzz));

