import React from 'react';
import Dropzone from 'react-dropzone';
const dropzoneStyle = {
  position: 'relative',
  cursor: 'pointer'
}
export default ({
  name,
  input,
  label,
  meta: {touched, error},
}) => {
  return (
    <div>
      <Dropzone
        name={name}
        style={dropzoneStyle}
        onDrop={( filesToUpload, e ) => input.onChange(filesToUpload)}
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