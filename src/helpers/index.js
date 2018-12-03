import {API_HOST} from '../constants'
export const validateEmail = (email) => {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export const isRequired = (value) => (value === undefined || value === "") && "Required"
export const isValidEmail = (value) => !validateEmail(value) && "Not Email Format"
export const isPositiveInteger = (value) => (value <= 0 || !(parseInt(value, 10) === value)) && "Not Positive Number"

export const getTimestamp = (str) => {
  return (new Date(str)).getTime()
}

export const userContain = (user, keyword) => 
{
return user && (user.firstName && user.lastName) &&
    (user.firstName.toLowerCase().includes(keyword) || user.lastName.toLowerCase().includes(keyword) || (user.email && user.email.includes(keyword)))
}

export const fileLink = (file, token) => {
return `${API_HOST}/${file['@id']}/download?contentDisposition=inline&token=${token}`;
}