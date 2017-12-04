import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import {BarChart} from 'recharts'
import {Row, Col, Panel, Table, Pagination, Button} from 'react-bootstrap'

import {base, storageRef} from '../../config/constants'

class Users extends Component {
    state = { page:1, users: []}
    componentWillMount() {
        base.bindToState("users", {
        context: this,
        state: 'users',
        keepKeys: true,
        defaultValue: [],
        asArray: true
        });
    }
    selectPage = (page) => {
        this.setState(page)
    }

    viewAnswers = (user) => {
        const {history} = this.props
        console.log(user)
        history.push(`/users/${user.key}/answers`)
    }
    render () {
        const {users, page} = this.state
        const total_pages = users.length/10+1
        
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
                    <Table responsive bordered>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {users && users.slice((page-1)*10,10).map((user, index) => (
                            <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                            <td>
                                <Button bsStyle="info" onClick={() => this.viewAnswers(user)}>Answers</Button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <div>
                        <Pagination prev next first last boundaryLinks
                        items={total_pages} maxButtons={5} activePage={page}
                        onSelect={this.selectPage} />
                    </div>
                </Panel>
            </Col>
            </Row>
        </div>
        )
    }
}

export default compose(
    withRouter
)(Users)