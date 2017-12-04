import React, { Component } from 'react'
import {BarChart} from 'recharts'
import {Row, Col, Panel} from 'react-bootstrap'

import {base, storageRef} from '../../config/constants'
import ActivityChart from '../chart/ActivityChart'
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
    dict[key].push({...answer, date: date})
  })
  let result = []
  Object.keys(dict).forEach(key => {
    console.log(users[key])
    result.push({name: users[key] && users[key].name || "Unknown", data:dict[key]})
  })
  return {start, result}
}
export default class Dashboard extends Component {
  state = {}
  componentWillMount() {
    base.bindToState("surveys", {
      context: this,
      state: 'surveys',
      defaultValue: [],
      asArray: true
    });
    base.bindToState("users", {
      context: this,
      state: 'users',
      defaultValue: [],
    });
    base.bindToState("answers", {
      context: this,
      state: 'answers',
      defaultValue: [],
      asArray: true
    });
  }
  render () {
    const {surveys, answers, users} = this.state
    // let data = [
    //   { name: "http requests", data: [{date: new Date('2014/09/15 13:24:54'), foo: 'bar1'}, {date: new Date('2014/09/15 13:25:03'), foo: 'bar2'}, {date: new Date('2014/09/15 13:25:05'), foo: 'bar1'}] },
    //   { name: "SQL queries", data: [{date: new Date('2014/09/15 13:24:57'), foo: 'bar4'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar6'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar2'}] }
    // ]
    let data = users && answers && getActivityChartData(users,answers)
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
              {data && <ActivityChart data={data} onSelect={data => console.log(data)} />}
            </Panel>
          </Col>
        </Row>
      </div>
  )
  }
}