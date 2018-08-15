import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import {FormGroup, Button,Row, Col} from 'react-bootstrap';
import cn from 'classnames';

import { InputField, InputCheckField, InputRadioField } from '../../../../../forms/FormItems'
import {isRequired} from '../../../../../forms/validation'

class SurveyListTypeForm extends Component {
  
  render() {
    const {handleSubmit, submitting} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="wizard">
          <Row>
            <Col md={8}>
              Number of response options:
            </Col>
            <Col md={4}>
              <Field name="options_count" component={InputField} type="number" inline />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              Maximum number of options to select:
            </Col>
            <Col md={4}>
              <Field name="options_max_count" component={InputField} type="number" inline />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              Minimum number of options to select:
            </Col>
            <Col md={4}>
              <Field name="options_min_count" component={InputField} type="number" inline />
            </Col>
          </Row>
          
          <Field name="mode" label="Enter text or upload pictures for a single set of response options" component={InputRadioField} select="single" />
          <Field name="mode" label="Specify order for multiple presentations of text or picture response options" component={InputRadioField} select="order" />
          <div className="wizard-footer">
            <Button color="primary" type="submit">Next</Button>
          </div>
        </div>
      </form>
    );
  }
}
export default reduxForm({
  // a unique name for the form
  form: 'survey-list-form',
  destoryOnUnmount: false,
})(SurveyListTypeForm);