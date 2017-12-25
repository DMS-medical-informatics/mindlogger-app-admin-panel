import React from 'react'
import {Row, Col, Panel, Popover} from 'react-bootstrap'
import moment from 'moment'

import {base} from '../../config/constants'
import ActivityChart from '../chart/ActivityChart'
import AnswerBase from './AnswerBase'
import './Dashboard.css'

const getActivityChartData = (users, answers) => {
  let dict = {}
  let start = new Date()
  answers.forEach(answer => {
    let key = answer.participant
    if(!dict[key])
      dict[key] = []
    let date = new Date(answer.updated_at)
    if(start > date)
      start = date
    if(answer.updated_at)
      dict[key].push({...answer, date: date})
  })
  let result = []
  Object.keys(dict).forEach(key => {
    console.log(users[key])
    result.push({name: (users[key] && users[key].name) || "Unknown", data:dict[key]})
  })
  return {start, result}
}
export default class Dashboard extends AnswerBase {
  state = {}
  componentWillMount() {
    base.bindToState("surveys", {
      context: this,
      state: 'surveys',
      defaultValue: [],
      asArray: true
    })
    base.listenTo("users", {
      context: this,
      defaultValue: [],
      then: users => {
        this.setState({users})
        this.onData()
      }}
    );
    base.listenTo("answers", {
      context: this,
      defaultValue: [],
      asArray: true,
      then: answers => {
        this.setState({answers})
        this.onData()
      }
    });
  }

  onData = () => {
    const {answers, users} = this.state
    let data = users && answers && getActivityChartData(users,answers)
    this.setState({data})
  }

  onSelect = (answer) => {
    this.setState({showModal:true, answer})
    console.log(answer)
  }

  onHover = (answer, event) => {
    if(this.state.hover) return
    if(this.outTimerId)
      clearTimeout(this.outTimerId)
    this.outTimerId = setTimeout(() => this.setState({hover: false}),2000)
    this.cx = event.clientX
    this.cy = event.clientY
    this.setState({hover: true, answer})
  }

  onOut = (data) => {
    this.outTimerId = setTimeout(() => this.setState({hover: false}),2000)
  }

  renderHover(){
    const {answer, users} = this.state
    return(<Popover
      id="popover-basic"
      placement="bottom"
      positionLeft={this.cx-140}
      positionTop={this.cy}
      onClick={() => this.onSelect(answer)}
      title={moment(answer.updated_at).format('llll')}
    > {users[answer.participant].name} did <strong>{answer.activity_type}</strong> activity. Check by clicking it
    </Popover>
    )
  }

  render () {
    const {surveys, answers, users, hover} = this.state
    
    return (
      <div>
        <h2 className="text-center">Dashboard</h2>
        <Row>
          <Col xs={4} >
            <Panel header="Users">
              {users && Object.keys(users).length} users
            </Panel>
          </Col>
          <Col xs={4}>
            <Panel header="Surveys">
              {surveys && surveys.length} surveys
            </Panel>
          </Col>
          <Col xs={4}>
            <Panel header="answers">
              {answers && answers.length} answers submitted
            </Panel>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Panel header="Activities">
              <div style={{position:'relative'}} onMouseOver={this.mouseOver}>
              {this.state.data && <ActivityChart data={this.state.data} onSelect={this.onSelect} onHover={this.onHover} onOut={this.onOut} onColor={this.onColor} />}
              </div>
            </Panel>
          </Col>
        </Row>
        { hover && this.renderHover()}
        { this.state.showModal && this.renderAnswerDialog()}
      </div>
  )
  }
}