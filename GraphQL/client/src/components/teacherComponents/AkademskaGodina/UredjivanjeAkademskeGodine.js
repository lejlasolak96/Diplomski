import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Col, CardFooter, Row, Button, Input, Table} from 'reactstrap';

import {editAcademicYear} from '../../../mutations/mutations';
import {getYear} from "../../../queries/queries";

class UredjivanjeAkademskeGodine extends Component {

    constructor(props) {
        super(props);
        this.state = {
            naziv: null,
            trenutna: null
        };
    }

    submitYear = async (id) => {

        let variables = {};

        variables.id = id;
        if (this.state.naziv) variables.naziv = this.state.naziv;
        if (this.state.trenutna) variables.trenutna = this.state.trenutna;

        await this.props.editAcademicYear({
            variables: variables
        })
            .then(function () {
                alert("Uspješno uređena akademska godina");
                window.location.reload();
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    displayYear() {

        const {akademskaGodina} = this.props.getYear;

        if (akademskaGodina) {
            return (
                <Card>
                    <CardBody>
                        <Card>
                            <CardBody>
                                <div style = {{marginBottom: "20px"}}>
                                    <label style = {{marginRight: "20px"}}>Naziv akademske godine: </label>
                                    <Input
                                        value = {this.state.naziv ? this.state.naziv : akademskaGodina.naziv}
                                        onChange = {(e) => {
                                            this.setState({naziv: e.target.value})
                                        }}/>
                                </div>
                                <div style = {{marginBottom: "20px"}}>
                                    <label style = {{marginRight: "20px"}}>Trenutna: </label>
                                    <Input type={"select"} onChange = {(e) => {
                                        this.setState({trenutna: e.target.value})
                                    }}>
                                        <option
                                            selected = {akademskaGodina.trenutna === true}
                                            value = {true}>Da
                                        </option>
                                        <option
                                            selected = {akademskaGodina.trenutna === false}
                                            value = {false}>Ne
                                        </option>
                                    </Input>
                                </div>
                            </CardBody>
                        </Card>
                    </CardBody>
                    <CardFooter>
                        <Button color = {"success"}
                                disabled = {!this.state.naziv && !this.state.trenutna}
                                onClick = {() => {
                                    this.submitYear(akademskaGodina.id)
                                }}>Sačuvaj promjene</Button>
                    </CardFooter>
                </Card>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className = "animated fadeIn">
                {this.displayYear()}
            </div>
        );
    }
}

export default compose(
    graphql(editAcademicYear,
        {
            name: "editAcademicYear"
        }),
    graphql(getYear,
        {
            name: "getYear",
            options: (props) => {
                return {
                    variables: {
                        id: props.match.params.id
                    }
                }
            }
        }
    )
)(UredjivanjeAkademskeGodine);