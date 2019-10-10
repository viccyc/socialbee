import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import MyButton from '../../util/Mybutton';
import DeleteBuzz from './DeleteBuzz';
import BuzzDialog from './BuzzDialog';
import LikeButton from './LikeButton';
// MUI imports
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
// Icons
import ChatIcon from '@material-ui/icons/Chat';
// Redux
import { connect } from 'react-redux';

const Link = require("react-router-dom").Link;

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image: {
        height: 150,
        width: 150
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
};

class Buzz extends Component {
    render() {
        dayjs.extend(relativeTime);
        const {
            classes,
            buzz: {
                body,
                createdAt,
                userImage,
                userHandle,
                buzzId,
                likeCount,
                commentCount
            },
            user: {
                authenticated,
                credentials: { handle }
            }
        } = this.props;

        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteBuzz buzzId={buzzId}/>
        ) : null;
        return (
            <Card className={classes.card}>
                <CardMedia
                    className={classes.image}
                    image={userImage}
                    title="Profile Image" />
                <CardContent className={classes.content}>
                    <Typography variant="h5"
                        component={Link}
                        to={`/users/${userHandle}`}
                        color="primary">
                        {userHandle}
                    </Typography>
                    <Typography variant="body1">{body}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        {/*Need to take away a fraction of a sec so that it didn't show in the future*/}
                        {dayjs(createdAt).add(-0.3, 'second').fromNow()}
                    </Typography>
                    <LikeButton buzzId={buzzId}/>
                    <span>{likeCount} Likes</span>
                    <MyButton tip="Comment">
                        <ChatIcon color="primary"/>
                    </MyButton>
                    <span>{commentCount} Comments</span>
                    {deleteButton}
                    <BuzzDialog buzzId={buzzId} userHandle={userHandle} openDialog={this.props.openDialog}/>
                </CardContent>
            </Card>
        )
    }
}

Buzz.propTypes = {
    user: PropTypes.object.isRequired,
    buzz: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
};

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Buzz));
