import React from 'react'
import { FormGroup, FormControl, Col, ControlLabel, HelpBlock, InputGroup, Button, Glyphicon } from 'react-bootstrap'

export const InputField = ({
  input,
  label,
  placeholder,
  options,
  type,
  componentClass,
  readOnly,
  required,
  meta: { touched, error, warning }
}) => (
  <FormGroup validationState={touched && error ? 'error' : null}>
    <Col sm={4}>
      {label && (<ControlLabel>{label}</ControlLabel>) }
    </Col>
    <Col sm={8}>
    <FormControl readOnly={readOnly} {...input} placeholder={placeholder} type={type} componentClass={componentClass} required={required}>
      {componentClass === 'select' && options ? options.map((item, index) => (
        <option key={index} value={item.value}>{item.label}</option>
      )) : undefined}
    </FormControl>
    {touched && error && <HelpBlock>{error}</HelpBlock>}
    </Col>
  </FormGroup>
)

export const InputFieldWithButton = ({
  input,
  label,
  placeholder,
  options,
  type,
  componentClass,
  readOnly,
  required,
  onAction,
  actionIcon,
  meta: { touched, error, warning }
}) => (
  <FormGroup validationState={touched && error ? 'error' : null}>
    {label && (<ControlLabel>{label}</ControlLabel>) }
    <InputGroup>
    <FormControl readOnly={readOnly} {...input} placeholder={placeholder} type={type} componentClass={componentClass} required={required}>
      {componentClass === 'select' && options ? options.map((item, index) => (
        <option key={index} value={item.value}>{item.label}</option>
      )) : undefined}
    </FormControl>
    {
      actionIcon &&
    <InputGroup.Button>
    <Button onClick={onAction} bsStyle="danger"><Glyphicon glyph={actionIcon}/></Button>
    </InputGroup.Button>
    }
    </InputGroup>
    {touched && error && <HelpBlock>{error}</HelpBlock>}
  </FormGroup>
)

// export const DateTimeField = ({
//   input,
//   label,
//   placeholder,
//   dateFormat,
//   timeFormat,
//   type,
//   meta: { touched, error, warning },
//   ...otherProps
// }) => (
//   <FormGroup validationState={touched && error ? 'error' : null}>
//     <ControlLabel>{label}</ControlLabel>
//     <DateTime {...input} inputProps={{ placeholder }} dateFormat={dateFormat} timeFormat={timeFormat} {...otherProps} />
//     {touched && error && <HelpBlock>{error}</HelpBlock>}
//   </FormGroup>
// )
