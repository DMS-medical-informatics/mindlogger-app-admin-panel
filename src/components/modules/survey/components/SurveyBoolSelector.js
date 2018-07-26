import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import SurveyInputComponent from './SurveyInputComponent'

class SurveyBoolSelector extends SurveyInputComponent {

  render() {
    const { question} = this.props.data
    const { text, rows } =question

    let texts = rows ? rows : ["YES", "NO"]
    let values = [true, false]

    return (
      <div>
        { !this.props.disableHeader && (<h4>{text}</h4>) }
        <div>
        { texts.map((text, idx) => {
          if (values[idx] === this.state.answer) {
            return (<Button success onClick={() => { this.selectAnswer(values[idx]) }} key={idx}>{text}</Button>)
          } else {
            return (<Button light onClick={() => {this.selectAnswer(values[idx])}} key={idx}>{text}</Button>)
          }
        })}
        </div>
      </div>
    )
  }
}

export default connect(state => ({
    
  }),
  (dispatch) => ({
    //actions: bindActionCreators(counterActions, dispatch)
  })
)(SurveyBoolSelector);
