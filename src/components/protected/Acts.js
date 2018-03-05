import React,{Component} from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import { submit } from 'redux-form';
import {withRouter} from 'react-router'
import Dropzone from 'react-dropzone'
import firebase from 'firebase'
import {Row, Panel, Table, Button, Modal} from 'react-bootstrap'
import Papa from 'papaparse';

import { addAct, getActs, deleteAct, updateAct } from '../../actions/api';
import { convertToActivity } from '../../helpers/survey';
import { LinkContainer } from 'react-router-bootstrap';
import SurveyForm from '../forms/SurveyForm';
import VoiceForm from '../forms/VoiceForm';
import DrawingForm from '../forms/DrawingForm';
import { prepareAct } from '../../helpers/index';


const mapDispatchToProps = { addAct, getActs, deleteAct, submit }

const mapStateToProps = (state, ownProps) => ({
    acts: state.entities.acts,
    actType: ownProps.match.params.actType || 'survey',
})

class Acts extends Component {
    componentWillMount() {
        const {getActs} = this.props;
        this.setState({name: ''})
        getActs()
    }
    onChangeName = (event) => {
        this.setState({name:event.target.value})
    }

    onAddAct = ({title, image, ...body}) => {
        let type = this.state.form
        const {addAct, history, getActs} = this.props
        let act_data = {...body}

        if (type == 'survey') {
            act_data.questions = []
        }

        let formData = new FormData()
        formData.set("type", type)
        if (image) {
            if(image.preview)
                formData.set("image", image)
            else
                act_data.image_url = image.path
        }
        formData.set("act_data", JSON.stringify(act_data))
        formData.set("title", title)
        return addAct(formData).then( res => {
            if (type == 'survey')
                history.push(`surveys/${res.act.id}`)
            else
                this.close()
            return getActs();
        }).catch(err => {
            console.log(err)
        //Toast.show({text: 'Error! '+err.message, type: 'danger', buttonText: 'OK' })
        })
    }

    onUpdateAct = ({title, ...body}) => {
        const {updateAct, getActs} = this.props
        const {act} = this.state
        return updateAct({id:act.id, act_data:body, title}).then(res => {
            this.close();
            return getActs();
        }).catch( err => {
            console.log(err)
        })
    }

    onEditAct = (act) => {
        this.setState({act, form: act.type})
    }

    close = () => {
        this.setState({form:undefined})
    }

    renderAddSurveyModal = () => {
        const {act} = this.state;
        let survey = act ? {title: act.title, ...act.act_data} : {mode:'basic', accordion:false};
        return (<Modal show={this.state.form == 'survey'} onHide={this.close}>
            <Modal.Header closeButton>
            <Modal.Title>{ act && act.id ? "Edit Survey" : "Add Survey"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <SurveyForm initialValues={survey} onSubmit={act && act.id ? this.onUpdateAct : this.onAddAct}/>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="primary" onClick={() => this.props.submit('add-survey-form')}>{act && act.id ? 'Update' : 'Create'}</Button>
                {act && act.id && <Button onClick={() => this.props.history.push('/surveys/'+act.id)}>Edit questions</Button>}
                <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
        </Modal>)
    }

    renderAddVoiceModal = () => {
        const {act} = this.state;
        let voice = act ? {title: act.title, ...act.act_data} : {};
        return (<Modal show={this.state.form == 'voice'} onHide={this.close}>
            <Modal.Header closeButton>
            <Modal.Title>{act && act.id ? "Edit Voice" : "Add Voice"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <VoiceForm initialValues={voice} onSubmit={act && act.id ? this.onUpdateAct : this.onAddAct}/>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="primary" onClick={() => this.props.submit('add-voice-form')}>{act && act.id ? 'Update' : 'Create'}</Button>
                <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
        </Modal>)
    }

    renderAddDrawingModal = () => {
        const {act} = this.state;
        let drawing = act ? {title: act.title, ...act.act_data} : {};
        return (<Modal show={this.state.form == 'drawing'} onHide={this.close}>
            <Modal.Header closeButton>
            <Modal.Title>{act && act.id ? "Edit Drawing" : "Add Drawing"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DrawingForm initialValues={drawing} onSubmit={act && act.id ? this.onUpdateAct : this.onAddAct}/>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="primary" onClick={() => this.props.submit('add-drawing-form')}>{act && act.id ? 'Update' : 'Create'}</Button>
                <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
        </Modal>)
    }

    onResult = (results, file) => {
        const {addAct, actType} = this.props;
        let acts = convertToActivity(results.data, actType);
        console.log(acts);
        console.log(acts.length + " questionnaires extracted from " + file.name);
        let arr = []
        acts.forEach(act => {
            arr.push(addAct(act))
        })
        Promise.all(arr).then( res => {
            console.log("Uploaded all activities");
        }).catch( err => {
            console.log("Upload act error", err)
        })
    }
    onDrop = (files) => {
        let i = 0,
        len = files.length;
        // prepare to look for file extensions
        let re = /(?:\.([^.]+))?$/;
  
        for (; i < len; i++){
        let file = files[i];
        let ext = re.exec(file.name)[1];
        console.log("Ext: " + ext);
        if(ext !== "csv"){
            alert("Please upload a CSV worksheet based on our template, not a " + ext + " file.");
        } else {
            Papa.parse(file, {
                complete: this.onResult,
            header: true,
            skipEmptyLines: true,
            });
        }
        }
    }

    renderRow = (act, index) => {
        const {acts} = this.props
        const {actDict} = this.state
        var isIncluded = false
        return  (
            <tr key={index}>
                <td>{act.title}</td>
                <td>{act.type}</td>
                <td>
                    <Button onClick={() => this.onEditAct(act)}>Edit</Button>
                    {" "}
                    <Button bsStyle="danger" onClick={() => this.onDeleteAct(act)}>Delete</Button>
                </td>
            </tr>
        )
    }

    onEditAct(act) {
        if (act.type == 'survey') {
            this.setState({act, form:'survey'})
        }
    }

    onDeleteAct(act) {
        const {deleteAct, getActs} = this.props
        deleteAct(act).then(res => {
            return getActs();
        })
    }

    render () {
        const {acts} = this.props
        return (
            <div>
                <Panel header="Upload new activities">
                <center>
                <h4>Drop file here</h4>
                <Dropzone onDrop={this.onDrop} disabled={this.state.disabled}/>
                </center>
                </Panel>
                { acts &&
                <Panel header="Created Activities">
                <Table responsive bordered>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {acts.map(this.renderRow)}
                    </tbody>
                </Table> 
                <Button onClick={() => this.setState({form:'survey'})}>Add new survey</Button>
                <Button onClick={() => this.setState({form:'voice'})}>Add new voice</Button>
                <Button onClick={() => this.setState({form:'drawing'})}>Add new drawing</Button>
                </Panel>}
                {this.renderAddSurveyModal()}
                {this.renderAddVoiceModal()}
                {this.renderAddDrawingModal()}
            </div>
        )
    }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(Acts)