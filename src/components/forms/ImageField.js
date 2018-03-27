import React,{Component} from 'react'
import { FormGroup, FormControl, ControlLabel, HelpBlock, InputGroup, Button, Glyphicon, Image } from 'react-bootstrap'
import ImageBrowser from './ImageBrowser';
import Dropzone from 'react-dropzone';

export default class ImageField extends Component{
    componentWillMount() {
        this.setState({file:{path:this.props.input.value}})
    }
    onDrop = (files) => {
        let file = files[0]
        console.log(file)
        this.props.input.onChange(file.preview)
    }

    onFile = (item) => {
        console.log(item)
        this.props.input.onChange(item.path)
    }

    onReset = () => {
        this.props.input.onChange(null)

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
        return (
            <FormGroup validationState={touched && error ? 'error' : null}>
                {label && (<ControlLabel>{label}</ControlLabel>) }
                <Dropzone accept="image/jpeg, image/png" onDrop={this.onDrop} multiple={false} disabled={this.state.disabled}>
                { input.value && <Image style={{width: '100%', height: '100%'}} src={input.value} /> }
                </Dropzone>
                { !input.value && <ImageBrowser onFile={this.onFile} /> }
                {input.value && <Button onClick={this.onReset}>Reset</Button> }
                {touched && error && <HelpBlock>{error}</HelpBlock>}
            </FormGroup>
          )
    }
}