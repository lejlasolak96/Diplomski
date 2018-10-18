import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, Input, CardHeader, Button, Col, Row, NavLink} from 'reactstrap';

import {getAcademicYears, getCurrentYear} from '../../../queries/queries';

import PrikazJedneAkademskeGodine from './PrikazJedneAkademskeGodine';
import PretraziGodinePoNazivu from './PretraziGodinePoNazivu';

class PrikazAkademskihGodina extends Component {

    constructor(props) {
        super(props);
        this.state = {
            naziv: '',
            prikaziTrenutnu: false
        };
    }

    displayCurrentYear() {

        const {trenutnaAkademskaGodina} = this.props.getCurrentYear;

        if (trenutnaAkademskaGodina) {

            return <PrikazJedneAkademskeGodine id = {trenutnaAkademskaGodina.id}/>;

        } else {

            return null;
        }
    }

    displayYears() {

        let data = this.props.getAcademicYears;

        if (data && !data.loading) {
            if (data.akademskeGodine) {

                return data.akademskeGodine.map((godina) => {

                    return <PrikazJedneAkademskeGodine key = {godina.id} id = {godina.id}/>;
                });
            }
            else {
                return (
                    <Card>
                        <CardHeader>
                            <Row>{data.error.message}</Row>
                        </CardHeader>
                    </Card>
                );
            }
        }
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Akademske godine</h3>
                    </CardHeader>
                    <CardBody>
                        <Button
                            color = {"success"}
                            href = {"/kreiranjeAkademskeGodine"}>Kreiraj novu akademsku godinu
                        </Button>
                        {
                            this.state.prikaziTrenutnu ?
                                <Button
                                    color = {"primary"}
                                    onClick = {() => {
                                        this.setState({prikaziTrenutnu: false})
                                    }}>Prikaži sve
                                </Button>
                                :
                                <Button
                                    onClick = {() => {
                                        this.setState({prikaziTrenutnu: true})
                                    }}
                                    color = {"primary"}>Prikaži trenutnu
                                </Button>
                        }
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <Input
                            className = {"div-pretraga"}
                            onChange = {(e) => {
                                this.setState({naziv: e.target.value})
                            }}
                            placeholder = {"Unesite akadesmku godinu za pretragu"}
                            type = {"text"}/>
                    </CardHeader>
                    <CardBody>
                        <div>
                            <Card>
                                <Row style = {{fontSize: "14pt"}}>
                                    <Col>ID</Col>
                                    <Col>Naziv</Col>
                                    <Col>Trenutna</Col>
                                    <Col></Col>
                                    <Col></Col>
                                    <Col></Col>
                                </Row>
                                {this.state.naziv ? <PretraziGodinePoNazivu naziv = {this.state.naziv}/> :
                                    !this.state.prikaziTrenutnu ? this.displayYears() : this.displayCurrentYear()}
                            </Card>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default compose(
    graphql(getAcademicYears,
        {
            name: "getAcademicYears"
        }),
    graphql(getCurrentYear,
        {
            name: "getCurrentYear"
        }),
)(PrikazAkademskihGodina);
