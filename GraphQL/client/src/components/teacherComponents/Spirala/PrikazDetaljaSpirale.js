import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardBody, Table, Collapse, Input, CardHeader, Button} from 'reactstrap';
import Moment from 'react-moment';

import {getHomework} from '../../../queries/queries';

import PrikazDetaljaSemestra from '../Semestar/PrikazDetaljaSemestra';

class PrikazDetaljaSpirale extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: [false, false]
        };
    };

    toggle = (i) => {

        let op = this.state.opened;
        op[i] = !op[i];

        this.setState({opened: op});
    };

    displayHomeworkDetails() {

        const {spirala} = this.props.data;
        if (spirala) {
            return (
                <div>
                    <div>
                        <Table hover = {true}
                               bordered = {true}
                               responsive = {true}>
                            <thead style = {{fontSize: "14pt"}}>
                            <tr>
                                <td>ID</td>
                                <td>Broj spirale</td>
                                <td>Maximalni broj bodova</td>
                                <td>Datum objave</td>
                                <td>Rok za predaju</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{spirala.id}</td>
                                <td>{spirala.broj_spirale}</td>
                                <td>{spirala.max_bodova}</td>
                                <td><Moment date = {spirala.datum_objave} format = {"DD/MM/YYYY"}/></td>
                                <td><Moment date = {spirala.rok} format = {"DD/MM/YYYY"}/></td>
                            </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div>
                        <Card>
                            <CardHeader id = "headingOne">
                                <Button block color = "link" className = "text-left m-0 p-0"
                                        onClick = {() => this.toggle(0)}>
                                    <h5 className = "m-0 p-0">Postavka</h5>
                                </Button>
                            </CardHeader>
                            <Collapse isOpen = {this.state.opened[0]} aria-labelledby = "headingOne">
                                <CardBody>
                                    <Input type = {"textarea"}
                                           disabled = {true}
                                           style = {{height: "25em"}}
                                           value = {spirala.postavka}/>
                                </CardBody>
                            </Collapse>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader id = "headingOne">
                                <Button block color = "link" className = "text-left m-0 p-0"
                                        onClick = {() => this.toggle(1)}>
                                    <h5 className = "m-0 p-0">Semestar</h5>
                                </Button>
                            </CardHeader>
                            <Collapse isOpen = {this.state.opened[1]} aria-labelledby = "headingOne">
                                <CardBody>
                                    <PrikazDetaljaSemestra id = {spirala.semestar.id}/>
                                </CardBody>
                            </Collapse>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader>
                                <Button block color = "link" className = "text-left m-0 p-0"
                                        href = {"/spiralaBodovi/" + spirala.id}>
                                    <h5 className = "m-0 p-0">Pregled bodova</h5>
                                </Button>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            );
        } else {
            return ( <div>Nije odabrana spirala</div> );
        }
    }

    render() {
        return (
            <div id = "osoba-details">
                <Card>
                    <CardBody>
                        {this.displayHomeworkDetails()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default graphql(getHomework, {
    options: (props) => {
        return {
            variables: {
                id: props.id
            }
        }
    }
})(PrikazDetaljaSpirale);