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

export const prepareAct = (data) => {
  return new Promise((resolve, reject) => {
      if(data.audio_path) {
          var filename = data.audio_path.replace(/^.*[\\\/]/, '');
          uploadFileS3(data.audio_path, 'audios/', filename).then(url => {
              data.audio_url = url
              resolve(data);
          }).catch(err => {
              reject(err);
          })
      } else {
          resolve(data);
      }
  })
}

export const uploadFileS3 = () => {
  
}