import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import {FormGroup, Button,Row, Col} from 'react-bootstrap'
import { InputField, InputCheckField, InputRadioField } from '../../../forms/FormItems'
import {isRequired} from '../../../forms/validation'

class ScreenForm extends Component {
  render() {
    const {handleSubmit, submitting, index} = this.props
    return (
      <form onSubmit={ handleSubmit }>
        <Field name="name" type="text" label={`Screen ${index} name`} validate={isRequired} component={InputField} className="form-control-auto" />
        <div className="section-title"><a name="display">Screen display</a></div>

        <Row>
          <Col md={3}>
            <a>Picture / Video</a>
          </Col>
          <Col md={9}>
            <Field name="display_video" label="Display picture/video at the top of the screen:" component={InputCheckField} />
            <Field name="display_video_file" label="Upload picture/video" component={InputField} type="file" />
            <Field name="display_playback" label="Show video playback icon and allow replay" component={InputCheckField} />
            <Field name="display_autoplay_video" label="Autoplay video" component={InputCheckField} />
            <div className="num-input-wrapper inline-block">
              Delay video:
              <Field name="display_delay_video" type="number"component={InputField} inline/>
              seconds
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <a>Audio</a>
          </Col>
          <Col md={9}>
            <Field name="display_audio" label="Play audio file:" component={InputCheckField} />
            <Field name="display_audio_file" label="Upload file:" component={InputField} type="file" />
            <Field name="display_playback" label="Show playback icon (left of text) and allow replay" component={InputCheckField} />
            <Field name="display_autoplay_audio" label="Autoplay audio" component={InputCheckField} />
            <div className="num-input-wrapper inline-block">
              Delay audio:
              <Field name="display_delay_audio" type="number" label="Delay audio:" component={InputField} inline/>
              seconds
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <a>Text</a>
          </Col>
          <Col md={9}>
            <Field name="display_text" label="Display text (instructions/question) below picture/video/drawing or above survey:" component={InputField} componentClass="textarea" vertical />
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <a>Text entry</a>
          </Col>
          <Col md={9}>
            <Field name="display_text_entry" label="Display a box to enter text (at the bottom of the screen above navigation buttons)" component={InputCheckField} />
            <Field name="display_text_entry_label" label="Text above text entry box:" component={InputField} componentClass="textarea" vertical/>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <a>Other</a>
          </Col>
          <Col md={9}>
            <Field name="background_color" label="Background color:" component={InputField} componentClass="select" options={[{value: '#fff', label: 'white'}, {value: '#000', label: 'black'}, {value:'#ff0', label: 'yelllow'}]} />
            <div className="num-input-wrapper inline-block">
              Timer:
              <Field name="timer" component={InputField} type="number" inline/>
              seconds
            </div>
            <Field name="show_timer_bar" label="Show timer bar" component={InputCheckField} />
            <Field name="hide_nav_arrow" label="Hide previous / next screen arrow buttons" component={InputCheckField} />
            <Field name="response_delay" label="Response delay(seconds):" component={InputField} type="number"/>
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
            <Field name="survey_type" component={InputRadioField} label="None" value={undefined} />
            <Field name="survey_type" component={InputRadioField} label="Survey list" value="basic"/>
            <Field name="survey_type" component={InputRadioField} label="Survey table" value="table"/>
            <Field name="survey_type" component={InputRadioField} label="Survey list" value="slider"/>
            <Field name="survey_type" component={InputRadioField} label="Survey list" value="audio"/>
          </Col>
        </Row>

        <div className="section-title"><a name="survey">Canvas (if no picture/video display</a></div>
        <Row>
          <Col md={1}>
          </Col>
          <Col md={10}>
            <Field name="canvas_type" component={InputRadioField} label="None" value={undefined} />
            <Field name="canvas_type" component={InputRadioField} label="Take camera photo" value="camera"/>
            <Field name="canvas_type" component={InputRadioField} label="Take camera video" value="video"/>
            <Field name="canvas_type" component={InputRadioField} label="Draw" value="draw"/>
            <Field name="canvas_type" component={InputRadioField} label="Sort pictures" value="sort_pictures"/>
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