import React, { Component } from 'react'
import {connect} from 'react-redux'
import { submit } from 'redux-form'
import {Table, Row, Col, Button, Panel, Modal, Clearfix, Image, Glyphicon} from 'react-bootstrap'

import AddImage from '../forms/AddImage'
import AddFolder from '../forms/AddFolder'
import './Images.css'
import { getFiles, postFile, deleteFile } from '../../actions/api';
import { S3_IMAGE_BUCKET } from '../../constants/index';

class Images extends Component {
    componentWillMount() {
        let path = 'images/'
        this.setState({path})
        this.props.getFiles('')
    }

    imageSelect(image) {
    }

    folderSelect(item) {
        let {path} = this.state
        console.log(item)
        path = item.key
        this.setState({path})
    }

    toggleFolderForm = () => {
        this.setState({form: 'folder'})
    }

    toggleImageForm = () => {
        this.setState({form: 'image'})
        console.log(this.state)
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

    close = () => {
        this.setState({form: null})
    }

    onAddItem = ({name, ...values}) => {
        const {postFile, getFiles} = this.props
        let formData = new FormData();
        formData.append('path', this.state.path)
        formData.append('filename', name)
        formData.append('file', values.file);
        console.log(values.file)
        this.setState({loading:true})
        postFile(formData).then( res => {
            this.setState({loading:false})
            return getFiles('')
        }).catch(err => {
            console.log(err)
            this.setState({loading:false})
        })
        this.close()
    }
    onAddFolder = (values) => {
        this.onAddItem({...values, is_folder: true})
    }

    removeItem = (item) => {
        const {deleteFile, getFiles} = this.props
        deleteFile(item.key).then(res => {
            return getFiles('')
        }).catch(err => {
            console.log(err)
        });
        // const images = this.state.images
        // const image = this.state.images[idx]
        // let arr = deleteFilesFrom(image)
        // Promise.all(arr).then( res => {
        //     console.log("Delete success")
        //     images.splice(idx,1)
        //     this.setState({
        //         images  //updates Firebase and the local state
        //     });
        // }).catch(err => {
        //     console.log(err)
        // })
        
    }

    showDeleteModal = () => {
        this.setState({form:'confirm', message: 'You are about to delete images.'})
    }

    onConfirm = () => {

    }

    renderAddImageModal = () => {
        return (<Modal show={this.state.form == 'image'} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Add Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddImage onUpload={this.onAddItem}/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>)
    }

    renderAddFolderModal = () => {
        return (<Modal show={this.state.form == 'folder'} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Add Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddFolder onSubmit={this.onAddFolder}/>
        </Modal.Body>
        <Modal.Footer>
            <Button bsStyle="primary" onClick={() => this.props.submitForm('add-folder-form')}>Submit</Button>
            <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>)
    }

    renderConfirmModal = () => {
        return (<Modal show={this.state.form == 'confirm'} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{this.state.message}</p>
        </Modal.Body>
        <Modal.Footer>
            <Button bsStyle="danger" onClick={this.onConfirm}>Confirm</Button>
            <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>)
    }

    render () {
        const {path, loading} = this.state
        const {files} = this.props
        let count = path.split("/").length
        let list = []
        files.forEach(file => {
            let arr = file.split("/")
            if (file != path && file.startsWith(path) && (arr.length - count <= 1)) {
                let item = {key: file, path:`https://${S3_IMAGE_BUCKET}.s3.amazonaws.com/${file}`}
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
        <div>
            <h2 className="text-center">Images</h2>
            
            <Panel header={ path }>
            <Row>
            <Col xs={12}>
            <Button bsStyle='info' onClick={this.upFolder}>
                <span className="glyphicon glyphicon-level-up"></span> Up folder
            </Button>
            {' '}
            <Button bsStyle='warning' onClick={this.toggleFolderForm}>
                <span className="glyphicon glyphicon-plus"></span> Add folder
            </Button>
            {' '}
            <Button bsStyle='primary' onClick={this.toggleImageForm}>
                <span className="glyphicon glyphicon-plus"></span> Add image
            </Button>
            </Col>
            </Row>
            <Row>
            <Col xs={10} xsOffset={1}>
            {this.renderAddImageModal()}
            {this.renderAddFolderModal()}
            </Col>
            </Row>
            <Row>
                {loading && <img src="//assets.okfn.org/images/icons/ajaxload-circle.gif" />}
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
            <Clearfix/>
            </Panel>
        </div>
        )
    }
}
const mapStateToProps = (state) => ({
    files: state.entities.files || [],
})

const mapDispatchToProps = {
    submit, getFiles, postFile, deleteFile
}

export default connect(mapStateToProps, mapDispatchToProps)(Images);