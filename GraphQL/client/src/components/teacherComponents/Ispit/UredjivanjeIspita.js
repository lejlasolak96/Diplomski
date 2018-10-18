import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardFooter, Input, Button, Table} from 'reactstrap';
import moment from 'moment';
import Moment from 'react-moment';

import {editExam} from '../../../mutations/mutations';
import {getExam, getExamTypesQuery, getSemesters} from "../../../queries/queries";

class UredjivanjeIspita extends Component {

    constructor(props) {
        super(props);
        this.state = {
            max_bodova: null,
            datum_odrzavanja: null,
            vrsta_ispita_id: null,
            semestar_id: null
        };
    }

    submitExam = (id) => {

        let variables = {};

        variables.id = id;
        if (this.state.max_bodova) variables.max_bodova = this.state.max_bodova;
        if (this.state.datum_odrzavanja) variables.datum_odrzavanja = this.state.datum_odrzavanja;
        if (this.state.vrsta_ispita_id) variables.vrsta_ispita_id = this.state.vrsta_ispita_id;
        if (this.state.semestar_id) variables.semestar_id = this.state.semestar_id;

        this.props.editExam({
            variables: variables
        })
            .then(function () {
                alert("Uspješno uređen ispit");
                window.location.reload();
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    displayExamTypes(id) {
        let data = this.props.getExamTypesQuery;
        if (!data.loading) {
            if (data.vrsteIspita) {
                return data.vrsteIspita.map(vrsta => {
                    return (
                        <option selected = {vrsta.id === id} value = {vrsta.id} key = {vrsta.id}>{vrsta.naziv}</option>
                    );
                });
            }
            else return null;
        }
    }

    displaySemesters(ispit) {

        let data = this.props.getSemesters;

        if (data && !data.loading) {
            if (data.semestri) {

                return data.semestri.map((semestar) => {

                    return (
                        <tr key = {semestar.id}>
                            <td>{semestar.id}</td>
                            <td>{semestar.naziv}</td>
                            <td>{semestar.redni_broj}</td>
                            <td><Moment date = {semestar.pocetak} format = {"DD/MM/YYYY"}/></td>
                            <td><Moment date = {semestar.kraj} format = {"DD/MM/YYYY"}/></td>
                            <td>{semestar.akademskaGodina.naziv}</td>
                            {
                                semestar.id === ispit.semestar.id && this.state.semestar_id === null ?
                                    <td><Button color = {"success"}
                                                disabled = {true}
                                                onClick = {() => {
                                                    this.setState({semestar_id: semestar.id})
                                                }}>Trenutni</Button></td>
                                    :
                                    !this.state.semestar_id || this.state.semestar_id !== semestar.id ?
                                        <td><Button color = {"primary"}
                                                    disabled = {this.state.semestar_id && this.state.semestar_id !== semestar.id}
                                                    onClick = {() => {
                                                        this.setState({semestar_id: semestar.id})
                                                    }}>Odaberi</Button></td>
                                        :
                                        <td><Button onClick = {() => {
                                            this.setState({semestar_id: null})
                                        }}>Poništi</Button></td>
                            }
                        </tr>
                    );
                });
            }
            else {
                return (
                    <tr>
                        <td>
                            {data.error.message}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                );
            }
        }
    }

    displayExam() {

        const {ispit} = this.props.getExam;

        if (ispit) {

            return (
                <div className = "animated fadeIn">
                    <Card>
                        <CardBody>
                            <label>Maximalni broj bodova</label>
                            <Input
                                onChange = {(e) => {
                                    this.setState({max_bodova: e.target.value})
                                }}
                                value = {this.state.max_bodova ? this.state.max_bodova : ispit.max_bodova}
                                style = {{marginBottom: "20px"}} type = {"number"}/>
                            <label>Datum održavanja: </label>
                            <Input type = "date"
                                   style = {{marginBottom: "20px"}}
                                   value = {this.state.datum_odrzavanja ? this.state.datum_odrzavanja : moment(ispit.datum_odrzavanja).format("YYYY-MM-DD")}
                                   onChange = {(e) => {
                                       this.setState({datum_odrzavanja: e.target.value})
                                   }}/>
                            <label>Semestar: </label>
                            <Table hover = {true} bordered = {true}>
                                <thead style = {{fontSize: "14pt"}}>
                                <tr>
                                    <td>ID</td>
                                    <td>Naziv</td>
                                    <td>Redni broj</td>
                                    <td>Početak</td>
                                    <td>Kraj</td>
                                    <td>Akademska godina</td>
                                    <td></td>
                                </tr>
                                </thead>
                                <tbody>
                                {this.displaySemesters(ispit)}
                                </tbody>
                            </Table>
                            <label className = {"vrsta-label"}>Vrsta ispita: </label>
                            <Input type = {"select"} className = {"vrsta"}
                                   onChange = {(e) => this.setState({vrsta_ispita_id: e.target.value})}>
                                {this.displayExamTypes(ispit.vrstaIspita.id)}
                            </Input>
                        </CardBody>
                        <CardFooter>
                            <Button color = {"success"}
                                    disabled = {!this.state.max_bodova && !this.state.vrsta_ispita_id && !this.state.semestar_id && !this.state.datum_odrzavanja}
                                    onClick = {() => {
                                        this.submitExam(ispit.id)
                                    }}>Sačuvaj promjene</Button>
                        </CardFooter>
                    </Card>
                </div>
            );
        }
        else return null;
    }

    render() {
        return (
            <div className = "animated fadeIn">
                {this.displayExam()}
            </div>
        );
    }
}

export default compose(
    graphql(editExam,
        {
            name: "editExam"
        }),
    graphql(getExamTypesQuery,
        {
            name: "getExamTypesQuery"
        }),
    graphql(getSemesters,
        {
            name: "getSemesters"
        }),
    graphql(getExam,
        {
            name: "getExam",
            options: (props) => {
                return {
                    variables: {
                        id: props.match.params.id
                    }
                }
            }
        }
    )
)(UredjivanjeIspita);