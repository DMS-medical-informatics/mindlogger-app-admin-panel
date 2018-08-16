import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import {FormGroup, Row, Col} from 'react-bootstrap';
import Button from '@material-ui/core/Button';

import { InputField } from '../../../forms/FormItems';
import {InputCheckField, InputRadioField, InputRow} from '../../../forms/Material';
import {isRequired} from '../../../forms/validation'
import PadBlock from '../../../layout/PadBlock';
import InputFileField from '../../../forms/InputFileField';

class ScreenForm extends Component {
  renderModalButton(type) {
    return (<Button variant="contained" onClick={() => this.props.showModal(type)}>Edit</Button>);
  }
  render() {
    const {handleSubmit, submitting, index, body: {survey_type, canvas_type}} = this.props
    return (
      <form onSubmit={ handleSubmit }>
        <Field name="name" type="text" label={`Screen ${index} name`} validate={isRequired} component={InputField} className="form-control-auto" />
        <div className="section-title"><a name="display">Screen display</a></div>
        
        <Row>
          <Col md={3}>
            <a>Picture / Video</a>
          </Col>
          <Col md={9}>
            <Field name="display[video]" label="Display picture/video at the top of the screen:" component={InputCheckField} />
            <PadBlock>
              <Field name="display[video_file]" label="Upload picture/video" component={InputFileField}/>
              <Field name="display[video_playback]" label="Show video playback icon and allow replay" component={InputCheckField} />
              <br/>
              <Field name="display[video_autoplay]" label="Autoplay video" component={InputCheckField} />
            </PadBlock>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <a>Audio</a>
          </Col>
          <Col md={9}>
            <Field name="display[audio]" label="Play audio file:" component={InputCheckField} />
            <PadBlock>
              <Field name="display[audio_file]" label="Upload file:" component={InputFileField} />
              <Field name="display[audio_playback]" label="Show playback icon (left of text) and allow replay" component={InputCheckField} />
              <br/>
              <Field name="display[audio_autoplay]" label="Autoplay audio" component={InputCheckField} />
            </PadBlock>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <a>Text</a>
          </Col>
          <Col md={9}>
            <Field name="display[text]" label="Display text (instructions/question) below picture/video/drawing or above survey:" component={InputField} componentClass="textarea" vertical />
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <a>Text entry</a>
          </Col>
          <Col md={9}>
            <Field name="display[text_entry]" label="Display a box to enter text (at the bottom of the screen above navigation buttons)" component={InputCheckField} />
            <PadBlock>
              <Field name="display[text_entry_label]" label="Text above text entry box:" component={InputField} componentClass="textarea" vertical/>
            </PadBlock>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <a>Other</a>
          </Col>
          <Col md={9}>
            <Field name="background_color" label="Background color:" component={InputField} componentClass="select" options={[{value: '#fff', label: 'white'}, {value: '#000', label: 'black'}, {value:'#ff0', label: 'yelllow'}]} />
            <Field name="timer" label="Timer:" component={InputCheckField} />
            <div className="num-input-wrapper inline-block">
              <Field name="timer_duration" component={InputField} type="number" inline/>
              seconds
            </div>
            <PadBlock>
              <Field name="show_timer_bar" label="Show timer bar" component={InputCheckField} />
              <br/>
              <Field name="hide_nav_arrow" label="Hide previous / next screen arrow buttons" component={InputCheckField} />
            </PadBlock>
            <div className="num-input-wrapper inline-block">
              Response delay(seconds):
              <Field name="response_delay"component={InputField} type="number" inline/>
              seconds
            </div>
            <Field name="allow_skip" label="Allow skipping screen (override Activity setting)" component={InputCheckField} />
            <div className="num-input-wrapper">
              If SKIP screen go to screen #:
              <Field name="skip_to" component={InputField} type="number" inline/>
            </div>
            <FormGroup>
              <Field name="redo_limit" label="Maximum times User can redo audio/camera/draw:" component={InputCheckField} inline/>
              <div className="num-input-wrapper inline-block">
                <Field name="redo_limit_count" component={InputField} type="number" inline/>
              </div>
            </FormGroup>
          </Col>
        </Row>

        <div className="section-title"><a name="survey">Survey</a></div>
        <Row>
          <Col md={1}>
          </Col>
          <Col md={10}>
            <Field name="survey_type" component={InputRadioField} label="None" select="none" />
            <br/>
            <InputRow>
              <Field name="survey_type" component={InputRadioField} label="Survey list" select="list"/>
              { survey_type === 'list' && this.renderModalButton('survey')}
            </InputRow>
            <InputRow>
              <Field name="survey_type" component={InputRadioField} label="Survey table" select="table"/>
              { survey_type === 'table' && this.renderModalButton('survey')}
            </InputRow>
            <InputRow>
              <Field name="survey_type" component={InputRadioField} label="Slider bar" select="slider"/>
              { survey_type === 'slider' && this.renderModalButton('survey')}
            </InputRow>
            <InputRow>
              <Field name="survey_type" component={InputRadioField} label="Record audio" select="audio"/>
            </InputRow>
          </Col>
        </Row>

        <div className="section-title"><a name="survey">Canvas (if no picture/video display)</a></div>
        <Row>
          <Col md={1}>
          </Col>
          <Col md={10}>
            <Field name="canvas_type" component={InputRadioField} label="None" select="none" />
            <InputRow>
              <Field name="canvas_type" component={InputRadioField} label="Take camera photo" select="camera"/>
              { canvas_type === 'camera' && this.renderModalButton('canvas') }
            </InputRow>
            <InputRow>
              <Field name="canvas_type" component={InputRadioField} label="Take camera video" select="video"/>
              { canvas_type === 'video' && this.renderModalButton('canvas') }
            </InputRow>
            <InputRow>
              <Field name="canvas_type" component={InputRadioField} label="Draw" select="draw"/>
              { canvas_type === 'draw' && this.renderModalButton('canvas') }
            </InputRow>
            <InputRow>
              <Field name="canvas_type" component={InputRadioField} label="Sort pictures" select="sort_pictures"/>
              { canvas_type === 'sort_picture' &&  this.renderModalButton('canvas') }
            </InputRow>
          </Col>
        </Row>
        <Button type="submit" disabled={submitting}>Submit</Button>
      </form>
    );
  }
}

export default reduxForm({
  // a unique name for the form
  form: 'screen-form'
})(ScreenForm);