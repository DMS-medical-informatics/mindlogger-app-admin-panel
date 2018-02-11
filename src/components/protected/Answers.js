import React from 'react'
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
    Popover
} from 'react-bootstrap'
import moment from 'moment'

import './Answers.css'
import AnswerBase from './AnswerBase'
import ActivityChart from '../chart/ActivityChart'
import { DateRange } from 'react-date-range'
import { getAnswers, getAnsweredActs } from '../../actions/api';
const ANSWERS_PER_PAGE = 20

const getActivityChartData = (acts) => {
    let start = new Date()
    let result = acts.map(act => {
        act.answers.forEach(element => {
            let date = new Date(act.updatedAt)
            if(start>date) {
                start = date
            }
        });
        return {name: act.title, data: act.answers}
    })
    return {start, result}
}

const mapDispatchToProps = { getAnswers, getAnsweredActs }

const mapStateToProps = (state, ownProps) => ({
    userId: ownProps.match.params.id,
    users: state.entities.users,
    answers: state.entities.answers,
    answered_acts: state.entities.answered_acts,
    paging: state.entities.paging
})

class Answers extends AnswerBase {
    state = {
        page: 1
    }
    componentWillMount() {
        const {userId, users, getAnswers, getAnsweredActs} = this.props
        let user = users[userId]
        getAnsweredActs(userId).then( res => {
            this.onData()
        })
        getAnswers(userId, 0 , ANSWERS_PER_PAGE)
    }

    selectPage = (page) => {
        const {userId, users, getAnswers, getAnsweredActs} = this.props
        const {range} = this.state
        this.setState({page})
        getAnswers(userId, page*ANSWERS_PER_PAGE , ANSWERS_PER_PAGE, range.startDate, range.endDate)
    }
    open() {
        this.setState({showModal: true})
    }
    viewDetail = (answer) => {
        this.setState({answer})
        this.open()
    }

    onData = () => {
        const {answered_acts} = this.props
        let data = answered_acts && getActivityChartData(answered_acts)
        this.setState({data})
    }

    onSelect = (answer) => {
        this.setState({answer})
        this.open()
    }

    onHover = (answer, event) => {
        const {answered_acts} = this.props
        if (this.state.hover) 
            return
        if (this.outTimerId) 
            clearTimeout(this.outTimerId)
        this.outTimerId = setTimeout(() => this.setState({hover: false}), 2000)
        this.cx = event.clientX
        this.cy = event.clientY
        let act = answered_acts.find(obj => {
            return obj.id == answer.act_id
        })
        this.setState({hover: true, answer:{...answer, type: act.type} })
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
                title={moment(answer.updatedAt).format('llll')}>
                <strong className="capital-text">{answer.type}</strong> activity. Check by clicking it
            </Popover>
        )
    }

    handleSelect = (range) => {
        this.setState({range})
    }

    showRange = () => {
        
    }

    render() {
        const {page, data, showModal, hover, user, range, showRange} = this.state
        const {answers, paging} = this.props
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
                                    <div>
                                    {range && (<p>Range: {range.startDate.format("MM/DD/YYYY")} - {range.endDate.format("MM/DD/YYYY")}</p>)}
                                    {data && 
                                    <DateRange
                                        startDate = {moment(data.start)}
                                        endDate = {moment()}
                                        onInit={this.handleSelect}
                                        onChange={this.handleSelect}
                                    />}
                                    </div>
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
                                            {answers && answers.map((answer, index) => (
                                                <tr key={index}>
                                                    <td>{moment(answer.createdAt).format('llll')}</td>
                                                    <td>{answer.act.type}</td>
                                                    <td>{answer.act.title}</td>
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
                                            items={Math.ceil(paging.count / 10)}
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

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(Answers)