import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {graphql, Query} from 'react-apollo';
import {Col, Container, Row} from 'reactstrap';

import {getLoggedInUser} from '../../queries/queries';

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

        const {prijavljenaOsoba} = this.props.data;

        if (prijavljenaOsoba) {

            prijavljenaOsoba.privilegije.map((privilegija) => {
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

        const {prijavljenaOsoba} = this.props.data;

        if (!this.props.data.loading) {
            if (prijavljenaOsoba) {

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
    }

    setTeacherRoutes = () => {

        let ok = false;
        const {prijavljenaOsoba} = this.props.data;

        if (prijavljenaOsoba) {

            prijavljenaOsoba.privilegije.map(p => {
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
        const {prijavljenaOsoba} = this.props.data;

        if (prijavljenaOsoba) {

            prijavljenaOsoba.privilegije.map(p => {
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
        const {prijavljenaOsoba} = this.props.data;

        if (prijavljenaOsoba) {

            prijavljenaOsoba.privilegije.map(p => {
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

        const {prijavljenaOsoba} = this.props.data;

        if(!this.props.data.loading) {
            if(!prijavljenaOsoba) return <Redirect to = '/odjava'/>;
        }

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

export default graphql(getLoggedInUser)(DefaultLayout);
