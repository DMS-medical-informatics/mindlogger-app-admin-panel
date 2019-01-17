
import React, { Component } from 'react'
import { connect } from 'react-redux';
import {Navbar, NavItem, NavDropdown, Nav} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import {withRouter} from 'react-router'

import {signout} from '../actions/api';
import {setPageTitle} from '../actions/core';

class Header extends Component {
    state = { page:1, users: []}
    componentWillMount() {
    }

    componentWillUpdate(nextProps) {
      if (this.props.location.pathname !== nextProps.location.pathname) {
        this.props.setPageTitle("");
      }
    }
    selectPage = (page) => {
        this.setState({page})
    }

    viewAnswers = (user) => {
        const {history} = this.props
        console.log(user)
        history.push(`/users/${user.key}/answers`)
    }
    onSignout = () => {
      let {signout} = this.props
      const {history} = this.props
      signout();
      history.push('/');
    }

    render () {
      let {auth, user, pageTitle, volume} = this.props;
      let authed = auth && auth.token && user ? true : false

      let {viewers, managers, editors} = (volume && volume.meta && volume.meta.members) || {};
      let canView = false;
      let canManage = false;
      let canEdit = false;

      canView = viewers && Object.keys(viewers).includes(user._id)
      canManage = managers && managers.includes(user._id)
      canEdit = editors && editors.includes(user._id);

      return (
          <Navbar className="navbar-blue" collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to={authed ? "/library" : "/"}><img alt="MindLogger" className="logo" src="mindlogger-app-admin-panel/logo.svg"/>MindLogger</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            {volume &&
            <Nav>
              <NavDropdown id="resourceId" title={`${volume.meta && volume.meta.shortName} Menu`}>
                {/* <LinkContainer eventKey="1" to="/take-acts"><NavItem>Go to Web App</NavItem></LinkContainer> */}
                { canView && <LinkContainer eventKey="2" to="/user-data"><NavItem>View User Data</NavItem></LinkContainer> }
                { canEdit && <LinkContainer eventKey="3" to="/acts"><NavItem>Edit Activities</NavItem></LinkContainer> }
                { canManage && <LinkContainer eventKey="4" to="/users"><NavItem>Manage Users</NavItem></LinkContainer> }
                { canManage && <LinkContainer eventKey="5" to="/viewers"><NavItem>&nbsp; Viewers</NavItem></LinkContainer> }
                { canManage && <LinkContainer eventKey="6" to="/editors"><NavItem>&nbsp; Editors</NavItem></LinkContainer> }
                { canManage && <LinkContainer eventKey="7" to="/managers"><NavItem>&nbsp; Managers</NavItem></LinkContainer> }
              </NavDropdown>
            </Nav>
            }
            {authed &&
            <Nav pullRight>
              {/* <LinkContainer to="/dashboard"><NavItem>Dashboard</NavItem></LinkContainer>
              <LinkContainer to="/take"><NavItem>Take</NavItem></LinkContainer>
              <NavDropdown id="manageId" title="Manage">
                { user.role === 'super_admin' && (<LinkContainer eventKey="1" to="/organizations"><NavItem>Organizations</NavItem></LinkContainer>)}
                <LinkContainer eventKey="2" to="/users"><NavItem>Users</NavItem></LinkContainer>
              </NavDropdown>
              <NavDropdown id="resourceId" title="Resource">
                <LinkContainer eventKey="1" to="/acts"><NavItem>Activities</NavItem></LinkContainer>
                <LinkContainer eventKey="2" to="/images"><NavItem>Images</NavItem></LinkContainer>
              </NavDropdown> */}

              <NavDropdown id="dropdownId" title={`Hi, ${user.firstName}`}>
                <LinkContainer eventKey="1" to="/profile"><NavItem>Profile</NavItem></LinkContainer>
                <NavItem eventKey="2" onClick={this.onSignout}>Logout</NavItem>
              </NavDropdown>
            </Nav>
            }
            {!authed && (
            <Nav pullRight>
              <LinkContainer to="/login"><NavItem>
                Login
              </NavItem></LinkContainer>
              <LinkContainer to="/register"><NavItem>
                Register
              </NavItem>
              </LinkContainer>
              </Nav>)}
          </Navbar.Collapse>
          <div className="page-title">
            {pageTitle}
          </div>
          </Navbar>
      )
    }
}
const mapDispatchToProps = {
    signout,
    setPageTitle
}

const mapStateToProps = ({entities: {auth, self, volume, pageTitle}}) => ({
    auth,
    user: self,
    volume,
    pageTitle,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))
