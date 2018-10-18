import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardHeader, Row} from 'reactstrap';

import {searchHomeworksByYear} from '../../../queries/queries';

import PrikazJedneSpiraleStudent from './PrikazJedneSpiraleStudent';

class PretraziSpiralePoGodini extends Component {

    search() {

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.pretraziSpiralePoGodini) {

                return data.pretraziSpiralePoGodini.map((s) => {

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

export default graphql(searchHomeworksByYear, {
    options: (props) => {
        return {
            variables: {
                godina: props.godina
            }
        }
    }
})
(PretraziSpiralePoGodini);
