import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardHeader, Row} from 'reactstrap';

import {searchHomeworksByNumber} from '../../../queries/queries';

import PrikazJedneSpiraleStudent from './PrikazJedneSpiraleStudent';

class PretraziSpiralePoBroju extends Component {

    search() {

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.pretraziSpiralePoBroju) {

                return data.pretraziSpiralePoBroju.map((s) => {

                    return <PrikazJedneSpiraleStudent key = {s.id} id = {s.id}/>;
                });
            }
            else return (
                <Card>
                    <CardHeader>
                        <Row>Nema rezultata pretrage</Row>
                    </CardHeader>
                </Card>
            );
        }
    }

    render() {
        return (
            <div className = "animated fadeIn">
                {this.search()}
            </div>
        );
    }
}

export default graphql(searchHomeworksByNumber, {
    options: (props) => {
        return {
            variables: {
                broj_spirale: props.broj_spirale
            }
        }
    }
})
(PretraziSpiralePoBroju);
