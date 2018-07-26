import React, {Component} from 'react'
import { FormGroup, FormControl,Row, Col, ControlLabel, HelpBlock, InputGroup, Button, Glyphicon, Checkbox, Radio } from 'react-bootstrap'

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
    return inline ? [
      (<Checkbox key={1} checked={input.value} {...input} required={required} inline>
        {label}
      </Checkbox>), touched && error && <HelpBlock key={2}>{error}</HelpBlock>] :
    (<FormGroup validationState={touched && error ? 'error' : null}>
      <Checkbox checked={input.value} {...input} required={required}>
        {label}
      </Checkbox>
      {touched && error && <HelpBlock>{error}</HelpBlock>}
    </FormGroup>)
  }


export const InputRadioField = ({
  input,
  label,
  required,
  value,
  meta: { touched, error, warning }
}) => (
  <FormGroup validationState={touched && error ? 'error' : null}>
    <Radio {...input} required={required} onClick={() => input.onChange(value)} value={value}>
      {label}
    </Radio>
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
