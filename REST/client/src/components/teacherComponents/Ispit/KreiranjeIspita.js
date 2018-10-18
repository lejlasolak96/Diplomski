import React, {Component} from 'react';
import {Card, CardBody, CardFooter, Input, Button, CardHeader, Row, Table, Col} from 'reactstrap';
import moment from 'moment'
import Moment from 'react-moment';
import {API_ROOT} from "../../../api-config";

class KreiranjeIspita extends Component {

    constructor(props) {
        super(props);
        this.state = {
            max_bodova: null,
            datum_odrzavanja: moment(new Date()).format("YYYY-MM-DD"),
            vrsta_ispita_id: null,
            semestar_id: null,
            semestri: [],
            error: null,
            vrsteIspita: []
        };
    }

    componentDidMount() {
        this.getSemesters();
        this.getExamTypes();
    }

    getExamTypes() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/vrsteIspita', options)
            .then(result => result.json())
            .then(data => {
                if (data.vrsteIspita) this.setState({vrsteIspita: data.vrsteIspita});
            })
            .catch(err => {
                console.log(err);
            })
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
                if (data.error) this.setState({error: data.error});
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

    submitExam = (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            max_bodova: this.state.max_bodova,
            datum_odrzavanja: this.state.datum_odrzavanja,
            vrsta_ispita_id: this.state.vrsta_ispita_id,
            semestar_id: this.state.semestar_id
        };

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/ispiti', options)
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

    displayExamTypes() {

        if (this.state.vrsteIspita) {
            return this.state.vrsteIspita.map(vrsta => {
                return (
                    <option value = {vrsta.id} key = {vrsta.id}>{vrsta.naziv}</option>
                );
            });
        }
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

export default KreiranjeIspita;