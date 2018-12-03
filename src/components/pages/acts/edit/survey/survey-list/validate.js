
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
  if (values.options) {
    errors.options = [];
    values.options.forEach((option,idx) => {
      if (option.type) {
        if (option.type == 'text' && !option.text) {
          errors.options[idx] = { text: 'You should input text' };
        } else if (option.type == 'file' && !option.file) {
          errors.options[idx] = { file: 'You should upload file' };
        }
      }
    });
  }
  console.log(errors);
  return errors;
};

export default validate;