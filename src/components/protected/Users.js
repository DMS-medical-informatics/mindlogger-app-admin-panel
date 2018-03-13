import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { submit } from 'redux-form'
import { withRouter } from 'react-router'
import {BarChart} from 'recharts'
import {Row, Col, Panel, Table, Pagination, Button, Modal} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { getUsers, inviteUser } from "../../actions/api"
import AddUser from '../forms/AddUser';
class Users extends Component {
    
    componentWillMount() {
        this.props.getUsers(0, 10)
        this.setState({page:1})
    }
    selectPage = (page) => {
        this.setState({page})
        this.props.getUsers((page-1)*10, 10)
    }

    viewAnswers = (user) => {
        const {history} = this.props
        history.push(`/users/${user.id}/answers`)
    }

    onAddUser = (body) => {
        return this.props.inviteUser(body).then( res => {
            this.close()
            return this.props.getUsers(0, 10)
        })
    }

    close = (e) => {
        this.setState({form: ''})
    }

    renderInviteUserModal = () => {
        return (<Modal show={this.state.form == 'user'} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Invite User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddUser onSubmit={this.onAddUser} />
        </Modal.Body>
        <Modal.Footer>
            <Button bsStyle="primary" onClick={() => this.props.submit('add-user-form')}>Submit</Button>
            <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>)
    }
    
    render () {
        const {users, total_count, user} = this.props
        const total_pages = total_count/10+1
        const {page} = this.state
        
        // let data = [
        //   { name: "http requests", data: [{date: new Date('2014/09/15 13:24:54'), foo: 'bar1'}, {date: new Date('2014/09/15 13:25:03'), foo: 'bar2'}, {date: new Date('2014/09/15 13:25:05'), foo: 'bar1'}] },
        //   { name: "SQL queries", data: [{date: new Date('2014/09/15 13:24:57'), foo: 'bar4'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar6'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar2'}] }
        // ]
        return (
        <div>
            <h2 className="text-center">Users</h2>

            <Row>
            <Col xs={12}>
                <Panel header="Users">
                    { users &&
                    <Table responsive bordered>
                        <thead>
                        <tr>
                            <th>ID</th>
                            { user.role === 'super_admin' && <th>Email</th> }
                            <th>Name</th>
                            <th>Role</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((member, index) => (
                            <tr key={index}>
                            <td>{member.id}</td>
                            { user.role === 'super_admin' && (<td>{member.email}</td>) }
                            <td>{member.first_name} {member.last_name}</td>
                            <td>{member.role}</td>
                            <td>
                                <LinkContainer to={`/users/${member.id}/setup`}><Button bsStyle="info">Activities</Button></LinkContainer>
                                {" "}
                                <Button bsStyle="info" onClick={() => this.viewAnswers(member)}>Answers</Button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table> }
                    {users && <div>
                        <Pagination prev next first last boundaryLinks
                        items={total_pages} maxButtons={5} activePage={page}
                        onSelect={this.selectPage} />
                    </div>}
                    {user.role === 'super_admin' && <Button onClick={() => this.setState({form:'user'})}>Invite User</Button>}
                </Panel>
            </Col>
            </Row>
            <Row>
            <Col xs={10} xsOffset={1}>
            {this.renderInviteUserModal()}
            </Col>
            </Row>
        </div>
        )
    }
}
const mapDispatchToProps = {
    getUsers, inviteUser, submit
}
  
const mapStateToProps = (state) => ({
    users: state.entities.users,
    total_count: state.entities.paging && state.entities.paging.total || 0,
    user: state.entities.auth || {},
})

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(Users)
