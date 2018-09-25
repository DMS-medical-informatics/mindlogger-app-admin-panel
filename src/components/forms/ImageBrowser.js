import React, { Component } from 'react';
import {connect} from 'react-redux';
import { submit } from 'redux-form';
import {Row, Col, Image} from 'react-bootstrap';
import { S3_IMAGE_BUCKET } from '../../constants/index';
import { getFiles } from '../../actions/api';
import ProgressCircle from '../layout/ProgressCircle';

const IMAGE_AB_PATH = 'images/';
class ImageBrowser extends Component {
    componentWillMount() {
        this.setState({path: IMAGE_AB_PATH})
        this.props.getFiles('')
        
    }
    imageSelect(image) {
        this.props.onFile(image, this.state.path)
    }

    folderSelect(item) {
        let {path} = this.state
        path = item.file
        console.log(item)
        this.setState({path})
    }

    upFolder = () => {
        let {path} = this.state
        let arr = path.split("/")
        if(arr.length>2) {
            arr.splice(-2,2)
            arr.push('')
            path = arr.join("/")
            this.setState({path})
        }
    }
    

    render () {
        const {path, loading} = this.state
        const {files} = this.props
        let count = path.split("/").length
        let list = []
        files.forEach(file => {
            let arr = file.split("/")
            if (file !== path && file.startsWith(path) && (arr.length - count <= 1)) {
                let item = {path: `https://${S3_IMAGE_BUCKET}.s3.amazonaws.com/${file}`, file}
                if (file.endsWith("/")) {
                    item.is_folder = true
                    item.name = arr[arr.length-2]
                } else {
                    item.name = arr[arr.length-1]
                }
                list.push(item)
            }
        })
        return (
        <section>
            { loading && <ProgressCircle /> }
            <Row>
                { IMAGE_AB_PATH !== path &&
                <Col md={2} className="image-cell">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Human-folder.svg" onClick={() => this.upFolder()}/>
                    <p>..</p>
                </Col>
                }
                {list.map( (item, idx) => 
                    item.is_folder ? (<Col md={2} className="image-cell" key={idx}>
                        <Image src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Human-folder.svg" onClick={() => this.folderSelect(item)}/>
                        <span className="glyphicon glyphicon-remove remove" onClick={() => this.removeItem(item) }></span>
                        <p>{item.name}</p>
                    </Col>) :
                    (<Col md={2} className="image-cell" key={idx}>
                        <span className="glyphicon glyphicon-remove remove" onClick={() => this.removeItem(item) }></span>
                        <Image src={item.path} onClick={() => this.imageSelect(item)}/>
                        <p>{item.name}</p>
                    </Col>)
                    ) }
            </Row>
        </section>
        )
    }
}

const mapStateToProps = (state) => ({
    files: state.entities.files || [],
})

const mapDispatchToProps = {
    submit, getFiles
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageBrowser);