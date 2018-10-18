import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Input, Col, CardFooter, Row, Button, Table} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

class UredjivanjeAkademskeGodine extends Component {

    constructor(props) {
        super(props);
        this.state = {
            naziv: null,
            trenutna: null,
            akademskaGodina: null
        };
    }

    componentDidMount() {
        this.getYear();
    }

    getYear() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/akademskeGodine/' + this.props.match.params.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.akademskaGodina) this.setState({akademskaGodina: data.akademskaGodina});
            })
            .catch(err => {
                console.log(err);
            });
    }

    submitYear = (id) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {};

        if (this.state.naziv) variables.naziv = this.state.naziv;
        if (this.state.trenutna) variables.trenutna = this.state.trenutna;

        const options = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/akademskeGodine/' + id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) alert(data.message);
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    displayYear() {

        const {akademskaGodina} = this.state;

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
                                    <Input type = {"select"} onChange = {(e) => {
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

export default UredjivanjeAkademskeGodine;