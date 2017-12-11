import React, { Component } from 'react'
import {BarChart} from 'recharts'
import {Row, Col, Panel, Popover, Modal, Button} from 'react-bootstrap'
import moment from 'moment'

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
    if(answer.updated_at)
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

  downloadAnswer = (answer) => {
    console.log(answer)
    const path = `answers/${answer.activity_type}_${answer.title}_${moment(answer.updated_at).format('M-D-YYYY')}.json`
    var ref = storageRef.child(path)
    let uploadTask
    switch(answer.activity_type) {
        default:
            console.log(JSON.stringify(answer))
            uploadTask = ref.putString(JSON.stringify(answer,null, 2))
            break
    }
    if(!uploadTask) return
    uploadTask.then(function(snapshot) {
        var downloadUrl = snapshot.downloadURL;
        window.location.href = downloadUrl;
    });
  }

  downloadAudioFile = (answer) => {
      window.location.href = answer.output_url
  }

  renderLine(line, idx) {
    const pointStr = line.points.map(point => point.join(",")).join(" ")
    return (<polyline key={idx}
        points={pointStr}
        fill={line.fill || 'none'}
        stroke="black"
        strokeWidth="3"
    />)
  }

  close = () => {
    this.setState({showModal:false})
  }

  renderAnswerDialog() {
    const {answer, users} = this.state
    return (
        <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{answer.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div>
              <h4>Taken at : {moment(answer.updated_at).format('llll')}</h4>
              <h4>Activity Type: {answer.activity_type}</h4>
              <h4>Patient: {users[answer.participant] && users[answer.participant].name}</h4>
            </div>
            {(answer.activity_type === 'image') &&
            <div className="drawboard-container">
                <img src={answer.image_url} className="drawboard-image" />
                <div className="drawboard">
                    <svg width="300" height="200">
                    {answer.lines.map(this.renderLine)}
                    </svg>
                </div>
            </div>}
            <div>
              <Button bsStyle="info" onClick={() => this.downloadAnswer(answer)}>Download</Button>
              {' '}
              {answer.activity_type === 'voice' && <Button bsStyle="warning" onClick={()=> this.downloadAudioFile(answer)}>Download File</Button>}
            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
    </Modal>)

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
    console.log(answer)
    let str = `${users[answer.participant].name} did ${answer.activity_type} activity. Check by clicking it`
    console.log(str.length)
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
    const {surveys, answers, users, hover, data} = this.state
    // let data = [
    //   { name: "http requests", data: [{date: new Date('2014/09/15 13:24:54'), foo: 'bar1'}, {date: new Date('2014/09/15 13:25:03'), foo: 'bar2'}, {date: new Date('2014/09/15 13:25:05'), foo: 'bar1'}] },
    //   { name: "SQL queries", data: [{date: new Date('2014/09/15 13:24:57'), foo: 'bar4'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar6'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar2'}] }
    // ]
    
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
              {this.state.data && <ActivityChart data={this.state.data} onSelect={this.onSelect} onHover={this.onHover} onOut={this.onOut} />}
              
              </div>
            </Panel>
          </Col>
        </Row>
        { hover && this.renderHover()}
        { this.state.answer && this.renderAnswerDialog()}
      </div>
  )
  }
}