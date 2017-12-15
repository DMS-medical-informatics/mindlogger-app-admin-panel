import React, {Component} from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'
import {
    Row,
    Col,
    Panel,
    Table,
    Pagination,
    Button,
    Modal,
    Popover
} from 'react-bootstrap'
import moment from 'moment'

import './Answers.css'
import AnswerBase from './AnswerBase'
import ActivityChart from '../chart/ActivityChart'
import {base, storageRef} from '../../config/constants'

const getActivityChartData = (answers) => {
    let dict = {}
    let start = new Date()
    answers.forEach(answer => {
        let key = answer.uuid
        if (!dict[key]) 
            dict[key] = []
        let date = new Date(answer.updated_at)
        if (start > date) 
            start = date
        if (answer.updated_at) 
            dict[key].push({
                ...answer,
                date: date
            })
    })
    let result = []
    Object
        .keys(dict)
        .forEach(key => {
            result.push({name: dict[key][0].title,
                data: dict[key]
            })
        })
    return {start, result}
}

class Answers extends AnswerBase {
    state = {
        page: 1
    }
    componentWillMount() {
        const {userId} = this.props

        base.listenTo("answers", {
            context: this,
            state: 'answers',
            keepKeys: true,
            asArray: true,
            queries: {
                orderByChild: 'participant',
                equalTo: userId
            },
            then: answers => {
                this.setState({answers})
                this.onData()
            }
        });

        base.bindToState(`users/${userId}`,{
            context: this,
            state: 'user',
        })
    }

    selectPage = (page) => {
        this.setState({page})
    }
    open() {
        this.setState({showModal: true})
    }
    viewDetail = (answer) => {
        this.setState({answer})
        this.open()
    }

    onData = () => {
        const {answers} = this.state
        let data = answers && getActivityChartData(answers)
        this.setState({data})
    }

    onSelect = (answer) => {
        this.setState({answer})
        this.open()
    }

    onHover = (answer, event) => {
        if (this.state.hover) 
            return
        if (this.outTimerId) 
            clearTimeout(this.outTimerId)
        this.outTimerId = setTimeout(() => this.setState({hover: false}), 2000)
        this.cx = event.clientX
        this.cy = event.clientY
        this.setState({hover: true, answer})
    }

    onOut = (data) => {
        this.outTimerId = setTimeout(() => this.setState({hover: false}), 2000)
    }

    renderHover() {
        const {answer} = this.state
        return (
            <Popover
                id="popover-basic"
                placement="bottom"
                positionLeft={this.cx - 140}
                positionTop={this.cy}
                style={{width:'280px'}}
                onClick={() => this.onSelect(answer)}
                title={moment(answer.updated_at).format('llll')}>
                <strong className="capital-text">{answer.activity_type}</strong> activity. Check by clicking it
            </Popover>
        )
    }

    render() {
        const {answers, page, answer, data, showModal, hover, user} = this.state
        return (
            <div>
                <Link to='/users'>
                    <Button>Back</Button>
                </Link>
                <h2 className="text-center">{user && user.name}</h2>
                <Row>
                    <Col xs={12}>
                        <Panel header={`Activity map`}>
                            {data && <ActivityChart
                                data={data}
                                onSelect={this.onSelect}
                                onHover={this.onHover}
                                onOut={this.onOut}
                                onColor={this.onColor}/>}
                        </Panel>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        {answers
                            ? (
                                <Panel header={`Total ${answers.length} Answers`}>
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
                                            {answers && answers.slice((page - 1) * 10, page * 10).map((answer, index) => (
                                                <tr key={index}>
                                                    <td>{moment(answer.updated_at).format('llll')}</td>
                                                    <td>{answer.activity_type}</td>
                                                    <td>{answer.title}</td>
                                                    <td>
                                                        <Button bsStyle="info" onClick={() => this.downloadAnswer(answer)}>JSON</Button>
                                                        {' '}
                                                        {answer.activity_type === 'voice' && <Button bsStyle="warning" onClick={() => this.downloadAudioFile(answer)}>Download File</Button>}
                                                        {' '}
                                                        {<Button onClick = {
                                                            () => this.viewDetail(answer)
                                                        }> View Detail </Button>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                    <div>
                                        <Pagination
                                            prev
                                            next
                                            first
                                            last
                                            boundaryLinks
                                            items={Math.ceil(answers.length / 10)}
                                            maxButtons={5}
                                            activePage={page}
                                            onSelect={this.selectPage}/>
                                    </div>
                                </Panel>
                            )
                            : (
                                <Panel>
                                    <Link to='/users'>
                                        <Button>Back</Button>
                                    </Link>
                                    <p>Loading...</p>
                                </Panel>
                            )
}
                    </Col>
                </Row>
                { hover && this.renderHover()}
                { showModal && this.renderAnswerDialog()}
            </div>
        )
    }
}
const mapDispatchToProps = {}

const mapStateToProps = (state, ownProps) => ({userId: ownProps.match.params.id})
export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(Answers)