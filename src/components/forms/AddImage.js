import React,{Component} from 'react'
import Dropzone from 'react-dropzone'
import firebase from 'firebase'
import {FormGroup, FormControl} from 'react-bootstrap'
import {storageRef} from '../../config/constants'
class AddImage extends Component {
    componentWillMount() {
        this.setState({name: ''})
    }
    onChangeName = (event) => {
        this.setState({name:event.target.value})
    }
    onDrop = (files) => {
        const { onUpload } = this.props
        
        if(files.length === 0) return
        const file = files[0]
        const path = "images/"+(new Date()).getTime()+file.name
        var ref = storageRef.child(path)
        let uploadTask = ref.put(file)
        this.setState({disabled: true})
        uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, (error) => {
            // Handle unsuccessful uploads
            console.log("failed to upload")
          }, () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            var image_url = uploadTask.snapshot.downloadURL;
            let name = this.state.name || file.name.replace(/\.[^/.]+$/, "")
            onUpload({name, image_url, path})
          });
    }
    render () {
        return (
            <form>
            <FormGroup>
            <FormControl name="name" placeholder="name(optional)" type="text" onChange={this.onChangeName} value={this.state.name}>
            </FormControl>
            </FormGroup>
            <Dropzone accept="image/jpeg, image/png" onDrop={this.onDrop} multiple={false} disabled={this.state.disabled}/>
            </form>
        )
    }
}

export default AddImage;