import React, {Component} from 'react';

export default class SurveyInputComponent extends Component {

  componentWillMount() {
    this.setState({answer: this.props.data.answer})
  }
  selectAnswer = (answer, isFinal = false) => {
    const {question, ...data} = this.props.data
    this.setState({ answer })
    this.props.onSelect(answer, data, isFinal)
  }
  render() {
    return (<div></div>)
  }
}