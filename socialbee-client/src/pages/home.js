import React, {Component} from 'react';
// use this to make http requests to node (proxy setup in package.json)
import axios from 'axios';
import Grid from '@material-ui/core/Grid';


class Home extends Component {
    state = {
        buzzes: null
    };

    componentDidMount() {
        axios.get('/buzzes')
            .then((res) => {
            console.log(res.data);
                this.setState({
                    buzzes: res.data
                })
            })
            .catch((err) => console.log(err));
    }

    render() {
        let recentBuzzMarkup = this.state.buzzes ? (
            this.state.buzzes.map((buzz) => <p>{buzz.body}</p>)
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


