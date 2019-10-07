import React, { Fragment } from 'react';
import NoImg from '../images/no-img.png';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
// MUI imports
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const styles = (theme) => {

};

const BuzzSkeleton = (props) => {
    const { classes } = props;

    const content = Array.from({ length: 5 }).map((item, index) => (
       <Card className={classes.card} key={index}>
           <CardMedia className={classes.cover} image={NoImg}/>
           <CardContent className={classes.cardContent}>
               <div className={classes.handle}/>
               <div className={classes.date}/>
               <div className={classes.fullLine}/>
               <div className={classes.fullLine}/>
               <div className={classes.halfLine}/>
           </CardContent>
       </Card>
    ));
    return <Fragment>{content}</Fragment>
};

BuzzSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BuzzSkeleton);
