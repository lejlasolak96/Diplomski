import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Input, Col, Row, NavLink} from 'reactstrap';

import {getGroups} from '../../../queries/queries';

import PrikazJedneGrupeStudent from './PrikazJedneGrupeStudent';
import PretraziGrupePoNazivuStudent from './PretraziGrupePoNazivuStudent';
import PretraziGrupePoGodiniStudent from './PretraziGrupePoGodiniStudent';
import PretraziMojeGrupe from './PretraziMojeGrupe';

class PrikazGrupaStudent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pretraga: '',
            naziv: '',
            godina: '',
            mojeGrupe: false
        };
    }

    displayGroups() {

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.grupe) {

                return data.grupe.map((grupa) => {

                    return <PrikazJedneGrupeStudent key = {grupa.id} id = {grupa.id}/>;
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

    getMyGroups(e) {

        this.setState({pretraga: '', mojeGrupe: true});
    }

    changeSearch(e) {

        this.setState({pretraga: e.target.value, mojeGrupe: false});
    }

    changeNameSearch(e) {

        this.setState({naziv: e.target.value});
        this.setState({pretraga: "naziv"})
    }

    changeYearSearch(e) {

        this.setState({godina: e.target.value});
        this.setState({pretraga: "godina"});
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Grupe</h3>
                    </CardHeader>
                    <CardBody>
                        <Button onClick={this.getMyGroups.bind(this)} color={"primary"}>Moje grupe</Button>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <Input type={"select"} onChange = {this.changeSearch.bind(this)}>
                            <option value = {""}>
                                Sve
                            </option>
                            <option value = {"godina"}>
                                Pretraga po akademskoj godini
                            </option>
                            <option value = {"naziv"}>
                                Pretraga po nazivu
                            </option>
                        </Input>
                        {
                            this.state.pretraga === "naziv" ?
                                <Input
                                    className = {"div-pretraga"}
                                    onChange = {this.changeNameSearch.bind(this)}
                                    placeholder = {"Unesite naziv za pretragu"}
                                    type = {"text"}/>
                                : null
                        }
                        {
                            this.state.pretraga === "godina" ?
                                <Input
                                    className = {"div-pretraga"}
                                    onChange = {this.changeYearSearch.bind(this)}
                                    placeholder = {"Unesite akadesmku godinu za pretragu"}
                                    type = {"text"}/>
                                : null
                        }
                    </CardHeader>
                    <CardBody>
                        <div>
                            <Card>
                                <Row style = {{fontSize: "14pt"}}>
                                    <Col>ID</Col>
                                    <Col>Naziv</Col>
                                    <Col>Broj studenata</Col>
                                    <Col>Naziv semestra</Col>
                                    <Col>Redni broj semestra</Col>
                                    <Col>Akademska godina</Col>
                                    <Col></Col>
                                    <Col></Col>
                                    <Col></Col>
                                </Row>
                                {this.state.pretraga === "" ? this.displayGroups() : null}
                                {this.state.mojeGrupe === true ?
                                    <PretraziMojeGrupe/> : null}
                                {this.state.pretraga === "naziv" && this.state.naziv !== "" ?
                                    <PretraziGrupePoNazivuStudent naziv = {this.state.naziv}/> : null}
                                {this.state.pretraga === "godina" && this.state.godina !== "" ?
                                    <PretraziGrupePoGodiniStudent godina = {this.state.godina}/> : null}
                            </Card>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default graphql(getGroups)(PrikazGrupaStudent);
