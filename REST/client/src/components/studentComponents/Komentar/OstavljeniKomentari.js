import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Row} from 'reactstrap';

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
            this.refetch(true);
        }
    }

    refetch(r) {
        if (r === true) {
            this.setState({sifre: []});
            this.setState({sifre: ["A", "B", "C", "D", "E"]});
        }
    }

    displayComments() {
        return (
            <Row>
                {
                    this.state.sifre.map((sifra, i) => (
                        <Col>
                            <JedanOstavljeniKomentar refetch = {this.refetch.bind(this)}
                                                     key = {i + 1}
                                                     sifra_studenta = {sifra}
                                                     spirala_id = {this.props.spirala_id}/>
                        </Col>
                    ))
                }
            </Row>
        );
    }

    render() {
        return (
            <div id = "osoba-details">
                <Card>
                    <CardHeader>
                        <h1>Ostavljeni komentari</h1>
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