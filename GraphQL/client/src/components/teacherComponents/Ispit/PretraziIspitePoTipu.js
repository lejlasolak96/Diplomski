import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardHeader, Row} from 'reactstrap';

import {searchExamsByType} from '../../../queries/queries';

import PrikazJednogIspita from './PrikazJednogIspita';

class PretraziIspitePoTipu extends Component {

    search() {

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.pretraziIspitePoTipu) {

                return data.pretraziIspitePoTipu.map((ispit) => {

                    return <PrikazJednogIspita key = {ispit.id} id = {ispit.id}/>;
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

export default graphql(searchExamsByType, {
    options: (props) => {
        return {
            variables: {
                vrsta: props.vrsta
            }
        }
    }
})
(PretraziIspitePoTipu);
