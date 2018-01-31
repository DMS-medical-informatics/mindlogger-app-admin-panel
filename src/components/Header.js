
import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import {BarChart} from 'recharts'
import {Row, Col, Panel, Table, Pagination, Button} from 'react-bootstrap'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
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
    render () {
        let authed = this.props.auth.access_token ? true : false
        let {signout} = this.props
        // let data = [
        //   { name: "http requests", data: [{date: new Date('2014/09/15 13:24:54'), foo: 'bar1'}, {date: new Date('2014/09/15 13:25:03'), foo: 'bar2'}, {date: new Date('2014/09/15 13:25:05'), foo: 'bar1'}] },
        //   { name: "SQL queries", data: [{date: new Date('2014/09/15 13:24:57'), foo: 'bar4'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar6'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar2'}] }
        // ]
        return (
            <nav className="navbar navbar-default navbar-static-top">
            <div className="container">
              <div className="navbar-header">
                <Link to="/" className="navbar-brand">Child Mind Institue</Link>
              </div>
              <ul className="nav navbar-nav pull-right">
                <li>
                  <Link to="/" className="navbar-brand">Home</Link>
                </li>
                <li>
                  <Link to="/dashboard" className="navbar-brand">Dashboard</Link>
                </li>
                <li>
                  <Link to="/users" className="navbar-brand">Users</Link>
                </li>
                <li>
                  <Link to="/images" className="navbar-brand">Images</Link>
                </li>
                <li>
                  {authed
                    ? <button
                        style={{border: 'none', background: 'transparent'}}
                        onClick={() => {
                          signout()
                        }}
                        className="navbar-brand">Logout</button>
                    : <span>
                        <Link to="/login" className="navbar-brand">Login</Link>
                        <Link to="/register" className="navbar-brand">Register</Link>
                      </span>}
                </li>
              </ul>
            </div>
            </nav>
        )
    }
}
const mapDispatchToProps = {
    signout
}
  
const mapStateToProps = (state) => ({
    auth: state.entities.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
