import React, {Component} from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, Nav} from 'reactstrap';
import PropTypes from 'prop-types';

import {AppHeaderDropdown, AppSidebarToggler} from '@coreui/react';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
    render() {

        const {children, ...attributes} = this.props;

        return (
            <React.Fragment>
                <AppSidebarToggler className = "d-lg-none" display = "md" mobile/>
                <AppSidebarToggler className = "d-md-down-none" display = "lg"/>

                <Nav className = "ml-auto" navbar>
                    <AppHeaderDropdown direction = "down">
                        <DropdownToggle nav>
                            <i className = "fa fa-user">
                                <img className = "img-avatar"/>
                            </i>
                        </DropdownToggle>
                        <DropdownMenu right style = {{right: 'auto'}}>
                            <DropdownItem header tag = "div"
                                          className = "text-center"><strong>Nalog</strong></DropdownItem>
                            <DropdownItem><i className = "fa fa-user"></i><a
                                href = {"/profil"}>Profil</a></DropdownItem>
                            <DropdownItem><i className = "fa fa-lock"></i><a
                                href = {"/odjava"}>Odjava</a></DropdownItem>
                        </DropdownMenu>
                    </AppHeaderDropdown>
                </Nav>
            </React.Fragment>
        );
    }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
