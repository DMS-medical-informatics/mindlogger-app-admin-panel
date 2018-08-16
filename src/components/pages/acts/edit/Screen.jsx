import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import {
  Button,
  Modal,
} from "react-bootstrap";
import Sugar from 'sugar';

import ScreenForm from './ScreenForm';
import SurveyListForm from './survey/survey-list';
import SurveyTableForm from './survey/survey-table';
import SurveySliderForm from './survey/slider';
import SurveyCanvasDrawForm from './survey/draw';

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
        return <SurveyTableForm onSubmit={this.onSurveyForm} />
      case 'slider':
        return <SurveySliderForm onSubmit={this.onSurveyForm} />
      case 'audio':
      default:
    }
  }
  renderCanvasForm(canvas_type) {
    switch(canvas_type) {
      case 'draw':
        return <SurveyCanvasDrawForm onSubmit={this.onCanvasForm} />
      case 'sort_picture':
        return '';
    }
  }
  renderModal() {
    const {body: {survey_type, canvas_type}} = this.props;
    return (
      <Modal show={this.state.form !== false } onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>{ this.state.form === 'survey' ? Sugar.String.capitalize(survey_type) : Sugar.String.capitalize(canvas_type)}</Modal.Title>
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
