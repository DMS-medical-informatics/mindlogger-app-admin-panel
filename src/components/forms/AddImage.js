import React,{Component} from 'react'
import Dropzone from 'react-dropzone'
import firebase from 'firebase'
import {FormGroup, FormControl} from 'react-bootstrap'

class AddImage extends Component {
    componentWillMount() {
        this.setState({name: ''})
    }
    onChangeName = (event) => {
        this.setState({name:event.target.value})
    }
    onDrop = (files) => {
        const file = files[0]
        let name = this.state.name || file.name.replace(/\.[^/.]+$/, "")
        this.props.onUpload({name, file});
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