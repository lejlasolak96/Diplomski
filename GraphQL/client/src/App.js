import React, {Component} from 'react';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import {API_ROOT} from "./api-config";

// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Main styles for this application
import './scss/style.css'

// Containers
import {DefaultLayout} from './containers';

//components
import Register from './components/Register';
import Login from './components/Login';

//apollo client setup
const client = new ApolloClient({
    uri: API_ROOT,
    request: operation => {
        operation.setContext({
            headers: {
                authorization: `Bearer ` + localStorage.getItem('token')
            },
        });
    }
});

const Logout = () => {
    localStorage.removeItem('token');
    return <Redirect to = '/login'/>;
};

const PrivateRoute = ({component: Component, ...rest}) => (

    <Route {...rest} render = {(props) => (
        localStorage.getItem('token') !== null
            ? <Component {...props} />
            : <Redirect to = '/login'/>
    )}/>
);

class App extends Component {
    render() {
        return (
            <ApolloProvider client = {client}>
                <div id = {"main"}>
                    <Router>
                        <Switch>
                            <Route exact path = "/login" name = "Login Page" component = {Login}/>
                            <PrivateRoute exact path = "/odjava" component = {Logout}/>
                            <Route exact path = "/register" name = "Register Page" component = {Register}/>
                            <PrivateRoute path = "/" name = "Home" component = {DefaultLayout}/>
                        </Switch>
                    </Router>
                </div>
            </ApolloProvider>
        );
    }
}

export default App;

