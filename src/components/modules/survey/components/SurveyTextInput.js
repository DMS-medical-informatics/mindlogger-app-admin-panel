import React, {Component} from 'react';
import { FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import SurveyInputComponent from './SurveyInputComponent';

class SurveyTextInput extends SurveyInputComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { answer, question} = this.props.data
    this.setState({text: answer || ""})
  }
  onChange = ( text) => {
    this.setState({text})
    this.selectAnswer(text)
  }
  onInputText = () => {
    this.selectAnswer(this.state.text || "")
  }
  render() {
    const { answer, question} = this.props.data
    return (
      <div>
        { !this.props.disableHeader && (<h4>{question.title}</h4>) }
          <FormControl type='text' placeholder='Enter text'
            onChange={this.onChange}
            value={this.state.text}
            onEndEditing={this.onInputText}
            onBlur={this.onInputText}
            />
      </div>
    )
  }
}

export default connect(state => ({
    
  }),
  (dispatch) => ({
    //actions: bindActionCreators(counterActions, dispatch)
  })
)(SurveyTextInput);
