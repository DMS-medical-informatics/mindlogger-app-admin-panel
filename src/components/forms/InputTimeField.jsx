import 'rc-time-picker/assets/index.css';
import React from 'react';

import { TextField } from '@material-ui/core';


export default ({
  input,
  label,
  required,
  defaultValue,
  meta: { touched, error, warning }
}) => (<TextField
  type="time"
  onChange={input.onChange}
  value={input.value || defaultValue}
  inputProps={{step: 300}}
  required={required}
/>);

