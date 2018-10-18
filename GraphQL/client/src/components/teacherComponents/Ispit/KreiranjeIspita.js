import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardFooter, Input, Button, CardHeader, Row, Table, Col} from 'reactstrap';
import moment from 'moment'
import Moment from 'react-moment';

import {getSemesters, getExamTypesQuery} from '../../../queries/queries';
import {createExam} from '../../../mutations/mutations';

class KreiranjeIspita extends Component {

    constructor(props) {
        super(props);
        this.state = {
            max_bodova: null,
            datum_odrzavanja: moment(new Date()).format("YYYY-MM-DD"),
            vrsta_ispita_id: null,
            semestar_id: null
        };
    }

    submitExam = (e) => {

        this.props.createExam({
            variables: {
                max_bodova: this.state.max_bodova,
                datum_odrzavanja: this.state.datum_odrzavanja,
                vrsta_ispita_id: this.state.vrsta_ispita_id,
                semestar_id: this.state.semestar_id
            }
        })
            .then(function () {
                alert("Uspješno kreiran ispit");
                window.location.reload();
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    displayExamTypes() {
        let data = this.props.getExamTypesQuery;
        if (!data.loading) {
            if (data.vrsteIspita) {
                return data.vrsteIspita.map(vrsta => {
                    return (
                        <option value = {vrsta.id} key = {vrsta.id}>{vrsta.naziv}</option>
                    );
                });
            }
            else return null;
        }
    }

    displaySemesters() {

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

        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardBody>
                        <Input
                            onChange = {(e) => {
                                this.setState({max_bodova: e.target.value})
                            }}
                            style = {{marginBottom: "20px"}} type = {"number"}
                            placeholder = {"Maximalni broj bodova"}/>
                        <label>Datum održavanja: </label>
                        <Input type = "date"
                               style = {{marginBottom: "20px"}}
                               value = {this.state.datum_odrzavanja}
                               onChange = {(e) => {
                                   this.setState({datum_odrzavanja: e.target.value})
                               }}/>
                        <label>Semestar: </label>
                        <Table hover = {true}
                               responsive = {true}
                               striped = {true}
                               bordered = {true}>
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
                            {this.displaySemesters()}
                            </tbody>
                        </Table>
                        <label className = {"vrsta-label"}>Vrsta ispita: </label>
                        <Input type = {"select"} className = {"vrsta"}
                               onChange = {(e) => this.setState({vrsta_ispita_id: e.target.value})}>
                            <option disabled = {true} selected = {true}>Odaberite tip ispita</option>
                            {this.displayExamTypes()}
                        </Input>
                    </CardBody>
                    <CardFooter>
                        <Button color = {"success"}
                                disabled = {!this.state.max_bodova || !this.state.vrsta_ispita_id || !this.state.semestar_id}
                                onClick = {this.submitExam.bind(this)}>Kreiraj ispit</Button>
                    </CardFooter>
                </Card>
            </div>
        );
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
    graphql(createExam,
        {
            name: "createExam"
        }),
    graphql(getExamTypesQuery,
        {
            name: "getExamTypesQuery"
        }),
    graphql(getSemesters,
        {
            name: "getSemesters"
        })
)(KreiranjeIspita);