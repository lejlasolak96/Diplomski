import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Col, Input, CardFooter, Row, Button, Table} from 'reactstrap';

import {getAcademicYears} from '../../../queries/queries';
import {createSemester} from '../../../mutations/mutations';

class KreiranjeSemestra extends Component {

    constructor(props) {
        super(props);
        this.state = {
            naziv: "",
            redni_broj: null,
            akademska_godina_id: null,
            pocetak: null,
            kraj: null
        };
    }

    submitSemester = async (e) => {

        if (!this.state.redni_broj
            || !this.state.akademska_godina_id || !this.state.pocetak
            || !this.state.kraj) alert("Niste popunili sva polja");

        else {
            await this.props.createSemester({
                variables: {
                    naziv: this.state.naziv,
                    redni_broj: this.state.redni_broj,
                    akademska_godina_id: this.state.akademska_godina_id,
                    pocetak: this.state.pocetak,
                    kraj: this.state.kraj
                }
            })
                .then(function () {
                    alert("Uspješno kreiran semestar");
                    window.location.reload();
                })
                .catch(function (error) {
                    alert(error.message);
                });
        }
    }

    displayYears() {

        let data = this.props.getAcademicYears;

        if (data && !data.loading) {
            if (data.akademskeGodine) {

                return data.akademskeGodine.map(ak => {
                    return <option value = {ak.id} key = {ak.id}>{ak.naziv}</option>;

                });
            }
            else {
                return null;
            }
        }
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h1>Novi semestar</h1>
                    </CardHeader>
                    <CardBody>
                        <div style = {{marginBottom: "20px"}}>
                            <label style = {{marginRight: "20px"}}>Naziv: </label>
                            <Input type = {"select"} onChange = {(e) => {
                                this.setState({naziv: e.target.value})
                            }}>
                                <option disabled = {"true"} selected = {true}>Odaberite naziv</option>
                                <option value = {"zimski"}>Zimski</option>
                                <option value = {"ljetni"}>Ljetni</option>
                            </Input>
                        </div>
                        <div style = {{marginBottom: "20px"}}>
                            <label style = {{marginRight: "20px"}}>Redni broj: </label>
                            <Input type = {"number"} onChange = {(e) => {
                                this.setState({redni_broj: e.target.value})
                            }}/>
                        </div>
                        <div style = {{marginBottom: "20px"}}>
                            <label style = {{marginRight: "20px"}}>Pocetak: </label>
                            <Input type = "date" onChange = {(e) => {
                                this.setState({pocetak: e.target.value})
                            }} placeholder = "odaberite datum"/>
                        </div>
                        <div style = {{marginBottom: "20px"}}>
                            <label style = {{marginRight: "20px"}}>Kraj: </label>
                            <Input type = "date" onChange = {(e) => {
                                this.setState({kraj: e.target.value})
                            }} placeholder = "odaberite datum"/>
                        </div>
                        <div style = {{marginBottom: "20px"}}>
                            <label style = {{marginRight: "20px"}}>Akademska godina: </label>
                            <Input type = {"select"}
                                   onChange = {(e) => this.setState({akademska_godina_id: e.target.value})}>
                                <option selected={true} disabled = {"true"}>Odaberite akademsku godinu</option>
                                {this.displayYears()}
                            </Input>
                        </div>
                    </CardBody>
                    <CardFooter>
                        <Button
                            color = {"success"}
                            disabled = {
                                !this.state.akademska_godina_id
                                || !this.state.redni_broj
                                || !this.state.kraj
                                || !this.state.pocetak
                                || !this.state.naziv
                            }
                            onClick = {this.submitSemester.bind(this)}>Kreiraj semestar</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
}

export default compose(
    graphql(createSemester,
        {
            name: "createSemester"
        }),
    graphql(getAcademicYears,
        {
            name: "getAcademicYears"
        })
)(KreiranjeSemestra);