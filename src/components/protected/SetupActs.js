import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import {BarChart} from 'recharts'
import {Row, Col, Panel, Table, Pagination, Button, Tabs, Tab} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { getAssignedActs, searchActs, assignAct, cancelAct } from "../../actions/api"

class SetupActs extends Component {
    
    componentWillMount() {
        const {searchActs, getAssignedActs, userId} = this.props
        this.setState({actDict: {}, page:1, key:1})
        searchActs('', 0, 10)
        getAssignedActs(userId)
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.assignedActs) {
            console.log(nextProps)
            let actDict = {}
            nextProps.assignedActs.forEach(obj => {
                actDict[obj.id] = true
            })
            this.setState({actDict})
        }
    }

    selectPage = (page) => {
        this.setState({page})
    }

    renderRow = (act, index) => {
        const {assignedActs} = this.props
        const {actDict} = this.state
        var isIncluded = false
        return  (
            <tr key={index}>
                <td>{act.title}</td>
                <td>{act.type}</td>
                <td>
                    {actDict[act.id] ? 
                    <Button bsStyle="danger" onClick={() => this.onDeleteAct(act)}>Delete</Button> :
                    <Button bsStyle="primary" onClick={() => this.onAddAct(act)}>Add</Button>
                    }
                </td>
            </tr>
        )
    }

    onAddAct(act) {
        const { assignAct, userId} = this.props
        assignAct(userId, act.id).then(res => {
            const {actDict} = this.state
            actDict[act.id] = true
            this.setState({actDict: {...actDict}})
        })
    }

    onDeleteAct(act) {
        const { cancelAct, userId} = this.props
        cancelAct(userId, act.id).then(res => {
            const {actDict} = this.state
            actDict[act.id] = false
            this.setState({actDict: {...actDict}})
        })
    }

    render() {
        return (
            <div>
                <h2 className="text-center">Setup Acts</h2>
                <Row>
                <Col xs={12}>
                    <Panel>
                <Tabs activeKey={this.state.key} id="act-tabs" onSelect={this.handleTabSelect}>
                <Tab eventKey={1} title="Assigned Act">
                    {this.renderAssignedActs()}
                </Tab>
                <Tab eventKey={2} title="Setup">
                    {this.renderSetup()}
                </Tab>
                </Tabs>
                </Panel>
                </Col>
                </Row>
            </div>
        )
    }

    handleTabSelect = (key) => {
        const {getAssignedActs, userId} = this.props
        this.setState({key})
        if (key == 1) {
            getAssignedActs(userId)
        }
    }

    renderAssignedActs() {
        const {assignedActs} = this.props
        return (
        <div>
            { assignedActs &&
                <Table responsive bordered>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {assignedActs.map(this.renderRow)}
                    </tbody>
                </Table> }
        </div>
        )
    }
    renderSetup () {
        const {acts, total_count} = this.props
        const total_pages = total_count/10+1
        const {page} = this.state
        
        // let data = [
        //   { name: "http requests", data: [{date: new Date('2014/09/15 13:24:54'), foo: 'bar1'}, {date: new Date('2014/09/15 13:25:03'), foo: 'bar2'}, {date: new Date('2014/09/15 13:25:05'), foo: 'bar1'}] },
        //   { name: "SQL queries", data: [{date: new Date('2014/09/15 13:24:57'), foo: 'bar4'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar6'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar2'}] }
        // ]
        return (
                <div>
                { acts &&
                <Table responsive bordered>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {acts.map(this.renderRow)}
                    </tbody>
                </Table> }
                {acts && <div>
                    <Pagination prev next first last boundaryLinks
                    items={total_pages} maxButtons={5} activePage={page}
                    onSelect={this.selectPage} />
                </div>}
                </div>
        )
    }
}
const mapDispatchToProps = {
    getAssignedActs, searchActs, assignAct, cancelAct
}
  
const mapStateToProps = (state, ownProps) => ({
    users: state.entities.users,
    acts: state.entities.acts,
    assignedActs: state.entities.assigned_acts,
    total_count: state.entities.paging && state.entities.paging.total || 0,
    userId: ownProps.match.params.id
})

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(SetupActs)
