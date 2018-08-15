import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import Grid from '@material-ui/core/Grid';

export const InputRow = ({
  label,
  row,
  children
}) => (
  <Grid container alignItems="center">
    {
      label &&
            <Grid item xs={row || 6}>
              {label}
            </Grid>
    }
    {children}
  </Grid>
)

export const InputTextField = ({
  input,
  placeholder,
  options,
  type,
  componentClass,
  readOnly,
  required,
  className,
  meta: { touched, error, warning }
}) => (
  <FormControl error={touched && error && true} className={className}>
    <Input type={type} value={input.value} readOnly={readOnly} onChange={value => input.onChange((type === 'number' && !isNaN(value)) ? Number(value) : value )} placeholder={placeholder} required={required} className={`form-input form-control-${type}`} />
    {touched && error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>);
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
  className,
  meta: { touched, error, warning }
}) => {
  return (
    <FormControl error={touched && error && true} className={className}>
      <FormControlLabel
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
      />
      {touched && error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>)
}