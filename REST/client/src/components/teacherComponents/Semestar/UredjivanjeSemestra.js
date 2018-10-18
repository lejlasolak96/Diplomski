import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, CardFooter, Input, Row, Button, Table} from 'reactstrap';
import moment from 'moment';
import {API_ROOT} from "../../../api-config";

class UredjivanjeSemestra extends Component {

    constructor(props) {
        super(props);
        this.state = {
            naziv: null,
            redni_broj: null,
            akademska_godina_id: null,
            pocetak: null,
            kraj: null,
            semestar: null,
            godine: [],
            error: null
        };
    }

    componentDidMount() {
        this.getSemester();
        this.getYears();
    }

    async getSemester() {

        let semestar = {};

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/semestri/' + this.props.match.params.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.semestar) semestar = data.semestar;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/semestri/' + this.props.match.params.id + '/akademskaGodina', options)
            .then(result => result.json())
            .then(data => {
                if (data.akademskaGodina) semestar.akademskaGodina = data.akademskaGodina;
            })
            .catch(err => {
                console.log(err);
            });

        this.setState({semestar: semestar});
    }

    getYears() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/akademskeGodine', options)
            .then(result => result.json())
            .then(data => {
                if (data.akademskeGodine) this.setState({godine: data.akademskeGodine});
                if (data.error) this.setState({error: data.error});
            })
            .catch(err => {
                console.log(err);
            });
    }

    submitSemester = (id) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {};

        if (this.state.naziv) variables.naziv = this.state.naziv;
        if (this.state.redni_broj) variables.redni_broj = this.state.redni_broj;
        if (this.state.pocetak) variables.pocetak = this.state.pocetak;
        if (this.state.kraj) variables.kraj = this.state.kraj;
        if (this.state.akademska_godina_id) variables.akademska_godina_id = this.state.akademska_godina_id;

        const options = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/semestri/' + id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    this.getSemester();
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    displayYears(id) {

        if (this.state.godine) {

            return this.state.godine.map(ak => {
                return <option selected = {ak.id === id} value = {ak.id} key = {ak.id}>{ak.naziv}</option>;
            });
        }
    }

    displayYear() {

        const {semestar} = this.state;

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

export default UredjivanjeSemestra;