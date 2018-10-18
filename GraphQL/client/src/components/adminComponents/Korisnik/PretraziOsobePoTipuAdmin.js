import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardHeader, Row} from 'reactstrap';

import {searchUsersByType} from '../../../queries/queries';

import PrikazJednogKorisnika from './PrikazJednogKorisnika';

class PretraziOsobePoTipuAdmin extends Component {

    searhByType() {

        console.log(this.props);

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.pretragaOsobaPoTipu) {

                return data.pretragaOsobaPoTipu.map((osoba) => {

                    return <PrikazJednogKorisnika key = {osoba.id} userID = {osoba.id}/>;
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
                {this.searhByType()}
            </div>
        );
    }
}

export default graphql(searchUsersByType, {
    options: (props) => {
        return {
            variables: {
                tip: props.tip
            }
        }
    }
})
(PretraziOsobePoTipuAdmin);
