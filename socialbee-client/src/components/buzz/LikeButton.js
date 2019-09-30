import React, {Component} from 'react';
import MyButton from '../../util/Mybutton';
import PropTypes from 'prop-types';
// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
// Redux
import { connect } from 'react-redux';
import { likeBuzz, unlikeBuzz } from "../../redux/actions/dataActions";

const Link = require("react-router-dom").Link;


class LikeButton extends Component {
    // check if it has likes, and if they belong to user
    likedBuzz = () => {
        return (this.props.likeBuzz &&
            this.props.user.likes.find
            (like => like.buzzId === this.props.buzzId));
    };
    likeBuzz = () => {
        this.props.likeBuzz(this.props.buzzId);
    };
    unlikeBuzz = () => {
        this.props.unlikeBuzz(this.props.buzzId);
    };
    render() {
        const { authenticated } = this.props.user;
        const likeButton = !authenticated ? (
            <Link to="/login">
                <MyButton tip="Like">
                        <FavoriteBorder color="primary"/>
                </MyButton>
            </Link>
        ) : this.likedBuzz() ? (
            <MyButton tip="Undo like" onClick={this.unlikeBuzz}>
                <FavoriteIcon color="primary"/>
            </MyButton>
        ) : (
            <MyButton tip="Like" onClick={this.likeBuzz}>
                <FavoriteBorder color="primary"/>
            </MyButton>
        );
        return likeButton;
    }
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    buzzId: PropTypes.string.isRequired,
    likeBuzz: PropTypes.func.isRequired,
    unlikeBuzz: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
   user: state.user
});

const mapActionsToProps = {
    likeBuzz,
    unlikeBuzz
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
