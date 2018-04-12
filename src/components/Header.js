
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Navbar, NavItem, Button, NavDropdown, Nav, MenuItem} from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import {compose} from 'redux'
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
      let {auth} = this.props
      let authed = auth && auth.access_token ? true : false
      
      // let data = [
      //   { name: "http requests", data: [{date: new Date('2014/09/15 13:24:54'), foo: 'bar1'}, {date: new Date('2014/09/15 13:25:03'), foo: 'bar2'}, {date: new Date('2014/09/15 13:25:05'), foo: 'bar1'}] },
      //   { name: "SQL queries", data: [{date: new Date('2014/09/15 13:24:57'), foo: 'bar4'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar6'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar2'}] }
      // ]
      return (
          <Navbar collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Child Mind Institue</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
            </Nav>
            {authed &&
            <Nav pullRight>
              <LinkContainer to="/dashboard"><NavItem>Dashboard</NavItem></LinkContainer>
              <LinkContainer to="/take"><NavItem>Take</NavItem></LinkContainer>
              <NavDropdown title="Manage">
                { auth.role == 'super_admin' && (<LinkContainer to="/organizations"><NavItem>Organizations</NavItem></LinkContainer>)}
                <LinkContainer to="/users"><NavItem>Users</NavItem></LinkContainer>
              </NavDropdown>
              <NavDropdown title="Resource">
                <LinkContainer to="/acts"><NavItem>Activities</NavItem></LinkContainer>
                <LinkContainer to="/images"><NavItem>Images</NavItem></LinkContainer>
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
          </Navbar>
      )
    }
}
const mapDispatchToProps = {
    signout
}
  
const mapStateToProps = (state) => ({
    auth: state.entities.auth
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))
