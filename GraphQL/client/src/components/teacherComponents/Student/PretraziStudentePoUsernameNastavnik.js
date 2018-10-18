import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardHeader, Row} from 'reactstrap';

import {searchStudentsByUsername} from '../../../queries/queries';

import PrikazJednogStudenta from './PrikazJednogStudenta';

class PretraziStudentePoUsernameNastavnik extends Component {

    searhByUsername() {

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.pretragaStudenataPoUsername) {

                return <PrikazJednogStudenta userID = {data.pretragaStudenataPoUsername.id}/>;
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

export default graphql(searchStudentsByUsername, {
    options: (props) => {
        return {
            variables: {
                username: props.username
            }
        }
    }
})
(PretraziStudentePoUsernameNastavnik);
