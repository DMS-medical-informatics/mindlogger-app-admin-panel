import React, {Component} from 'react';
import { Button, Radio } from 'react-bootstrap';
import { connect } from 'react-redux';
import SurveyInputComponent from './SurveyInputComponent';

class SurveySingleSelector extends SurveyInputComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { answer, question} = this.props.data
    const { title, rows } =question

    return (
      <section>
        { !this.props.disableHeader && (<h4>{title}</h4>) }
        {
          rows.map((row, idx) => {
            return (
                <Radio key={idx} selected={idx === this.state.answer} onClick={() => {this.selectAnswer(idx, true)}}>
                  {row.text}
                </Radio>
              )
          })
        }
      </section>
    )
  }
}

export default connect(state => ({
  }),
  (dispatch) => ({
    //actions: bindActionCreators(counterActions, dispatch)
  })
)(SurveySingleSelector);
