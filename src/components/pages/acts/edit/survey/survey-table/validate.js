
const validate = values => {
  const errors = {};
  if (values.optionsMin > values.optionsMax) {
    errors.optionsMax = 'It should be more than min value';
  }
  return errors;
};

export default validate;