import React, { Component } from 'react'
import {Modal, Button, Table, Glyphicon} from 'react-bootstrap'
import moment from 'moment'

import { storageRef} from '../../config/constants'
import './Answers.css'

function currentTime() {
  return (new Date()).getTime()
}

export default class AnswerBase extends Component {

  downloadAnswer = (answer) => {
    const path = `answers/${answer.activity_type}_${answer.title}_${moment(answer.updated_at).format('M-D-YYYY')}.json`
    var ref = storageRef.child(path)
    let uploadTask
    switch(answer.activity_type) {
        default:
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

  renderLine = (line, idx) => {
    let points
    const {time} = this.state
    if(time === undefined) {
      points = line.points
    } else {
      points = line.points.filter(point => point.time<time)
    }
    
    const pointStr = points.map(point => `${point.x*3},${point.y*3}`).join(" ")
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
  renderSurveyRow = (idx, question, answer) => {
    if(answer === undefined) {
      return (<tr key={idx}><td>{idx+1}</td><td></td><td></td></tr>)
    }
    let answerText = answer
    switch(question.type) {
      case 'bool':
        answerText = answer ? "True":"False"
        break;
      case 'single_sel':
        answerText = question.rows[answer].text
        break;
      case 'multi_sel':
        answerText = (answer.map((item, idx) => question.rows[item].text )).join(", ")
        break;
      default:
        answerText = answer
        break;
    }

    if(question.type === 'image_sel')
      return (<tr key={idx} ><td>{idx+1}</td><td>{question.title}</td><td> <img key={idx} src={question.images[answer].image_url} alt={answer} height="50px" /></td></tr>)
    else
      return (
        <tr key={idx}>
          <td>{idx+1}</td>
          <td>{question.title}</td><td>{answerText}</td>
        </tr>
      );
  }

  renderTableSurveyCell(question, rowIdx, colIdx, answer) {
    switch(question.type) {
          case 'text':
            return answer[rowIdx][colIdx]
          case 'number':
            return answer[rowIdx][colIdx]
          case 'single_sel':
            return answer[rowIdx] == colIdx && (<Glyphicon glyph="glyphicon glyphicon-ok" />)
          case 'multi_sel':
            return answer[rowIdx][colIdx] && (<Glyphicon glyph="glyphicon glyphicon-ok" />)
          case 'image_sel':
            return <img src={question.cols[colIdx].image_url} className={answer[rowIdx] == colIdx ? "" : "unselected-image" } height="50px" alt={answer[rowIdx]}/>
          default:
            break
    }
  }

  playImage() {
    if(this.intervalId)
      clearInterval(this.intervalId)
    this.startTime = currentTime()
    this.intervalId = setInterval(() => {
      const time = currentTime() - this.startTime
      if(this.state.answer.updated_at - this.state.answer.start_time<time) {
        clearInterval(this.intervalId)
        this.setState({time: undefined})
      } else {
        this.setState({time})
      }
    },100)
  }

  renderActivity(data) {
    if(data.activity_type === 'survey') {
      const {questions} = data
      if(data.mode==='basic') {
        return (
          <Table striped bordered condensed hover>
            <thead>
            <tr><th></th><th>Question</th><th>Answer</th></tr>
            </thead>
            <tbody>
            {questions.map((question,idx) => data.answers && this.renderSurveyRow(idx, question, data.answers[idx].result))}
            </tbody>
          </Table>)
      } else {
        return questions.map((question,idx) => (
          <div key={idx}>
          <h4>{idx+1}.{question.title}</h4>
          <Table striped bordered condensed hover>
          <thead>
          <tr>
          <th></th>
          {question.cols.map((col, idx) => (<th key={idx}>{col.text}</th>))}
          </tr>
          </thead>
          <tbody>
          {question.rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
                <td>{row.text}</td>
                {question.cols.map( (col, colIdx) => <td key={colIdx}>{data.answers && this.renderTableSurveyCell(question, rowIdx, colIdx, data.answers[idx].result)}</td> )}
            </tr>))}
          </tbody>
          </Table>
          </div>))
      }
      
    } else if(data.activity_type === 'drawing') {
      return (
        <div className="drawboard-container">
          <img src={data.image_url} className="drawboard-image" />
          <div className="drawboard">
              <svg width="300" height="300">
              {data.lines.map(this.renderLine)}
              </svg>
          </div>
        </div>)
    } else if (data.activity_type === 'voice') {
      return (
        <div>
        <audio controls="controls">
        <source src={data.output_url} type="audio/mp4" />
        </audio>
        </div>
      )
    }
  }

  renderAnswerDialog() {
    const {answer, users} = this.state
    return (
        <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title><b>{answer.title}</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="activity-info">
              <h4>Taken at : {moment(answer.updated_at).format('llll')}</h4>
              <h4>Activity Type: {answer.activity_type}</h4>
              {users && (<h4>Patient: {users[answer.participant] && users[answer.participant].name}</h4>)}
            </div>
              {this.renderActivity(answer)}
            <div>
              <Button bsStyle="primary" onClick={() => this.downloadAnswer(answer)}><Glyphicon glyph="download" />JSON</Button>
              {' '}
              {answer.activity_type === 'voice' && <Button bsStyle="warning" onClick={()=> this.downloadAudioFile(answer)}><Glyphicon glyph="download-alt" />Download File</Button>}
              {answer.activity_type === 'drawing' && <Button bsStyle="info" onClick={()=> this.playImage()}><Glyphicon glyph="play" />Play</Button>}
            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
    </Modal>)

}
}