import React, {Component} from 'react';
import {Card, CardBody, CardFooter, Input, Button, Table} from 'reactstrap';
import moment from 'moment';
import Moment from 'react-moment';
import {API_ROOT} from "../../../api-config";

class KreiranjeSpirale extends Component {

    constructor(props) {
        super(props);
        this.state = {
            broj_spirale: null,
            max_bodova: null,
            postavka: null,
            datum_objave: moment(new Date()).format("YYYY-MM-DD"),
            rok: null,
            semestar_id: null,
            semestri: [],
            error: null
        };
    }

    componentDidMount() {
        this.getSemesters();
    }

    async getSemesters() {

        let semestri = [];

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/semestri', options)
            .then(result => result.json())
            .then(data => {
                if (data.semestri) semestri = data.semestri;
                if (data.error) this.setState({semError: data.error});
            })
            .catch(err => {
                console.log(err);
            });

        let promises = [];

        semestri.map(semestar => {

            promises.push(
                fetch(API_ROOT + '/semestri/' + semestar.id + '/akademskaGodina', options)
                    .then(result => result.json())
                    .then(data => {
                        if (data.akademskaGodina) semestar.akademskaGodina = data.akademskaGodina;
                    })
                    .catch(err => {
                        console.log(err);
                    })
            );
        });

        await Promise.all(promises)
            .then(() => {
                this.setState({semestri: semestri});
            });
    }

    submitHomework = (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            broj_spirale: this.state.broj_spirale,
            max_bodova: this.state.max_bodova,
            postavka: this.state.postavka,
            datum_objave: this.state.datum_objave,
            rok: this.state.rok,
            semestar_id: this.state.semestar_id
        };

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/spirale', options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    displaySemesters() {

        if (this.state.semestri.length !== 0) {

            return this.state.semestri.map((semestar) => {

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
                        {this.state.error}
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

    displayHomework() {

        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardBody>
                        <Input
                            onChange = {(e) => {
                                this.setState({broj_spirale: e.target.value})
                            }}
                            style = {{marginBottom: "20px"}} type = {"number"}
                            placeholder = {"Broj spirale"}/>
                        <Input
                            onChange = {(e) => {
                                this.setState({max_bodova: e.target.value})
                            }}
                            style = {{marginBottom: "20px"}} type = {"number"}
                            placeholder = {"Maximalni broj bodova"}/>
                        <label>Datum objave: </label>
                        <Input type = "date"
                               style = {{marginBottom: "20px"}}
                               value = {this.state.datum_objave}
                               onChange = {(e) => {
                                   this.setState({datum_objave: e.target.value})
                               }}/>
                        <label>Rok za predaju: </label>
                        <Input type = "date"
                               style = {{marginBottom: "20px"}}
                               onChange = {(e) => {
                                   this.setState({rok: e.target.value})
                               }}/>
                        <Input
                            onChange = {(e) => {
                                this.setState({postavka: e.target.value})
                            }}
                            style = {{height: "700px", maxHeight: "900px", marginBottom: "20px"}}
                            placeholder = {"Postavka"} type = "textarea"/>
                        <label style = {{marginBottom: "20px"}}>Semestar: </label>
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
                    </CardBody>
                    <CardFooter>
                        <Button color = {"success"}
                                disabled = {!this.state.semestar_id || !this.state.broj_spirale || !this.state.max_bodova || !this.state.datum_objave || !this.state.rok || !this.state.postavka}
                                onClick = {this.submitHomework.bind(this)}>Kreiraj spiralu</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    render() {
        return (
            <div className = "animated fadeIn">
                {this.displayHomework()}
            </div>
        );
    }
}

export default KreiranjeSpirale;