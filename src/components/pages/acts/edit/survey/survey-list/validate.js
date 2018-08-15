
const validate = values => {
  const errors = {};
  if (!values.mode) {
    errors.mode = 'You should select one of option';
  }
  return errors;
};

export default validate;