import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import dayjs from 'dayjs';
// MUI imports
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
// Redux
import { connect } from 'react-redux';
import { logoutUser, uploadImage } from "../redux/actions/userActions";
const Link = require("react-router-dom").Link;

const styles = (theme) => ({
    ...theme.profileTheme
});

class Profile extends Component {
    handleImageChange = (event) => {
        const image = event.target.files[0];
        const formData = new FormData();
        formData.append('image', image, image.name);
        this.props.uploadImage(formData);
    };
    handleEditPicture = () => {
        const fileInput = document.getElementById('imageUpload');
        fileInput.click();
    };
    handleLogout = () => {
        this.props.logoutUser();
    };
    render() {
        const {
            classes,
            user: {
                credentials: {handle, createdAt, imageUrl, bio, website, location},
                loading,
                authenticated
            }
        } = this.props;
        let profileMarkup = !loading ? (authenticated ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img src={imageUrl} alt="profile" className="profile-image"/>
                        <input type="file" id="imageUpload"
                               hidden="hidden"
                               onChange={this.handleImageChange}
                        />
                        <Tooltip title="Edit profile picture" placement="top">
                            <IconButton onClick={this.handleEditPicture} className="button">
                                <EditIcon color="primary"/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <hr/>
                    <div className="profile-details">
                        <MuiLink component={Link} to={`/users/${handle}`}
                                 color="primary" variant="h5">
                            @{handle}
                        </MuiLink>
                        <hr/>
                        {bio && <Typography variant="body2">{bio}</Typography>}
                        <hr/>
                        {location && (
                            <Fragment>
                                <LocationOn color="primary"/>
                                <span>{location}</span>
                                <hr/>
                            </Fragment>
                        )}
                        {website && (
                            <Fragment>
                                <LinkIcon color="primary"/>
                                <a href={website} target="_blank" rel="noopener noreferrer">
                                    {' '}{website}
                                </a>
                                <hr/>
                            </Fragment>
                        )}
                        <CalendarToday color="primary"/>{' '}
                        <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                    </div>
                    <Tooltip title="Logout">
                        <IconButton onClick={this.handleLogout}>
                            <KeyboardReturn color="primary"/>
                        </IconButton>
                    </Tooltip>
                </div>
            </Paper>
        ) : (
            <Paper className={classes.paper}>
                <Typography variant="body2" align="center">
                    No profile found, please login again
                </Typography>
                <div className={classes.buttons}>
                    <Button variant="contained" color="primary" component={Link} to="/login">
                        Login
                    </Button>
                    <Button variant="contained" color="secondary" component={Link} to="/signup">
                        Signup
                    </Button>
                </div>
            </Paper>
        )) : (<p>loading....</p>);
        return profileMarkup;
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = { logoutUser, uploadImage };

Profile.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));
