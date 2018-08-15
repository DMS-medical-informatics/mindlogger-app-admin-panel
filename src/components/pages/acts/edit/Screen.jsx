import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import {
  Button,
  Modal,
} from "react-bootstrap";

import ScreenForm from './ScreenForm';
import SurveyListForm from './survey/survey-list';

const mapStateToProps = (state) => ({
  body: formValueSelector('screen-form')(state, 'survey_type', 'canvas_type'),
})

class Screen extends Component {
  componentWillMount() {
    this.setState({});
  }
  close = () => {
    this.setState({form: false});
  }

  onSurveyForm = (body) => {
    this.close();
  }

  renderSurveyForm(survey_type) {
    switch(survey_type) {
      case 'list':
        return <SurveyListForm onSubmit={this.onSurveyForm} />
      case 'table':
      case 'slider':
      case 'audio':
    }
  }
  renderModal() {
    const {body: {survey_type, canvas_type}} = this.props;
    return (
      <Modal show={this.state.form !== false } onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>{survey_type}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         { this.state.form === 'survey' ?
          this.renderSurveyForm(survey_type) : this.renderCanvasForm(canvas_type)
         }
        </Modal.Body>
      </Modal>
    )
  }

  showModal = (type) => {
    if (type === 'survey') {
      this.setState({form: type})
    } else if (type === 'canvas') {
      this.setState({form: type})
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
        <ScreenForm onSubmit={this.onScreen} showModal={this.showModal} body={this.props.body || {}}/>
        {this.state.form && this.renderModal()}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(Screen);
