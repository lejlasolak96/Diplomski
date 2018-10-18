import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardFooter, Col, Row, Input, Button, CardHeader} from 'reactstrap';

import JedanOstavljeniKomentar from './JedanOstavljeniKomentar';

class OstavljeniKomentari extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sifre: ["A", "B", "C", "D", "E"]
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.spirala_id !== this.props.spirala_id) {
            this.setState({sifre: []});
            this.setState({sifre: ["A", "B", "C", "D", "E"]});
        }
    }

    displayComments() {
        return (
            <Row>
            {
                this.state.sifre.map((sifra, i) => (
                <Col key = {i + 1}>
                    <JedanOstavljeniKomentar sifra_studenta = {sifra}
                                             spirala_id = {this.props.spirala_id}/>
                </Col>
                ))
            }
            </Row>
        );
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Ostavljeni komentari</h3>
                    </CardHeader>
                    <CardBody>
                        {this.displayComments()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default OstavljeniKomentari;