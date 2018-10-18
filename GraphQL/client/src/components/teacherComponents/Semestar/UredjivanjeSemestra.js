import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Col, CardFooter, Input, Row, Button, Table} from 'reactstrap';
import moment from 'moment'

import {editSemester} from '../../../mutations/mutations';
import {getSemester, getAcademicYears} from "../../../queries/queries";

class UredjivanjeSemestra extends Component {

    constructor(props) {
        super(props);
        this.state = {
            naziv: null,
            redni_broj: null,
            akademska_godina_id: null,
            pocetak: null,
            kraj: null
        };
    }

    submitSemester = async (id) => {

        let variables = {};

        variables.id = id;
        if (this.state.naziv) variables.naziv = this.state.naziv;
        if (this.state.redni_broj) variables.redni_broj = this.state.redni_broj;
        if (this.state.pocetak) variables.pocetak = this.state.pocetak;
        if (this.state.kraj) variables.kraj = this.state.kraj;
        if (this.state.akademska_godina_id) variables.akademska_godina_id = this.state.akademska_godina_id;

        await this.props.editSemester({
            variables: variables
        })
            .then(function () {
                alert("Uspješno uređen semestar");
                window.location.reload();
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    displayYears(id) {

        let data = this.props.getAcademicYears;

        if (data && !data.loading) {
            if (data.akademskeGodine) {

                return data.akademskeGodine.map(ak => {
                    return <option selected = {ak.id === id} value = {ak.id} key = {ak.id}>{ak.naziv}</option>;

                });
            }
            else {
                return null;
            }
        }
    }

    displayYear() {

        const {semestar} = this.props.getSemester;

        if (semestar) {
            return (
                <div className = "animated fadeIn">
                    <Card>
                        <CardBody>
                            <div style = {{marginBottom: "20px"}}>
                                <label style = {{marginRight: "20px"}}>Naziv: </label>
                                <Input type = {"select"} onChange = {(e) => {
                                    this.setState({naziv: e.target.value})
                                }}>
                                    <option disabled = {"true"}>Odaberite naziv</option>
                                    <option selected = {semestar.naziv === "zimski"} value = {"zimski"}>Zimski</option>
                                    <option selected = {semestar.naziv === "ljetni"} value = {"ljetni"}>Ljetni</option>
                                </Input>
                            </div>
                            <div style = {{marginBottom: "20px"}}>
                                <label style = {{marginRight: "20px"}}>Redni broj: </label>
                                <Input type = {"number"}
                                       value = {this.state.redni_broj ? this.state.redni_broj : semestar.redni_broj}
                                       onChange = {(e) => {
                                           this.setState({redni_broj: e.target.value})
                                       }}/>
                            </div>
                            <div style = {{marginBottom: "20px"}}>
                                <label style = {{marginRight: "20px"}}>Početak: </label>
                                <Input type = "date"
                                       value = {this.state.pocetak ? this.state.pocetak : moment(semestar.pocetak).format("YYYY-MM-DD")}
                                       onChange = {(e) => {
                                           this.setState({pocetak: e.target.value})
                                       }} placeholder = "odaberite datum"/>
                            </div>
                            <div style = {{marginBottom: "20px"}}>
                                <label style = {{marginRight: "20px"}}>Kraj: </label>
                                <Input type = "date"
                                       value = {this.state.kraj ? this.state.kraj : moment(semestar.kraj).format("YYYY-MM-DD")}
                                       onChange = {(e) => {
                                           this.setState({kraj: e.target.value})
                                       }} placeholder = "odaberite datum"/>
                            </div>
                            <div style = {{marginBottom: "20px"}}>
                                <label style = {{marginRight: "20px"}}>Akademska godina: </label>
                                <Input type = {"select"}
                                       onChange = {(e) => this.setState({akademska_godina_id: e.target.value})}>
                                    <option disabled = {"true"}>Odaberite akademsku godinu</option>
                                    {this.displayYears(semestar.akademskaGodina.id)}
                                </Input>
                            </div>
                        </CardBody>
                        <CardFooter>
                            <Button color = {"success"}
                                    disabled = {!this.state.redni_broj && !this.state.pocetak && !this.state.kraj && !this.state.akademska_godina_id && !this.state.naziv}
                                    onClick = {() => {
                                        this.submitSemester(semestar.id)
                                    }}>Sačuvaj promjene</Button>
                        </CardFooter>
                    </Card>
                </div>
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
    graphql(editSemester,
        {
            name: "editSemester"
        }),
    graphql(getAcademicYears,
        {
            name: "getAcademicYears"
        }
    ),
    graphql(getSemester,
        {
            name: "getSemester",
            options: (props) => {
                return {
                    variables: {
                        id: props.match.params.id
                    }
                }
            }
        }
    )
)(UredjivanjeSemestra);