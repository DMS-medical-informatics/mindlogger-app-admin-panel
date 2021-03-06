import React from 'react'
import { Field, reduxForm } from "redux-form";
import {
  Button,
  Form,
} from "react-bootstrap";

import { InputField } from "../../forms/FormItems";
import InputFileField from "../../forms/InputFileField";
import { isRequired } from "../../forms/validation";

export default reduxForm({
  form: "add-volume-form"
})(({ handleSubmit, pristine, submitting, updating }) => (
  <div>
  <Form onSubmit={handleSubmit}>
    <Field
      name="shortName"
      type="text"
      component={InputField}
      label="Short Name"
      placeholder=""
      validate={isRequired}
    />
    <Field
      name="name"
      type="text"
      component={InputField}
      label="Full Name"
      placeholder=""
      validate={isRequired}
    />
    <Field
      name="description"
      type="text"
      componentClass="textarea"
      component={InputField}
      label="Description"
      placeholder=""
      validate={isRequired}
    />
    <Field
      name="logo"
      type="file"
      component={InputFileField}
      label="Logo"
      placeholder=""
      accept="image/*"
    />
    <center>
    <Button
      bsStyle="primary"
      type="submit"
    >
      Save
    </Button>
    </center>
  </Form>
  </div>
));
