import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import {Row, Col} from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { InputField } from '../../../forms/FormItems';
import {InputCheckField, InputRadioField, InputRow, InputTextField} from '../../../forms/Material';
import {DisabledInputCheckField, DisabledInputRadioField, DisabledInputTextField, DisabledInputRow} from '../../../forms/Disabled';
import PadBlock from '../../../layout/PadBlock';
import InputFileField from '../../../forms/GInputFileField';

class ScreenForm extends Component {
  componentWillMount() {

  }
  renderModalButton(type) {
    return (<Button variant="contained" onClick={() => this.props.showModal(type)}>Edit</Button>);
  }
  render() {
    const {handleSubmit, body: {surveyType, canvasType}, info, initialValues: {id}} = this.props;
    return (
      <form onSubmit={ handleSubmit }>
        {/* <Field name="name" type="text" label={`Screen ${index+1} name`} validate={isRequired} component={InputField} /> */}
        <div className="section-title"><a id="display">Screen display</a></div>
        <Grid container>
          <Grid item md={3}>
            <a>Picture<span class="disabled"> / Video</span></a>
          </Grid>
          <Grid item md={9}>
            <Field name="pictureVideo[display]" label={<div>Display picture<span class="disabled">/video</span> at the top of the screen:</div>} component={InputCheckField} />
            <PadBlock>
              <Field name="pictureVideo[files]" label={<div>Upload picture<span class="disabled">/video</span></div>} component={InputFileField} data={{parentType: 'item', parentId: id}}/>
              <Field name="pictureVideo[playbackIcon]" label="Show video playback icon and allow replay" component={DisabledInputCheckField} />
              <br/>
              <Field name="pictureVideo[autoplay]" label="Autoplay video" component={DisabledInputCheckField} />
            </PadBlock>
          </Grid>
        </Grid>

        <Row>
          <Col md={3}>
            <a>Audio</a>
          </Col>
          <Col md={9}>
            <Field name="audio[display]" label="Play audio file:" component={InputCheckField} />
            <PadBlock>
              <Field name="audio[files]" label="Upload file:" component={InputFileField} data={{parentType: 'item', parentId: id}}/>
              <Field name="audio[playbackIcon]" label="Show playback icon (left of text) and allow replay" component={InputCheckField} />
              <br/>
              <Field name="audio[autoplay]" label="Autoplay audio" component={InputCheckField} />
            </PadBlock>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <a>Text</a>
          </Col>
          <Col md={9}>
            <Field name="text" label="Display text (instructions/question) below picture/video/drawing or above survey:" component={InputField} componentClass="textarea" vertical />
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <a>Text entry</a>
          </Col>
          <Col md={9}>
            <Field name="textEntry[display]" label="Display a box to enter text (at the bottom of the screen above navigation buttons)" component={InputCheckField} />
            <PadBlock>
              <Field name="textEntry[label]" label="Text above text entry box:" component={InputField} componentClass="textarea" vertical/>
            </PadBlock>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <a>Other</a>
          </Col>
          <Col md={9}>
            <Field name="bgColor" label="Background color:" className="disabled" component={InputField} componentClass="select" options={[{value: '#fff', label: 'white'}, {value: '#000', label: 'black'}, {value:'#ff0', label: 'yelllow'}]} />
            <Field name="timer[enabled]" label="Timer:" component={DisabledInputCheckField} />
            <div className="inline-block">
              <Field name="timer[duration]" component={DisabledInputTextField} type="number"/>
              <span class="disabled">seconds</span>
            </div>
            <PadBlock>
              <Field name="timer[display]" label="Show timer bar" component={DisabledInputCheckField} />
              <br/>
              <Field name="timer[hideNavigation]" label="Hide previous / next screen arrow buttons" component={DisabledInputCheckField} />
            </PadBlock>
            <InputRow>
              <span class="disabled">Response delay(seconds):</span>
              <Field name="responseDelay" component={DisabledInputTextField} type="number"/>
              <span class="disabled">seconds</span>
            </InputRow>
            <Field name="skippable" label="Allow skipping screen (override Activity setting)" component={DisabledInputCheckField} />
            <InputRow>
              If SKIP screen go to screen #:
              <Field name="skipToScreen" component={InputTextField} type="number" inline/>
               (default is next screen)
            </InputRow>
            <InputRow>
              <Field name="redoLimit" label="Maximum times User can redo audio/camera/draw:" component={DisabledInputCheckField} inline/>
              <Field name="attemptLimit" component={DisabledInputTextField} type="number"/>
            </InputRow>
          </Col>
        </Row>
        { !info &&
        <div>
          <div className="section-title"><a id="survey">Survey</a></div>
          <PadBlock>
            <Field name="surveyType" component={InputRadioField} label="None" select={false} />
            <br/>
            <InputRow>
              <Field name="surveyType" component={InputRadioField} label="Survey list" select="list"/>
              { surveyType === 'list' && this.renderModalButton('survey')}
            </InputRow>
            <InputRow>
              <Field name="surveyType" component={InputRadioField} label="Survey table" select="table"/>
              { surveyType === 'table' && this.renderModalButton('survey')}
            </InputRow>
            <InputRow>
              <Field name="surveyType" component={InputRadioField} label="Slider bar" select="slider"/>
              { surveyType === 'slider' && this.renderModalButton('survey')}
            </InputRow>
            <InputRow>
              <Field name="surveyType" component={InputRadioField} label="Time Entry" select="time"/>
            </InputRow>
            <InputRow>
              <Field name="surveyType" component={InputRadioField} label="Record audio" select="audio"/>
            </InputRow>
          </PadBlock>

          <div className="section-title"><a id="canvas" class="disabled">Canvas (if no picture/video display)</a></div>
          <PadBlock>
            <Field name="canvasType" component={InputRadioField} label="None" select={false} />
            <InputRow>
              <Field name="canvasType" component={DisabledInputRadioField} label="Take camera photo" select="camera"/>
            </InputRow>
            <InputRow>
              <Field name="canvasType" component={DisabledInputRadioField} label="Take camera video" select="video"/>
            </InputRow>
            <InputRow>
              <Field name="canvasType" component={DisabledInputRadioField} label="Draw" select="draw"/>
              { canvasType === 'draw' && this.renderModalButton('canvas') }
            </InputRow>
            <InputRow>
              <Field name="canvasType" component={DisabledInputRadioField} label="Sort pictures" select="sort_pictures"/>
              { canvasType === 'sort_pictures' &&  this.renderModalButton('canvas') }
            </InputRow>
          </PadBlock>
          </div>
        }
      </form>
    );
  }
}

export default reduxForm({
  // a unique name for the form
  form: 'screen-form',
  enableReinitialize: true,
})(ScreenForm);
