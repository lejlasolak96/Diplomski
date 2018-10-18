import React, {Component} from 'react';
import {Card, CardBody, Table, Collapse, Input, CardHeader, Button} from 'reactstrap';
import Moment from 'react-moment';
import {API_ROOT} from "../../../api-config";

import PrikazDetaljaSemestra from '../Semestar/PrikazDetaljaSemestra';

class PrikazDetaljaIspita extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            ispit: null
        };
    };

    componentDidMount() {
        this.getExam();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id) {
            this.getExam();
        }
    }

    async getExam() {

        let ispit = {};

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/ispiti/' + this.props.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.ispit) ispit = data.ispit;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/ispiti/' + this.props.id + '/vrstaIspita', options)
            .then(result => result.json())
            .then(data => {
                if (data.vrstaIspita) ispit.vrstaIspita = data.vrstaIspita;
            })
            .catch(err => {
                console.log(err);
            });

        this.setState({ispit: ispit});
    }

    toggle = () => {

        this.setState({opened: !this.state.opened});
    };

    displayDetails() {

        const {ispit} = this.state;

        if (ispit) {
            return (
                <div>
                    <div>
                        <Table hover = {true}
                               bordered = {true}
                               responsive = {true}>
                            <thead style = {{fontSize: "14pt"}}>
                            <tr>
                                <td>ID</td>
                                <td>Maximalni broj bodova</td>
                                <td>Vrsta ispita</td>
                                <td>Datum održavanja</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{ispit.id}</td>
                                <td>{ispit.max_bodova}</td>
                                <td>{ispit.vrstaIspita.naziv}</td>
                                <td><Moment date = {ispit.datum_odrzavanja} format = {"DD/MM/YYYY"}/></td>
                            </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div>
                        <Card>
                            <CardHeader id = "headingOne">
                                <Button block color = "link" className = "text-left m-0 p-0"
                                        onClick = {() => this.toggle()} aria-expanded = {this.state.opened}>
                                    <h5 className = "m-0 p-0">Semestar</h5>
                                </Button>
                            </CardHeader>
                            <Collapse isOpen = {this.state.opened} aria-labelledby = "headingOne">
                                <CardBody>
                                    <PrikazDetaljaSemestra id = {ispit.semestar_id}/>
                                </CardBody>
                            </Collapse>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader>
                                <Button block color = "link" className = "text-left m-0 p-0"
                                        href = {"/ispitBodovi/" + ispit.id}>
                                    <h5 className = "m-0 p-0">Pregled bodova</h5>
                                </Button>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            );
        } else {
            return ( <div>Nije odabran ispit</div> );
        }
    }

    render() {
        return (
            <div>
                <Card>
                    <CardBody>
                        {this.displayDetails()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default PrikazDetaljaIspita;