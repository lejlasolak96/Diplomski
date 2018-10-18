import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardHeader, Row} from 'reactstrap';

import {searchUsersByUsername} from '../../../queries/queries';

import PrikazJednogKorisnika from './PrikazJednogKorisnika';

class PretraziOsobePoUsernameAdmin extends Component {

    searhByUsername() {

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.pretragaOsobaPoUsername) {

                return <PrikazJednogKorisnika userID = {data.pretragaOsobaPoUsername.id}/>;
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
                {this.searhByUsername()}
            </div>
        );
    }
}

export default graphql(searchUsersByUsername, {
    options: (props) => {
        return {
            variables: {
                username: props.username
            }
        }
    }
})
(PretraziOsobePoUsernameAdmin);
