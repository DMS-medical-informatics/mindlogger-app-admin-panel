import React, {Component} from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';

export default class SurveyInputComponent extends Component {
  constructor(props) {
    super(props);
  }

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