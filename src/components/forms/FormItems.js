import React from 'react'
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'

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
    <ControlLabel>{label}</ControlLabel>
    <FormControl readOnly={readOnly} {...input} placeholder={placeholder} type={type} componentClass={componentClass} required={required}>
      {componentClass === 'select' && options ? options.map((item, index) => (
        <option key={index} value={item.value}>{item.label}</option>
      )) : undefined}
    </FormControl>
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
