import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Input, CardFooter, Row, Button, Table} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

class KreiranjeAkademskeGodine extends Component {

    constructor(props) {
        super(props);
        this.state = {
            naziv: null,
            trenutna: true
        };
    }

    submitYear = async (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            naziv: this.state.naziv,
            trenutna: this.state.trenutna
        };

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/akademskeGodine', options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                }
                if (data.error) alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h1>Nova akademska godina</h1>
                    </CardHeader>
                    <CardBody>
                        <div style = {{marginBottom: "20px"}}>
                            <label style = {{marginRight: "20px"}}>Naziv akademske godine: </label>
                            <Input onChange = {(e) => {
                                this.setState({naziv: e.target.value})
                            }}/>
                        </div>
                        <div style = {{marginBottom: "20px"}}>
                            <label style = {{marginRight: "20px"}}>Trenutna: </label>
                            <Input type = {"select"} onChange = {(e) => {
                                this.setState({trenutna: e.target.value})
                            }}>
                                <option value = {true}>Da</option>
                                <option value = {false}>Ne</option>
                            </Input>
                        </div>
                    </CardBody>
                    <CardFooter>
                        <Button
                            color = {"success"}
                            disabled = {!this.state.trenutna || !this.state.naziv}
                            onClick = {this.submitYear.bind(this)}>Kreiraj akademsku godinu</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
}

export default KreiranjeAkademskeGodine;