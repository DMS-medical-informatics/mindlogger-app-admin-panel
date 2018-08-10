import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import {
  Row,
  Col,
  Button,
  Modal,
} from "react-bootstrap";

import ScreenForm from './ScreenForm';
import SurveyListForm from './survey/SurveyListForm';

const mapStateToProps = (state) => ({
  survey_type: formValueSelector('screen-form')(state, 'survey_type')
})

class Screen extends Component {
  componentWillMount() {
    this.setState({});
  }
  close = () => {
    this.setState({form: false});
  }
  renderModal() {
    const {survey_type} = this.props;
    return (
      <Modal show={this.state.form} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>{survey_type}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SurveyListForm onSubmit={this.onSurveyList}/>
        </Modal.Body>
      </Modal>
    )
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if(nextProps.survey_type != this.props.survey_type) {
      this.setState({form: true});
    }
  }
  
  render() {
    return (
      <div className="screen">
        <a href="#display">Screen display</a>
        <br/>
        <a href="#survey">Survey</a>
        <br/>
        <a href="#canvas">Canvas</a>
        <ScreenForm onSubmit={this.onScreen} />
        {this.renderModal()}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(Screen);
