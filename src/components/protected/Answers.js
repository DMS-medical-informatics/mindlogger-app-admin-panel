import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import {Row, Col, Panel, Table, Pagination, Button, Modal} from 'react-bootstrap'
import moment from 'moment'

import './Answers.css'
import AnswerBase from './AnswerBase'

import {base, storageRef} from '../../config/constants'

class Answers extends AnswerBase {
    state = { page:1 }
    componentWillMount() {
        const {userId} = this.props
        
        base.bindToState("answers", {
        context: this,
        state: 'answers',
        keepKeys: true,
        asArray: true,
        queries: {
            orderByChild: 'participant',
            equalTo: userId
        }
        });
    }

    selectPage = (page) => {
        this.setState({page})
    }
    open() {
        this.setState({showModal:true})
    }
    viewDetail = (answer) => {
        this.setState({answer})
        this.open()
    }
    render () {
        const {answers, page, answer} = this.state
        // let data = [
        //   { name: "http requests", data: [{date: new Date('2014/09/15 13:24:54'), foo: 'bar1'}, {date: new Date('2014/09/15 13:25:03'), foo: 'bar2'}, {date: new Date('2014/09/15 13:25:05'), foo: 'bar1'}] },
        //   { name: "SQL queries", data: [{date: new Date('2014/09/15 13:24:57'), foo: 'bar4'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar6'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar2'}] }
        // ]
        return (
        <div>
            <h2 className="text-center">Answers</h2>

            <Row>
            <Col xs={12}>
                { answers ? (
                <Panel header={`Total ${answers.length} Answers`}>
                    <Link to='/users'><Button>Back</Button></Link>
                    <Table responsive bordered>
                        <thead>
                        <tr>
                            <th>Taken at</th>
                            <th>Type</th>
                            <th>Title</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {answers && answers.slice((page-1)*10,page*10).map((answer, index) => (
                            <tr key={index}>
                            <td>{moment(answer.updated_at).format('llll')}</td>
                            <td>{answer.activity_type}</td>
                            <td>{answer.title}</td>
                            <td>
                                <Button bsStyle="info" onClick={() => this.downloadAnswer(answer)}>JSON</Button>
                                {' '}
                                {answer.activity_type === 'voice' && <Button bsStyle="warning" onClick={()=> this.downloadAudioFile(answer)}>Download File</Button>}
                                {' '}
                                {<Button onClick={() => this.viewDetail(answer)}>View Detail</Button>}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <div>
                        <Pagination prev next first last boundaryLinks
                        items={Math.ceil(answers.length/10)} maxButtons={5} activePage={page}
                        onSelect={this.selectPage} />
                    </div>
                </Panel>
                    ) :
                    (
                        <Panel>
                            <Link to='/users'><Button>Back</Button></Link>
                            <p>Loading...</p>
                        </Panel>
                    )
                }
            </Col>
            </Row>
            {answer && this.renderAnswerDialog()}
        </div>
        )
    }
}
const mapDispatchToProps = {
  }
  
const mapStateToProps = (state, ownProps) => ({
    userId: ownProps.match.params.id
})
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(Answers)