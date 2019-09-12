import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
// import Link from 'react-router-dom/Link';

// MUI imports
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

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
        padding: 25
    }
};

class Buzz extends Component {
    render() {
        const { classes,
            buzz: {
                body,
                createdAt,
                userImage,
                userHandle,
                buzzId,
                likeCount,
                commentCount
            }
        } = this.props;
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
                        {createdAt}
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles)(Buzz);
