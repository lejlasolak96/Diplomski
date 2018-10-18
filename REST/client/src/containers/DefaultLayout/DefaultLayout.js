import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Col, Container, Row} from 'reactstrap';
import {API_ROOT} from "../../api-config";

import {
    AppBreadcrumb,
    AppFooter,
    AppHeader,
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    AppSidebarNav,
} from '@coreui/react';

// sidebar nav config
import navigation from '../../routes/_nav';

// routes config
import routes from '../../routes/routes';
import studentRoutes from '../../routes/studentRoutes';
import teacherRoutes from '../../routes/teacherRoutes';
import adminRoutes from '../../routes/adminRoutes';

import DefaultHeader from './DefaultHeader';
import DefaultFooter from './DefaultFooter';
import Page404 from '../../components/Page404';
import Dashboard from "../../views/Dashboard/Dashboard";

class DefaultLayout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            prijavljenaOsoba: undefined
        };
    }

    componentDidMount() {
        this.getLoggedInUser();
    }

    async getLoggedInUser() {

        let user = {};

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        let request = new Request(API_ROOT + '/korisnici/prijavljeniKorisnik', options);

        await fetch(request)
            .then(res => res.json())
            .then(json => {
                if (json.korisnik) {
                    user = json.korisnik;
                }
                else {
                    user = null;
                }
            })
			.catch(err => {
				console.log(err);
			});

        await fetch(API_ROOT + '/korisnici/prijavljeniKorisnik/privilegije', options)
            .then(result => result.json())
            .then(data => {
                if (data.privilegije && user) {
                    user.privilegije = data.privilegije;
                }
                this.setState({prijavljenaOsoba: user});
            })
            .catch(err => {
                console.log(err);
            });
    }

    display = () => {

        let nav = {items: []};
        let opcije = navigation.items[1];

        navigation.items.map(item => {
            if (item !== opcije) nav.items.push(item);
            else nav.items.push({
                name: "Opcije",
                url: "/opcije",
                children: []
            });
        });

        if (this.state.prijavljenaOsoba) {

            this.state.prijavljenaOsoba.privilegije.map((privilegija) => {
                opcije.children.map(opcija => {
                    if (opcija.url === "/" + privilegija.vrstaKorisnika.naziv)
                        nav.items[1].children.push(opcija);
                })
            });

            return (
                <AppSidebarNav navConfig = {nav} {...this.props} />
            )
        }
    }

    setRoutes = () => {

        if (!localStorage.getItem('token')) return <Redirect to = '/odjava'/>;

        if (this.state.prijavljenaOsoba) {

            return (
                routes.map((route, idx) => {
                        return route.component ?
                            (
                                <Route key = {idx} path = {route.path} exact = {route.exact} name = {route.name}
                                       render = {props => (
                                           <route.component {...props} />
                                       )}
                                />
                            )
                            : (null);
                    },
                )
            )
        }
    }

    setTeacherRoutes = () => {

        let ok = false;

        if (this.state.prijavljenaOsoba) {

            this.state.prijavljenaOsoba.privilegije.map(p => {
                if (p.vrstaKorisnika.naziv === "nastavnik") ok = true;
            });

            if (ok) {
                return (
                    teacherRoutes.map((route, idx) => {
                            return route.component ?
                                (
                                    <Route key = {idx} path = {route.path} exact = {route.exact} name = {route.name}
                                           render = {props => (
                                               ok ? <route.component {...props} />
                                                   :
                                                   <div className = "app flex-row align-items-center">
                                                       <Container>
                                                           <Row className = "justify-content-center">
                                                               <Col md = "6">
                                                                   <div className = "clearfix">
                                                                       <h4>Niste prijavljeni kao nastavnik</h4>
                                                                   </div>
                                                               </Col>
                                                           </Row>
                                                       </Container>
                                                   </div>
                                           )}
                                    />
                                )
                                : (null);
                        },
                    )
                );
            }
        }
    }

    setAdminRoutes = () => {

        let ok = false;

        if (this.state.prijavljenaOsoba) {

            this.state.prijavljenaOsoba.privilegije.map(p => {
                if (p.vrstaKorisnika.naziv === "admin") ok = true;
            });

            if (ok) {
                return (
                    adminRoutes.map((route, idx) => {
                            return route.component ?
                                (
                                    <Route key = {idx} path = {route.path} exact = {route.exact} name = {route.name}
                                           render = {props => (
                                               ok ? <route.component {...props} />
                                                   :
                                                   <div className = "app flex-row align-items-center">
                                                       <Container>
                                                           <Row className = "justify-content-center">
                                                               <Col md = "6">
                                                                   <div className = "clearfix">
                                                                       <h4>Niste prijavljeni kao administrator</h4>
                                                                   </div>
                                                               </Col>
                                                           </Row>
                                                       </Container>
                                                   </div>
                                           )}
                                    />
                                )
                                : (null);
                        },
                    )
                );
            }
        }
    }

    setStudentRoutes = () => {

        let ok = false;

        if (this.state.prijavljenaOsoba) {

            this.state.prijavljenaOsoba.privilegije.map(p => {
                if (p.vrstaKorisnika.naziv === "student") ok = true;
            });

            if (ok) {
                return (
                    studentRoutes.map((route, idx) => {
                            return route.component ?
                                (
                                    <Route key = {idx} path = {route.path} exact = {route.exact} name = {route.name}
                                           render = {props => (
                                               ok ? <route.component {...props} />
                                                   :
                                                   <div className = "app flex-row align-items-center">
                                                       <Container>
                                                           <Row className = "justify-content-center">
                                                               <Col md = "6">
                                                                   <div className = "clearfix">
                                                                       <h4>Niste prijavljeni kao student</h4>
                                                                   </div>
                                                               </Col>
                                                           </Row>
                                                       </Container>
                                                   </div>
                                           )}
                                    />
                                )
                                : (null);
                        },
                    )
                );
            }
        }
    }

    render() {

        if (!localStorage.getItem('token')) return <Redirect to = '/odjava'/>;
        if (localStorage.getItem('token') && this.state.prijavljenaOsoba === null) return <Redirect to = "/odjava"/>;
        if (!localStorage.getItem('token')) return <Redirect to = "/odjava"/>;

        return (
            <div className = "app">
                <AppHeader fixed>
                    <DefaultHeader/>
                </AppHeader>
                <div className = "app-body">
                    <AppSidebar fixed display = "lg">
                        <AppSidebarHeader/>
                        <AppSidebarForm/>
                        {this.display()}
                        <AppSidebarFooter/>
                        <AppSidebarMinimizer/>
                    </AppSidebar>
                    <main className = "main">
                        <AppBreadcrumb/>
                        <Container fluid>
                            <Switch>
                                {this.setRoutes()}
                                {this.setTeacherRoutes()}
                                {this.setAdminRoutes()}
                                {this.setStudentRoutes()}
                                <Route path = "/" exact component = {Dashboard}/>
                                <Route path = "*" component = {Page404}/>
                            </Switch>
                        </Container>
                    </main>
                </div>
                <AppFooter>
                    <DefaultFooter/>
                </AppFooter>
            </div>
        );
    }
}

export default DefaultLayout;
