import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Input, CardFooter, Row, Button, Table} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

class KreiranjeSemestra extends Component {

    constructor(props) {
        super(props);
        this.state = {
            naziv: "",
            redni_broj: null,
            akademska_godina_id: null,
            pocetak: null,
            kraj: null,
            godine: [],
            error: null
        };
    }

    componentDidMount() {
        this.getYears();
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

    submitSemester = (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            naziv: this.state.naziv,
            redni_broj: this.state.redni_broj,
            akademska_godina_id: this.state.akademska_godina_id,
            pocetak: this.state.pocetak,
            kraj: this.state.kraj
        };

        console.log(this.state);

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/semestri', options)
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

    displayYears() {

        if (this.state.godine) {

            return this.state.godine.map(ak => {
                return <option value = {ak.id} key = {ak.id}>{ak.naziv}</option>;
            });
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
                                <option disabled = {"true"} selected = {true}>Odaberite akademsku godinu</option>
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

export default KreiranjeSemestra;