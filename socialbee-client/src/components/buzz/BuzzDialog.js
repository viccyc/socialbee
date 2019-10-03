import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types'; // ES6
import MyButton from '../../util/Mybutton';
import dayjs from 'dayjs';
// MUI Imports
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat';
// Redux imports
import { connect } from 'react-redux';
import { getBuzz, clearErrors } from "../../redux/actions/dataActions";
import LikeButton from "./LikeButton";
import Comments from './Comments';
import CommentForm from './CommentForm';

const Link = require("react-router-dom").Link;

const styles = (theme) => ({
    ...theme.mainTheme,
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
    },
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
    },
    profileInfo: {
        marginTop: 20
    }
});

class BuzzDialog extends Component {
    state = {
        open: false,
        oldPath: '',
        newPath: ''
    };
    componentDidMount() {
        if (this.props.openDialog) {
            this.handleOpen();
        }
    }
    handleOpen = () => {
        // update url with handle and buzz when dialog opens
        let oldPath = window.location.pathname;
        const { userHandle, buzzId } = this.props;
        const newPath = `/users/${userHandle}/buzz/${buzzId}`;

        if (oldPath === newPath) oldPath = `/users/${userHandle}`;

        window.history.pushState(null, null, newPath);

        this.setState({ open: true, oldPath, newPath });
        this.props.getBuzz(this.props.buzzId);
    };
    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);
        this.setState({ open: false });
        this.props.clearErrors();
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
                userHandle,
                comments
            },
            UI: {loading}
        } = this.props;

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={100}/>
            </div>
        ) : (
            <Grid container spacing={2}>
                <Grid item sm={5}>
                    <img src={userImage} alt="Profile" className={classes.profileImage}/>
                </Grid>
                <Grid item sm={7} className={classes.profileInfo}>
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
                    <LikeButton buzzId={buzzId}/>
                    <span>{likeCount} Likes</span>
                    <MyButton tip="Comment">
                        <ChatIcon color="primary"/>
                    </MyButton>
                    <span>{commentCount} Comments</span>
                </Grid>
                <hr className={classes.visibleSeparator}/>
                <CommentForm buzzId={buzzId}/>
                <Comments comments={comments}/>
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
    clearErrors: PropTypes.func.isRequired,
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
    getBuzz,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(BuzzDialog));

