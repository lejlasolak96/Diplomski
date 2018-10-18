import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';

// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Main styles for this application
import './scss/style.css';
// Containers
import {DefaultLayout} from './containers';
//Components
import Register from './components/Register';
import Login from './components/Login';

const Logout = () => {

    localStorage.removeItem('token');
    return <Redirect to = '/login'/>;
}

const PrivateRoute = ({component: Component, ...rest}) => (

    <Route {...rest} render = {(props) => (
        localStorage.getItem('token') !== null
            ? <Component {...props} />
            : <Redirect to = '/login'/>
    )}/>
)

class App extends Component {
    render() {
        return (
            <div id = {"main"}>
                <Router>
                    <Switch>
                        <Route exact path = "/login" name = "Login Page" component = {Login}/>
                        <Route exact path = "/register" name = "Register Page" component = {Register}/>
                        <PrivateRoute exact path = "/odjava" component = {Logout}/>
                        <PrivateRoute path = "/" name = "Home" component = {DefaultLayout}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;

