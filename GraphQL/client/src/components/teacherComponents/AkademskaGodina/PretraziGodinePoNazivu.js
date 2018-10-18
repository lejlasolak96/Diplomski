import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Col, Row, NavLink} from 'reactstrap';

import {getYearByName} from '../../../queries/queries';

import PrikazJedneAkademskeGodine from './PrikazJedneAkademskeGodine';

class PretraziGodinePoNazivu extends Component {

    displayYear() {

        let {pretragaAkademskeGodinePoNazivu} = this.props.data;

        if (pretragaAkademskeGodinePoNazivu) {

            return <PrikazJedneAkademskeGodine id = {pretragaAkademskeGodinePoNazivu.id}/>;
        }
        else return (
            <Card>
                <CardHeader>
                    <Row>Nema rezultata pretrage</Row>
                </CardHeader>
            </Card>
        );
    }

    render() {
        return (
            <div className = "animated fadeIn">
                {this.displayYear()}
            </div>
        );
    }
}

export default graphql(getYearByName,
    {
        options: (props) => {
            return {
                variables: {
                    naziv: props.naziv
                }
            }
        }
    })
(PretraziGodinePoNazivu);
