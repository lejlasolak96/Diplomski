import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, Input, CardHeader, Button, Col, Row} from 'reactstrap';

import {getExams} from '../../../queries/queries';

import PrikazJednogIspita from './PrikazJednogIspita';
import PretraziIspitePoGodini from './PretraziIspitePoGodini';
import PretraziIspitePoTipu from './PretraziIspitePoTipu';

class PrikazIspita extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pretraga: '',
            tip: '',
            godina: ''
        };
    }

    displayExams() {

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.ispiti) {

                return data.ispiti.map((sem) => {

                    return <PrikazJednogIspita key = {sem.id} id = {sem.id}/>;
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

    changeSearch(e) {

        this.setState({pretraga: e.target.value});
    }

    changeTypeSearch(e) {

        this.setState({tip: e.target.value});
        this.setState({pretraga: "tip"});
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
                        <h3>Ispiti</h3>
                    </CardHeader>
                    <CardBody>
                        <Button
                            color = {"success"}
                            href = {"/kreiranjeIspita"}>Kreiraj ispit
                        </Button>
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
                            <option value = {"tip"}>
                                Pretraga po vrsti
                            </option>
                        </Input>
                        {
                            this.state.pretraga === "tip" ?
                                <Input
                                    className = {"div-pretraga"}
                                    onChange = {this.changeTypeSearch.bind(this)}
                                    placeholder = {"Unesite vrstu za pretragu"}
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
                        <Row style = {{fontSize: "14pt"}}>
                            <Col>ID</Col>
                            <Col>Maximalni broj bodova</Col>
                            <Col>Vrsta ispita</Col>
                            <Col>Datum odrzavanja</Col>
                            <Col></Col>
                            <Col></Col>
                            <Col></Col>
                        </Row>
                        {this.state.pretraga === "" ? this.displayExams() : null}
                        {this.state.pretraga === "tip" && this.state.naziv !== "" ?
                            <PretraziIspitePoTipu vrsta = {this.state.tip}/> : null}
                        {this.state.pretraga === "godina" && this.state.godina !== "" ?
                            <PretraziIspitePoGodini godina = {this.state.godina}/> : null}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default graphql(getExams)(PrikazIspita);
