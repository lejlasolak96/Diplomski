import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardHeader, Row} from 'reactstrap';

import {searchGroupsByName} from '../../../queries/queries';

import PrikazJedneGrupeStudent from './PrikazJedneGrupeStudent';

class PretraziGrupePoNazivuStudent extends Component {

    searchByName() {

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.pretraziGrupePoNazivu) {

                return data.pretraziGrupePoNazivu.map((grupa) => {

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

export default graphql(searchGroupsByName, {
    options: (props) => {
        return {
            variables: {
                naziv: props.naziv
            }
        }
    }
})
(PretraziGrupePoNazivuStudent);
