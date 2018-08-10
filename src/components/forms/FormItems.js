import React, {Component} from 'react'
import { FormGroup, FormControl,Row, Col, ControlLabel, HelpBlock, InputGroup, Button, Glyphicon } from 'react-bootstrap'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';

export class InputField extends Component {
  renderLabel() {
    const {label} = this.props;
    return label && (<ControlLabel>{label}</ControlLabel>);
  }
  renderControl() {
    const {
      input,
      placeholder,
      options,
      type,
      componentClass,
      readOnly,
      required,
      inline,
    } = this.props;
    return (<FormControl readOnly={readOnly} {...input} placeholder={placeholder} type={type} componentClass={componentClass} required={required} className={inline ? "form-control-inline" : ""}>
        {componentClass === 'select' && options ? options.map((item, index) => (
          <option key={index} value={item.value}>{item.label}</option>
        )) : undefined}
      </FormControl>);
  }
  render() {
    const {
      vertical,
      inline,
      className,
      meta: { touched, error, warning }
    } = this.props;
    return inline ? 
          (this.renderControl())
          :
          (<FormGroup validationState={touched && error ? 'error' : null} className={className}>
          <Row>
            <Col sm={ vertical ? 12 : 3}>
              {this.renderLabel()}
            </Col>
            <Col sm={ vertical ? 12 : 9}>
              {this.renderControl()}
              {touched && error && <HelpBlock>{error}</HelpBlock>}
            </Col>
          </Row>
          </FormGroup>);
  }
}


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

export const InputCheckField = ({
  input,
  label,
  inline,
  required,
  meta: { touched, error, warning }
}) => 
  { 
    return (<FormControlLabel
      classes={{
        label: "form-label"
      }}
      control={
        <Checkbox
          onChange={() => input.onChange(input.value != true)}
          checked={input.value === true}
          color="default"
        />
      }
      label={label}
    />)
  }


export const InputRadioField = ({
  input,
  label,
  select,
  required,
  meta: { touched, error, warning }
}) => {
  return (<FormControlLabel
    classes={{
      label: "form-label"
    }}
    control={
      <Radio
        onChange={() => input.onChange(select)}
        checked={input.value === select}
        color="default"
        value={select}
      />
    }
    label={label}
  />)
}
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
