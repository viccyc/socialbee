import React, {Component} from 'react';
// use this to make http requests to node (proxy setup in package.json)
import axios from 'axios';
import Grid from '@material-ui/core/Grid';

import Buzz from '../components/Buzz';
import Profile from '../components/Profile';

class Home extends Component {
    state = {
        buzzes: null
    };

    componentDidMount() {
        axios.get('/buzzes')
            .then((res) => {
                this.setState({
                    buzzes: res.data
                });
            })
            .catch((err) => console.log(err));
    }

    render() {
        let recentBuzzMarkup = this.state.buzzes ? (
            this.state.buzzes.map((buzz) => <Buzz key={buzz.buzzId} buzz={buzz}/>)
        ) : (
            <p>Loading.......</p>
        );
        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {recentBuzzMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <p>Profile...</p>
                </Grid>
            </Grid>
        );
    }
}

export default Home;


