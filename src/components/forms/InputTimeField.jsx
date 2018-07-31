import 'rc-time-picker/assets/index.css';
import React from 'react';
import ReactDom from 'react-dom';
import moment from 'moment';

import TimePicker from 'rc-time-picker';

const format = 'h:mm a';

export default ({
  input,
  label,
  required,
  value,
  meta: { touched, error, warning }
}) => (<TimePicker
  showSecond={false}
  className="input-time-field"
  onChange={input.onChange}
  defaultValue={moment()}
  format={format}
  use12Hours
  inputReadOnly
/>);

