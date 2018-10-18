import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardFooter, Col, Row, Input, Button, CardHeader} from 'reactstrap';

import {getReceivedComments} from '../../../queries/queries';

class DobijeniKomentari extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refetched: null,
            error: null
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.spirala_id !== this.props.spirala_id) {
            this.props.data.refetch()
                .then((value) => {

                    this.setState({refetched: value, error: null});
                })
                .catch((value) => {

                    this.setState({error: value.message, refetched: null});
            });
        }
    }

    componentDidMount() {
        this.props.data.refetch()
            .then((value) => {

                this.setState({refetched: value, error: null});
            })
            .catch((value) => {

                this.setState({error: value.message, refetched: null});
            });
    }

    displayComments() {

        if (this.props.spirala_id) {

            let data = null;
            if(this.state.refetched) data = this.state.refetched.data;

            if (data) {
                if (data.dobijeniKomentari) {
                    return data.dobijeniKomentari.map((komentar) => {
                        return (
                            <Col key = {komentar.id}>
                                <Card>
                                    <CardBody>
                                        <Input
                                            disabled = {true}
                                            value = {komentar.text}
                                            style = {{height: "15em", maxHeight: "40em"}}
                                            type = "textarea"/>
                                    </CardBody>
                                    <CardFooter>
                                        <Input
                                            disabled = {true}
                                            value = {komentar.ocjena}
                                            type = "number"/>
                                    </CardFooter>
                                </Card>
                            </Col>
                        );
                    });
                }
            }
            else {
                return (
                    <Card>
                        <CardHeader>
                            <Row>{this.state.error}</Row>
                        </CardHeader>
                    </Card>
                );
            }
        }
        else return null;
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Dobijeni komentari</h3>
                    </CardHeader>
                </Card>
                <Card>
                    <CardBody>
                        <Row>
                            {this.displayComments()}
                        </Row>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default graphql(getReceivedComments, {
    options: (props) => {
        return {
            variables: {
                spirala_id: props.spirala_id
            }
        }
    }
})
(DobijeniKomentari);