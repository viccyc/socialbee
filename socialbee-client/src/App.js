import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

// Components
import Navbar from "./components/Navbar";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#d05ce3',
            main: '#9c27b0',
            dark: '#6a0080',
            contrastText: '#fff',
        },
        secondary: {
            light: '#b47cff',
            main: '#7c4dff',
            dark: '#3f1dcb',
            contrastText: '#fff',
        },
    },
});

class App extends Component {
    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <Router>
                        <Navbar/>
                        <div className="container">
                            <Switch>
                                <Route exact path="/" component={home}/>
                                <Route exact path="/login" component={login}/>
                                <Route exact path="/signup" component={signup}/>
                            </Switch>
                        </div>
                    </Router>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
