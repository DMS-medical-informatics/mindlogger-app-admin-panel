import React from 'react';
import { Checkbox } from 'react-bootstrap';
import { connect } from 'react-redux';

import SurveyInputComponent from './SurveyInputComponent';

class SurveyMultiSelector extends SurveyInputComponent {

  componentWillMount() {
    this.setState({answer: this.props.data.answer || []})
  }

  checkValue = (value) => {
    let answer = this.state.answer
    const index = answer.indexOf(value)
    if(index<0) {
      answer.push(value)
    } else {
      answer.splice(index, 1)
    }
    this.selectAnswer(answer)
  }

  render() {
    const { question} = this.props.data
    const { title, rows } =question
    const {answer} = this.state

    return (
      <div>
        { !this.props.disableHeader && (<h4>{title}</h4>) }
        <div>
        {
          rows.map((row, idx) => {
            return (
              <Checkbox key={idx} onClick={() => this.checkValue(idx)} checked={answer.includes(idx)}>
                {row.text}
              </Checkbox>
              )
          })
        }
        </div>
      </div>
    )
  }
}

export default connect(state => ({
    answers: state.survey && state.survey.answers
  }),
  (dispatch) => ({
    //actions: bindActionCreators(counterActions, dispatch)
  })
)(SurveyMultiSelector);
