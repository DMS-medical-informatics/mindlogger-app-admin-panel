import React,{Component} from 'react'
import { FormGroup, FormControl, ControlLabel, HelpBlock, InputGroup, Button, Glyphicon, Image } from 'react-bootstrap'
import ImageBrowser from './ImageBrowser';
import Dropzone from 'react-dropzone';

export default class ImageField extends Component{
    componentWillMount() {
        this.setState({})
    }
    onDrop = (files) => {
        let file = files[0]
        this.setState({file})
        console.log(file)
        this.props.input.onChange(file)
    }

    onFile = (file) => {
        console.log(file)
        this.setState({file})
        this.props.input.onChange(file)
    }

    onReset = () => {
        this.setState({file: undefined})
    }
    render(){
        const {input,
            label,
            placeholder,
            options,
            type,
            componentClass,
            readOnly,
            required, meta: { touched, error, warning }} = this.props;
        const {file} = this.state
        return (
            <FormGroup validationState={touched && error ? 'error' : null}>
                {label && (<ControlLabel>{label}</ControlLabel>) }
                <Dropzone accept="image/jpeg, image/png" onDrop={this.onDrop} multiple={false} disabled={this.state.disabled}>
                { file && <Image style={{width: '100%', height: '100%'}} src={file.preview || file.path} /> }
                </Dropzone>
                { !file && <ImageBrowser onFile={this.onFile} /> }
                {file && <Button onClick={this.onReset}>Reset</Button> }
                {touched && error && <HelpBlock>{error}</HelpBlock>}
            </FormGroup>
          )
    }
}