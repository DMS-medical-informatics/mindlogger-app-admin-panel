
const validate = values => {
  const errors = {};
  if (values.min_select > values.max_select) {
    errors.max_select = 'It should be more than min value';
  }
  return errors;
};

export default validate;