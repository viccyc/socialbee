import React, {Component, Fragment} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
// MUI stuff
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
// Icons
import NotificationsIcon from '@material-ui/icons/Notifications';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';
// Redux
import { connect } from 'react-redux';
import { markNotificationsRead } from '../../redux/actions/userActions';

const Link = require("react-router-dom").Link;

class Notifications extends Component {
    state = {
        anchorEl: null
    };
    render() {
        const notifications = this.props.notifications;
        const anchorEl = this.state.anchorEl;

        dayjs.extend(relativeTime);

        let notificationsIcon;
        // check how many notifications haven't been read yet and put # by icon
        if (notifications && notifications.length > 0) {
            notifications.filter(notif => notif.read === false).length > 0
                ? notificationsIcon = (
                    <Badge
                        badgeContent={notifications.filter(notif => notif.read === false).length}
                        color="secondary">
                        <NotificationsIcon/>
                    </Badge>
                ) : (
                    notificationsIcon = <NotificationsIcon/>
                )
        } else {
            notificationsIcon = <NotificationsIcon/>
        }
        let notificationsMarkup =
            notifications && notifications.length > 0 ? (
                notifications.map((notif) => {
                    const verb = notif.type === 'like' ? 'liked' : 'commented on';
                    const time = dayjs(notif.createdAt).fromNow();
                    const iconColor = notif.read ? 'primary' : 'secondary';
                    const icon = notif.type === 'like' ? (
                        <FavoriteIcon color={iconColor} style={{ marginRight: 10 }}/>
                    ) : (
                        <ChatIcon color={iconColor} style={{ marginRight: 10}}/>
                    );
                    return (
                        <MenuItem key={notif.createdAt} onClick={this.handleClose}>
                            {icon}
                            <Typography
                                component={Link}
                                color="default"
                                variant="body1"
                                to={`/users/${notif.recipient}/buzz/${notif.buzzId}`}
                            >
                                {notif.sender} {verb} your buzz {time}
                            </Typography>
                        </MenuItem>
                    )
                })
            ) : (
                <MenuItem onClick={this.handleClose}>
                    You have no notifications yet
                </MenuItem>
            );
        return (
            <Fragment>
                <Tooltip title="Nofifications" placement="top">
                    <IconButton
                        aria-owns={anchorEl ? 'simple-menu' : undefined}
                        aria-haspopups="true"
                        onClick={this.handleOpen}
                    >
                        {notificationsIcon}
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                    onEntered={this.onMenuOpened}
                >
                    {notificationsMarkup}
                </Menu>
            </Fragment>
        )
    }
}

Notifications.propTypes = {
    markNotificationsRead: PropTypes.func.isRequired,
    notifications: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    notifications: state.user.notifications
});

export default connect(mapStateToProps, { markNotificationsRead })(Notifications);
