
const validate = values => {
  const errors = {};
  if (!values.mode) {
    errors.mode = 'You should select one of option';
  }
  if (values.optionsCount < values.optionsMax) {
    errors.optionsMax = 'Max number should be less than number of response options';
  }

  if (values.optionsMax < values.optionsMin) {
    errors.optionsMin = 'Minimum number should less than maximum number';
  }
  return errors;
};

export default validate;