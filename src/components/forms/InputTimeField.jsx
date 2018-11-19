import 'rc-time-picker/assets/index.css';
import React from 'react';
import moment from 'moment';

import TimePicker from 'rc-time-picker';

const format = 'h:mm a';

export default ({
  input,
  label,
  required,
  value,
  defaultValue,
  meta: { touched, error, warning }
}) => (<TimePicker
  showSecond={false}
  className="input-time-field"
  onChange={input.onChange}
  defaultValue={defaultValue ? moment(defaultValue, "HH:mm") : moment()}
  format={format}
  use12Hours
  inputReadOnly
/>);
