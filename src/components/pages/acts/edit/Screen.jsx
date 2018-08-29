import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import {
  Modal,
} from "react-bootstrap";
import Sugar from 'sugar';

import ScreenForm from './ScreenForm';
import SurveyListForm from './survey/survey-list';
import SurveyTableForm from './survey/survey-table';
import SurveySliderForm from './survey/slider';
import SurveyCanvasDrawForm from './survey/draw';

const mapStateToProps = (state) => ({
  body: formValueSelector('screen-form')(state, 'surveyType', 'canvasType'),
})

class Screen extends Component {
  componentWillMount() {
    if(this.props.index && this.props.screen) {
      const { screen: {survey, canvas }} = this.props;
      this.setState({survey, canvas});
    } else {
      this.setState({});
    }
    
  }
  close = () => {
    this.setState({form: false});
  }

  onSurveyForm = (survey) => {
    this.setState({survey});
    this.close();
  }

  onCanvasForm = (canvas) => {
    this.setState({canvas});
    this.close();
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.screen && nextProps.screen !== this.props.screen) {
      const { screen: {survey, canvas }} = nextProps;
      this.setState({survey, canvas});
    }
    
  }
  

  renderSurveyForm(surveyType) {
    const {survey} = this.state;
    const {screen} = this.props;
    const formProps = {
      onSubmit:this.onSurveyForm,
      data: survey,
      screenId: screen.id,
    }
    switch(surveyType) {
      case 'list':
        return <SurveyListForm {...formProps}/>
      case 'table':
        return <SurveyTableForm {...formProps}/>
      case 'slider':
        return <SurveySliderForm {...formProps}/>
      case 'audio':
      default:
    }
  }
  renderCanvasForm(canvasType) {
    const {screenId} = this.props;
    const {canvas} = this.state;
    switch(canvasType) {
      case 'draw':
        return <SurveyCanvasDrawForm onSubmit={this.onCanvasForm} initialValues={canvas} screenId={screenId}/>
      case 'sort_picture':
        return '';
      default:
        return '';
    }
  }
  renderModal() {
    const {body: {surveyType, canvasType}} = this.props;
    return (
      <Modal show={this.state.form !== false } onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>{ this.state.form === 'survey' ? Sugar.String.capitalize(surveyType) : Sugar.String.capitalize(canvasType)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         { this.state.form === 'survey' ?
          this.renderSurveyForm(surveyType) : this.renderCanvasForm(canvasType)
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

  onFormSubmit = (body) => {
    const {survey, canvas} = this.state;
    this.props.onSaveScreen({...body, canvas, survey});
  }
  
  render() {
    const {index, screen, onFormRef, actId} = this.props;
    return (
      <div className="screen">
        <a href="#display">Screen display</a>
        <br/>
        <a href="#survey">Survey</a>
        <br/>
        <a href="#canvas">Canvas</a>
        { screen && <ScreenForm ref={ref => {
          ref && onFormRef(ref);
          }
        } index={index} onSubmit={this.onFormSubmit} showModal={this.showModal} body={this.props.body || {}} initialValues={screen}/> }
        {this.state.form && this.renderModal()}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(Screen);
