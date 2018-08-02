
import React, { Component } from 'react'
import { connect } from 'react-redux';
import {Navbar, NavItem, NavDropdown, Nav, MenuItem} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import {withRouter} from 'react-router'

import {signout} from '../actions/api'

class Header extends Component {
    state = { page:1, users: []}
    componentWillMount() {
        
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
      signout().then(res => {
        history.push('/')
      })
    }
    render () {
      let {auth, pageTitle} = this.props
      let authed = auth && auth.access_token ? true : false
      
      // let data = [
      //   { name: "http requests", data: [{date: new Date('2014/09/15 13:24:54'), foo: 'bar1'}, {date: new Date('2014/09/15 13:25:03'), foo: 'bar2'}, {date: new Date('2014/09/15 13:25:05'), foo: 'bar1'}] },
      //   { name: "SQL queries", data: [{date: new Date('2014/09/15 13:24:57'), foo: 'bar4'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar6'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar2'}] }
      // ]
      return (
          <Navbar className="navbar-blue" collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">MindLogger</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavDropdown id="resourceId" title="HBN Menu">
                <LinkContainer eventKey="1" to="/take-acts"><NavItem>Go to Web App</NavItem></LinkContainer>
                <LinkContainer eventKey="2" to="/user-data"><NavItem>View User Data</NavItem></LinkContainer>
                <LinkContainer eventKey="3" to="/acts"><NavItem>Edit Activities</NavItem></LinkContainer>
                <MenuItem disabled>Manage Users</MenuItem>
                <LinkContainer eventKey="5" to="/viewers"><NavItem>&nbsp; Viewers</NavItem></LinkContainer>
                <LinkContainer eventKey="6" to="/editors"><NavItem>&nbsp; Editors</NavItem></LinkContainer>
                <LinkContainer eventKey="6" to="/managers"><NavItem>&nbsp; Managers</NavItem></LinkContainer>
              </NavDropdown>
            </Nav>
            {false && authed &&
            <Nav pullRight>
              <LinkContainer to="/dashboard"><NavItem>Dashboard</NavItem></LinkContainer>
              <LinkContainer to="/take"><NavItem>Take</NavItem></LinkContainer>
              <NavDropdown id="manageId" title="Manage">
                { auth.role === 'super_admin' && (<LinkContainer eventKey="1" to="/organizations"><NavItem>Organizations</NavItem></LinkContainer>)}
                <LinkContainer eventKey="2" to="/users"><NavItem>Users</NavItem></LinkContainer>
              </NavDropdown>
              <NavDropdown id="resourceId" title="Resource">
                <LinkContainer eventKey="1" to="/acts"><NavItem>Activities</NavItem></LinkContainer>
                <LinkContainer eventKey="2" to="/images"><NavItem>Images</NavItem></LinkContainer>
              </NavDropdown>
              
              <NavDropdown id="dropdownId" title={`Hi, ${auth.first_name}`}>
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
    signout
}
  
const mapStateToProps = (state) => ({
    auth: state.entities.auth,
    pageTitle: state.entities.pageTitle,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))
