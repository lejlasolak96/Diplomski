import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Col, Input, CardFooter, Row, Button, Table} from 'reactstrap';

import {createAcademicYear} from '../../../mutations/mutations';

class KreiranjeAkademskeGodine extends Component {

    constructor(props) {
        super(props);
        this.state = {
            naziv: null,
            trenutna: true
        };
    }

    submitYear = async (e) => {

        if (!this.state.naziv || !this.state.trenutna) alert("Niste popunili sva polja");

        else {
            await this.props.mutate({
                variables: {
                    naziv: this.state.naziv,
                    trenutna: this.state.trenutna
                }
            })
                .then(function () {
                    alert("Uspješno kreirana akademska godina");
                    window.location.reload();
                })
                .catch(function (error) {
                    alert(error.message);
                });
        }
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
                        <Button color = {"success"} onClick = {this.submitYear.bind(this)}>Kreiraj akademsku
                                                                                           godinu</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
}

export default graphql(createAcademicYear)(KreiranjeAkademskeGodine);