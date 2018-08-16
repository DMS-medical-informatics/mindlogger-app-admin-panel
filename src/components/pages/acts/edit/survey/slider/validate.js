
const validate = values => {
  const errors = {};
  if (values.options_count<2) {
    errors.options = 'Tick count should be more than 2';
  }
  return errors;
};

export default validate;