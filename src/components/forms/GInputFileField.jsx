import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import {uploadFile} from '../../actions/api';
import { connect } from 'react-redux';

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
        name: res.name
      }));
      values = values.concat(filesToAdd);
      input.onChange(values);
    });
  }
  render() {
  const { name, input, label, meta: {touched, error}} = this.props;
  return (
    <div>
      <Dropzone
        name={name}
        style={dropzoneStyle}
        onDrop={this.onFileUpload}
      >
        <div>{label} <a>[+]</a></div>
      </Dropzone>
      {touched &&
        error &&
        <span className="error">{error}</span>}
      {input.value && Array.isArray(input.value) && (
        <ul>
          { input.value.map((file, i) => <li key={i}>{file.name}</li>) }
        </ul>
      )}
    </div>
    );
  }
}

const mapDispatchToProps = {
  uploadFile
}

export default connect(null, mapDispatchToProps)(GInputFileField)
