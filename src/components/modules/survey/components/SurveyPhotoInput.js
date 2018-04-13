import React, {Component} from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import randomString from 'random-string';

import SurveyInputComponent from './SurveyInputComponent';
import { postFile } from '../../../../actions/api';
import { S3_IMAGE_BUCKET } from '../../../../constants/index';


class SurveyPhotoInput extends SurveyInputComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({});
  }
  onDrop = (files) => {
    const file = files[0];
    console.log(file);
    this.setState({file});
  }

  savePhoto = () => {
    const {file} = this.state;
    const {postFile, selectAnswer} = this.props;
    let timestamp = Math.floor(Date.now());
    let filename = `${timestamp}_${randomString({length:20})}_`+file.name;
    let formData = new FormData();
    formData.append('path', 'uploads');
    formData.append('filename', filename);
    formData.append('file', file);
    postFile(formData).then( res => {
        this.setState({loading:false})
        this.selectAnswer(`https://${S3_IMAGE_BUCKET}.s3.amazonaws.com/uploads/${filename}`, true);
    }).catch(err => {
        console.log(err)
        this.setState({loading:false})
    })
  }

  onInputText = () => {
    this.selectAnswer(this.state.text || "")
  }
  render() {
    const { file } = this.state;
    return (
      <section>
        <Dropzone accept="image/jpeg, image/png" onDrop={this.onDrop} multiple={false}>
            <img src={file && file.preview} style={{width: '100%'}}/>
        </Dropzone>
        <Button onClick={this.savePhoto} disabled={!file}>Save</Button>
      </section>
    )
  }
}

export default connect(state => ({
    
  }),
  ({
      postFile
    //actions: bindActionCreators(counterActions, dispatch)
  })
)(SurveyPhotoInput);
