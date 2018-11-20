import React from 'react';
import Dropzone from 'react-dropzone';
const starterVowels = ['a', 'e', 'h', 'i', 'o', 'u']
const dropzoneStyle = {
  position: 'relative',
  cursor: 'pointer'
}
export default ({
  name,
  input,
  label,
  accept,
  meta: {touched, error},
}) => {
  return (
    <div>
      <Dropzone
        name={name}
        style={dropzoneStyle}
        accept={accept}
        onDrop={( filesToUpload, e ) => {
          input.onChange(filesToUpload);
          if (e) {
            e.map((file, i) => {
              alert("Sorry, `" + file.name + "` is not a" + (starterVowels.includes(accept.substring(0,1)) ? "n" : "") + " " + accept.split("/")[0] + " file.")
            });
          }
        }}
      >
        <div>{label} <a>[+]</a></div>
      </Dropzone>
      {touched &&
        error &&
        <span className="error">{error}</span>}
      {input.value && (Array.isArray(input.value) ? (
        <ul>
          { input.value.map((file, i) => <li key={i}>{file.name}</li>) }
        </ul>
      ) : (
        <ul>
          <li>{input.value.name}</li>
        </ul>
      ))}
  </div>
  );
}
