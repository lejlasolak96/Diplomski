import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardFooter, Table, Input, Button} from 'reactstrap';
import moment from 'moment';
import Moment from 'react-moment';

import {editHomework} from '../../../mutations/mutations';
import {getHomework, getSemesters} from "../../../queries/queries";

class UredjivanjeSpirale extends Component {

    constructor(props) {
        super(props);
        this.state = {
            broj_spirale: null,
            max_bodova: null,
            postavka: null,
            datum_objave: null,
            rok: null,
            semestar_id: null
        };
    }

    submitHomework = async (id) => {

        let variables = {};

        variables.id = id;
        if (this.state.broj_spirale) variables.broj_spirale = this.state.broj_spirale;
        if (this.state.max_bodova) variables.max_bodova = this.state.max_bodova;
        if (this.state.postavka) variables.postavka = this.state.postavka;
        if (this.state.datum_objave) variables.datum_objave = this.state.datum_objave;
        if (this.state.rok) variables.rok = this.state.rok;
        if (this.state.semestar_id) variables.semestar_id = this.state.semestar_id;

        await this.props.editHomework({
            variables: variables
        })
            .then(function () {
                alert("Uspješno uređena spirala");
                window.location.reload();
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    displaySemesters(spirala) {

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
                                semestar.id === spirala.semestar.id && this.state.semestar_id === null ?
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

    displayHomework() {

        const {spirala} = this.props.getHomework;

        if (spirala) {
            return (
                <div className = "animated fadeIn">
                    <Card>
                        <CardBody>
                            <Input
                                value = {this.state.broj_spirale ? this.state.broj_spirale : spirala.broj_spirale}
                                onChange = {(e) => {
                                    this.setState({broj_spirale: e.target.value})
                                }}
                                style = {{marginBottom: "20px"}} type = {"number"}
                                placeholder = {"Broj spirale"}/>
                            <Input
                                value = {this.state.max_bodova ? this.state.max_bodova : spirala.max_bodova}
                                onChange = {(e) => {
                                    this.setState({max_bodova: e.target.value})
                                }}
                                style = {{marginBottom: "20px"}} type = {"number"}
                                placeholder = {"Maximalni broj bodova"}/>
                            <label>Datum objave: </label>
                            <Input type = "date"
                                   style = {{marginBottom: "20px"}}
                                   value = {this.state.datum_objave ? this.state.datum_objave : moment(spirala.datum_objave).format("YYYY-MM-DD")}
                                   onChange = {(e) => {
                                       this.setState({datum_objave: e.target.value})
                                   }}/>
                            <label>Rok za predaju: </label>
                            <Input type = "date"
                                   style = {{marginBottom: "20px"}}
                                   value = {this.state.rok ? this.state.rok : moment(spirala.rok).format("YYYY-MM-DD")}
                                   onChange = {(e) => {
                                       this.setState({rok: e.target.value})
                                   }}/>
                            <Input
                                value = {this.state.postavka ? this.state.postavka : spirala.postavka}
                                onChange = {(e) => {
                                    this.setState({postavka: e.target.value})
                                }}
                                style = {{height: "700px", maxHeight: "900px", marginBottom: "20px"}}
                                placeholder = {"Postavka"} type = "textarea"/>
                            <label style = {{marginBottom: "20px"}}>Semestar: </label>
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
                                {this.displaySemesters(spirala)}
                                </tbody>
                            </Table>
                        </CardBody>
                        <CardFooter>
                            <Button color = {"success"}
                                    disabled = {!this.state.semestar_id && !this.state.broj_spirale && !this.state.max_bodova && !this.state.datum_objave && !this.state.rok && !this.state.postavka}
                                    onClick = {() => {
                                        this.submitHomework(spirala.id)
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
                {this.displayHomework()}
            </div>
        );
    }
}

export default compose(
    graphql(editHomework,
        {
            name: "editHomework"
        }),
    graphql(getSemesters,
        {
            name: "getSemesters"
        }),
    graphql(getHomework,
        {
            name: "getHomework",
            options: (props) => {
                return {
                    variables: {
                        id: props.match.params.id
                    }
                }
            }
        }
    )
)(UredjivanjeSpirale);