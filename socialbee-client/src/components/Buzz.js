import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import MyButton from '../util/Mybutton';

// MUI imports
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
// Icons
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
// Redux
import { connect } from 'react-redux';
import { likeBuzz, unlikeBuzz } from "../redux/actions/dataActions";

const Link = require("react-router-dom").Link;

const styles = {
    card: {
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
    // check if it has likes, and if they belong to user
    likedBuzz = () => {
        console.log('Have I liked this one?:', this.props.user.likes.find(like => like.buzzId === this.props.buzz.buzzId));

        if (this.props.likes && this.props.user.likes.find(like => like.buzzId === this.props.buzz.buzzId)) {
            console.log('I liked this one!!');
            return true;
        } else return false;
    };
    likeBuzz = () => {
        this.props.likeBuzz(this.props.buzz.buzzId);
    };
    unlikeBuzz = () => {
        this.props.unlikeBuzz(this.props.buzz.buzzId);
    };
    render() {
        dayjs.extend(relativeTime);
        const { classes,
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
                authenticated
            }
        } = this.props;
        const likeButton = !authenticated ? (
            <MyButton tip="Like">
                <Link to="/login">
                    <FavoriteBorder color="primary"/>
                </Link>
            </MyButton>
        ) : this.likedBuzz() ? (
            <MyButton tip="Undo like" onClick={this.unlikeBuzz}>
                <FavoriteIcon color="primary"/>
            </MyButton>
        ) : (
            <MyButton tip="Like" onClick={this.likeBuzz}>
                <FavoriteBorder color="primary"/>
            </MyButton>
        );
        return (
            <Card className={classes.card}>
                <CardMedia className={classes.image} image={userImage} title="Profile Image" />
                <CardContent className={classes.content}>
                    <Typography variant="h5"
                        component={Link}
                        to={`/users/${userHandle}`}
                        color="primary">
                        {userHandle}
                    </Typography>
                    <Typography variant="body1">{body}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    {likeButton}
                    <span>{likeCount} Likes</span>
                    <MyButton tip="Comment">
                        <ChatIcon color="primary"/>
                    </MyButton>
                    <span>{commentCount} Comments</span>
                </CardContent>
            </Card>
        )
    }
}

Buzz.propTypes = {
    likeBuzz: PropTypes.func.isRequired,
    unlikeBuzz: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    buzz: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = {
    likeBuzz,
    unlikeBuzz
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Buzz));
