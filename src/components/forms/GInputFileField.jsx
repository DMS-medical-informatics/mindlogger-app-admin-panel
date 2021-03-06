import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import {uploadFile} from '../../actions/api';
import { connect } from 'react-redux';
import { FormControl, FormHelperText } from '@material-ui/core';

const dropzoneStyle = {
  position: 'relative',
  cursor: 'pointer'
}


class GInputFileField extends Component {
  onFileUpload = (files, rejectedFiles, e) => {
    const {input, data: {parentType, parentId}, uploadFile} = this.props;
    let prArray = files.map(file => 
      uploadFile(file.name, file, parentType, parentId)
    )
    Promise.all(prArray).then(resArray => {
      console.log(resArray);
      let values = input.value || [];
      let filesToAdd = resArray.map(res => ({
        '@id': `file/${res._id}`,
        name: res.name,
      }));
      values = filesToAdd
      input.onChange(values);
    });
  }
  render() {
  const { name, input, label, meta: {touched, error}} = this.props;
  return (
    <FormControl error={touched && error && true}>
      <Dropzone
        name={name}
        style={dropzoneStyle}
        onDrop={this.onFileUpload}
      >
        <div>{label} <a>[+]</a></div>
      </Dropzone>
      {touched &&
        error &&
        <FormHelperText className="error">{error}</FormHelperText>}
      {input.value && Array.isArray(input.value) && (
        <ul>
          { input.value.map((file, i) => <li key={i}>{file.name}</li>) }
        </ul>
      )}
    </FormControl>
    );
  }
}

const mapDispatchToProps = {
  uploadFile
}

export default connect(null, mapDispatchToProps)(GInputFileField)
