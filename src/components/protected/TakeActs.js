import React,{Component} from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import { submit } from 'redux-form';
import {withRouter} from 'react-router';
import {Panel, Table, Button, Modal} from 'react-bootstrap'
import Papa from 'papaparse';

import { getAssignedActs, deleteAct, updateAct } from '../../actions/api';
import { setAct } from '../../actions/core';
import { convertToActivity } from '../../helpers/survey';
import SurveyForm from '../forms/SurveyForm';
import VoiceForm from '../forms/VoiceForm';
import DrawingForm from '../forms/DrawingForm';


const ITEMS_PER_PAGE = 10

const mapDispatchToProps = { getAssignedActs, deleteAct, updateAct, submit, setAct }

const mapStateToProps = (state, ownProps) => ({
    acts: state.entities.assigned_acts,
    user: state.entities.auth || {},
    actType: ownProps.match.params.actType || 'survey',
    total_count: (state.entities.paging && state.entities.paging.total) || 0,
})

class TakeActs extends Component {
    componentWillMount() {
        const {getAssignedActs, user} = this.props;
        getAssignedActs(user.id);
    }
    onChangeName = (event) => {
        this.setState({name:event.target.value});
    }

    onAddAct = ({title, image, ...body}) => {
        let type = this.state.form;
        const {addAct, history} = this.props;
        let act_data = {...body};

        if (type === 'survey') {
            act_data.questions = [];
        }

        let formData = new FormData();
        formData.set("type", type);
        if (image) {
            if(image.preview)
                formData.set("image", image);
            else
                act_data.image_url = image.path;
        }
        formData.set("act_data", JSON.stringify(act_data));
        formData.set("title", title);
        return addAct(formData).then( res => {
            if (type === 'survey')
                history.push(`surveys/${res.act.id}`);
            else
                this.close();
            return this.refreshPage();
        }).catch(err => {
            console.log(err);
        //Toast.show({text: 'Error! '+err.message, type: 'danger', buttonText: 'OK' })
        })
    }


    onTakeAct = (act) => {
        const {history, setAct} = this.props;
        setAct(act);
        history.push(`/take/${act.id}`);
    }

    close = () => {
        this.setState({form:undefined});
    }

    renderAddSurveyModal = () => {
        const {act} = this.state;
        let survey = act ? {title: act.title, ...act.act_data} : {mode:'basic', accordion:false};
        return (<Modal show={this.state.form === 'survey'} onHide={this.close}>
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
        return (<Modal show={this.state.form === 'voice'} onHide={this.close}>
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
        return (<Modal show={this.state.form === 'drawing'} onHide={this.close}>
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
        return  (
            <tr key={index}>
                <td>{act.title}</td>
                <td>{act.type}</td>
                <td>{act.author && `${act.author.first_name} ${act.author.last_name}`}</td>
                <td>
                    <Button bsStyle="primary" onClick={() => this.onTakeAct(act)}>Take</Button>
                </td>
            </tr>
        );
    }

    onEditAct(act) {
        if (act.type === 'survey') {
            this.setState({act, form:'survey'});
        }
    }

    onDeleteAct(act) {
        const {deleteAct} = this.props;
        deleteAct(act).then(res => {
            return this.refreshPage();
        });
    }

    refreshPage() {
        return this.props.getActs((this.state.page-1)*ITEMS_PER_PAGE, ITEMS_PER_PAGE);
    }

    selectPage = (page) => {
        this.setState({page});
        this.props.getActs((page-1)*ITEMS_PER_PAGE, ITEMS_PER_PAGE);
    }

    render () {
        const {acts} = this.props;
        return (
            <div>
                { acts &&
                <Panel header="Created Activities">
                <Table responsive bordered>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Author</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {acts.map(this.renderRow)}
                    </tbody>
                </Table> 
                </Panel>}
            </div>
        )
    }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(TakeActs)