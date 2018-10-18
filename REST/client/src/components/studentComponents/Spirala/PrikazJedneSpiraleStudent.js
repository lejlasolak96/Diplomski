import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';
import Moment from 'react-moment';
import {API_ROOT} from "../../../api-config";

import PrikazDetaljaSpiraleStudent from './PrikazDetaljaSpiraleStudent';

class PrikazJedneSpiraleStudent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            edit: null,
            spirala: null
        };
    };

    componentDidMount() {
        this.gtHomework();
    }

    gtHomework() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/spirale/' + this.props.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.spirala) this.setState({spirala: data.spirala});
            })
            .catch(err => {
                console.log(err);
            });
    }

    toggle = () => {

        this.setState({opened: !this.state.opened});
    };

    displaySemester() {

        const {spirala} = this.state;

        if (spirala) {
            return (
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>{spirala.id}</Col>
                            <Col>{spirala.broj_spirale}</Col>
                            <Col>{spirala.max_bodova}</Col>
                            <Col><Moment date = {spirala.datum_objave} format = {"DD/MM/YYYY"}/></Col>
                            <Col><Moment date = {spirala.rok} format = {"DD/MM/YYYY"}/></Col>
                            <Col>
                                {this.state.opened ?
                                    <Button color = "primary" onClick = {() => {
                                        this.toggle()
                                    }} style = {{marginBottom: '1rem'}}>Sakrij detalje</Button>
                                    : <Button color = "primary" onClick = {() => {
                                        this.toggle()
                                    }} style = {{marginBottom: '1rem'}}>Prikaži detalje</Button>
                                }
                            </Col>
                        </Row>
                    </CardHeader>
                    <Collapse isOpen = {this.state.opened}>
                        <CardBody>
                            <PrikazDetaljaSpiraleStudent id = {spirala.id}/>
                        </CardBody>
                    </Collapse>
                </Card>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <div>
                {this.displaySemester()}
            </div>
        );
    }
}

export default PrikazJedneSpiraleStudent;
