import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types'; // ES6
import MyButton from '../util/Mybutton';
import dayjs from 'dayjs';
// MUI Imports
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
// Redux imports
import { connect } from 'react-redux';
import { getBuzz } from "../redux/actions/dataActions";

const Link = require("react-router-dom").Link;

const styles = (theme) => ({
    ...theme.mainTheme,
    invisibleSeparator: {
        border: 'none',
        margin: 4
    },
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        left: '90%'
    }
});

class BuzzDialog extends Component {
    state = {
        open: false
    };
    handleOpen = () => {
        this.setState({ open: true });
        this.props.getBuzz(this.props.buzzId);
    };
    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const {
            classes,
            buzz: {
                buzzId,
                body,
                createdAt,
                likeCount,
                commentCount,
                userImage,
                userHandle
            },
            UI: {loading}
        } = this.props;

        const dialogMarkup = loading ? (
            <CircularProgress size={20}/>
        ) : (
            <Grid container spacing={2}>
                <Grid item sm={5}>
                    <img src={userImage} alt="Profile" className={classes.profileImage}/>
                </Grid>
                <Grid item sm={7}>
                    <Typography
                        component={Link}
                        color="primary"
                        variant="h5"
                        to={`/users/${userHandle}`}
                    >
                        @{userHandle}
                    </Typography>
                    <hr className={classes.invisibleSeparator}/>
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSeparator}/>
                    <Typography variant="body1">
                        {body}
                    </Typography>
                </Grid>
            </Grid>
        );
        return (
            <Fragment>
                <MyButton onClick={this.handleOpen}
                          tip="Expand buzz"
                          tipClassName={classes.expandButton}>
                    <UnfoldMore color="primary"/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose}
                        fullWidth maxWidth="sm">
                    <MyButton tip="Close" onClick={this.handleClose}
                              tipClassName={classes.closeButton}>
                        <CloseIcon/>
                    </MyButton>
                    <DialogContent className={classes.DialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

BuzzDialog.propTypes = {
    getBuzz: PropTypes.func.isRequired,
    buzzId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    buzz: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    buzz: state.data.buzz,
    UI: state.UI
});

const mapActionsToProps = {
    getBuzz
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(BuzzDialog));

