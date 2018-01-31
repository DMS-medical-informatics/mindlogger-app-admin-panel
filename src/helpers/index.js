export const validateEmail = (email) => {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export const isRequired = (value) => (value === undefined || value === "") && "Required"
export const isValidEmail = (value) => !validateEmail(value) && "Not Email Format"
export const isPositiveInteger = (value) => (value <= 0 || !(parseInt(value) == value)) && "Not Positive Number"