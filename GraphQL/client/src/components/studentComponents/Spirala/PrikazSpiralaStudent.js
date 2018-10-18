import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Input, Col, Row} from 'reactstrap';

import {getHomeworks} from '../../../queries/queries';

import PrikazJedneSpiraleStudent from './PrikazJedneSpiraleStudent';
import PretraziSpiralePoGodini from './PretraziSpiralePoGodini';
import PretraziSpiralePoBroju from './PretraziSpiralePoBroju';

class PrikazSpiralaStudent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pretraga: '',
            broj: null,
            godina: ''
        };
    }

    displayHomeworks() {

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.spirale) {

			return data.spirale.map((sem) => {

                    return <PrikazJedneSpiraleStudent key = {sem.id} id = {sem.id}/>;
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

    changeNumberSearch(e) {

        this.setState({broj: e.target.value});
        this.setState({pretraga: "broj"});
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
                        <h3>Spirale</h3>
                    </CardHeader>
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
                                <option value = {"broj"}>
                                    Pretraga po broju spirale
                                </option>
                            </Input>
                            {
                                this.state.pretraga === "broj" ?
                                    <Input
                                        className = {"div-pretraga"}
                                        onChange = {this.changeNumberSearch.bind(this)}
                                        placeholder = {"Unesite broj spirale za pretragu"}
                                        type = {"number"}/>
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
							<Card>
								<Row style = {{fontSize: "14pt"}}>
                                    <Col>ID</Col>
                                    <Col>Broj spirale</Col>
                                    <Col>Maximalni broj bodova</Col>
                                    <Col>Datum objave</Col>
                                    <Col>Rok za predaju</Col>
                                </Row>
								{this.state.pretraga === "" ? this.displayHomeworks() : null}
								{this.state.pretraga === "broj" && this.state.broj !== "" ?
								<PretraziSpiralePoBroju broj_spirale = {this.state.broj}/> : null}
								{this.state.pretraga === "godina" && this.state.godina !== "" ?
								<PretraziSpiralePoGodini godina = {this.state.godina}/> : null}
							</Card>
                        </CardBody>
					</Card>
            </div>
        );
    }
}

export default graphql(getHomeworks)(PrikazSpiralaStudent);
