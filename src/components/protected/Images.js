import React, { Component } from 'react'
import {connect} from 'react-redux'
import { submit } from 'redux-form'
import {Table, Row, Col, Button, Panel, Modal, Clearfix} from 'react-bootstrap'
import {base, storageRef} from '../../config/constants'
import AddImage from '../forms/AddImage'
import AddFolder from '../forms/AddFolder'
import './Images.css'

const deleteFilesFrom = (item) => {
    let arr = []
    if(item.images && item.images.length>0) {
        item.images.forEach( m => {
            arr.concat(deleteFilesFrom(m))
        })
    }
    if(item.path) {
        arr.push(storageRef.child(item.path).delete())
    }
    return arr
}

class Images extends Component {
    componentWillMount() {
        let path = 'images'
        this.setState({path})
        this.rebind(path)
    }

    rebind(path) {
        if(this.ref)
            base.removeBinding(this.ref);
        this.ref = base.syncState(path, {
            context: this,
            state: 'images',
            defaultValue: [],
            asArray: true
        });
    }

    imageSelect(image) {
    }

    folderSelect(item) {
        let {path} = this.state
        console.log(item)
        path = path + "/" + item.key + "/images"
        this.setState({path})
        this.rebind(path)
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
            path = arr.join("/")
            this.setState({path})
            this.rebind(path)
        }
    }

    close = () => {
        this.setState({form: null})
    }

    onAddItem = (values) => {
        this.setState({
            images: this.state.images.concat([values]) //updates Firebase and the local state
        });
        this.close()
    }
    onAddFolder = (values) => {
        this.onAddItem({...values, is_folder: true})
    }

    removeItem = (idx) => {
        const images = this.state.images
        const image = this.state.images[idx]
        let arr = deleteFilesFrom(image)
        Promise.all(arr).then( res => {
            console.log("Delete success")
            images.splice(idx,1)
            this.setState({
                images  //updates Firebase and the local state
            });
        }).catch(err => {
            console.log(err)
        })
        
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
        const {path} = this.state
        const images = this.state.images || []
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
                {images.map( (item, idx) => 
                    item.is_folder ? (<div className="image-cell" key={idx}>
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFfSURBVGhD7ZK9LkRRFEZPodGI+IufKJDcufS8A57Bo5BMLyq9MVHdhJGIQYgCCXM1k4lSotXRoPuOfWSX+4w7MsZO7JWsbvbJ+nLHGYZhGMZvgIpbwo7b8hWXFZF+X0XVjfG5DiiqTHG+U2n4g5oxFLMqRRZVzRj6GjUpsBNVjKEhza+gvT7vDwe9Pxr+kTgeecb5ZL1rnk3soj60wJnfQ0Navjbg/V3ifZ6qErcJcDq+zantQdb/KD2iSZyMrnFuHFxMvUjHmsTl9BPnxsHVzLt0rElqfOPcOLie/ZCONRkaOTeODemhhYb4m7lX6ViV1Mi5cdBIW+KxIkMj58axIT3UhmjThmjThmjThmjThmjThmjznw3J06Z0rMnQyLlxkJcOpGNNolHa59w4uJ9fkY41iTxZ5tz20KfboP8hpEf+0tBErnNmMWj1Ig3apAcyDYaW0MR5hmEYhtFFnPsEarLYUOTpRhkAAAAASUVORK5CYII=" onClick={() => this.folderSelect(item)}/>
                        <span className="glyphicon glyphicon-remove remove" onClick={() => this.removeItem(idx) }></span>
                        <p>{item.name}</p>
                    </div>) :
                    (<div className="image-cell" key={idx}>
                        <span className="glyphicon glyphicon-remove remove" onClick={() => this.removeItem(idx) }></span>
                        <img src={item.image_url} onClick={() => this.imageSelect(item)}/>
                        <p>{item.name}</p>
                    </div>)
                    ) }
            </Row>
            <Clearfix/>
            </Panel>
        </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    submitForm: name => dispatch(submit(name))
})

export default connect(null, mapDispatchToProps)(Images);