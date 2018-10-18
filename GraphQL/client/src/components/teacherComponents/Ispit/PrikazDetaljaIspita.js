import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardBody, Table, Collapse, Input, CardHeader, Button} from 'reactstrap';
import Moment from 'react-moment';

import {getExam} from '../../../queries/queries';

import PrikazDetaljaSemestra from '../Semestar/PrikazDetaljaSemestra';

class PrikazDetaljaIspita extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false
        };
    };

    toggle = () => {

        this.setState({opened: !this.state.opened});
    };

    displayDetails() {

        const {ispit} = this.props.data;
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
                                    <PrikazDetaljaSemestra id = {ispit.semestar.id}/>
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

export default graphql(getExam, {
    options: (props) => {
        return {
            variables: {
                id: props.id
            }
        }
    }
})(PrikazDetaljaIspita);