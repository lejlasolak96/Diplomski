import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardHeader, Row} from 'reactstrap';

import {searchMyGroups} from '../../../queries/queries';

import PrikazJedneGrupeStudent from './PrikazJedneGrupeStudent';

class PretraziMojeGrupe extends Component {

    searchByName() {

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.pretraziMojeGrupe) {

                return data.pretraziMojeGrupe.map((grupa) => {

                    return <PrikazJedneGrupeStudent key = {grupa.id} id = {grupa.id}/>;
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
                {this.searchByName()}
            </div>
        );
    }
}

export default graphql(searchMyGroups)
(PretraziMojeGrupe);
