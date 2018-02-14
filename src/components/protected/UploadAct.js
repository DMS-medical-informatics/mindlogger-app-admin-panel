import React,{Component} from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import Dropzone from 'react-dropzone'
import firebase from 'firebase'
import {Row, Panel, Table, Button} from 'react-bootstrap'
import Papa from 'papaparse';
import { addAct, getActs, deleteAct } from '../../actions/api';

const mapDispatchToProps = { addAct, getActs }

const mapStateToProps = (state, ownProps) => ({
    acts: state.entities.acts,
    actType: ownProps.match.params.actType || 'survey',
})

class UploadAct extends Component {
    componentWillMount() {
        const {getActs} = this.props;
        this.setState({name: ''})
        getActs()
    }
    onChangeName = (event) => {
        this.setState({name:event.target.value})
    }

    // Function to restructure results of Papaparse into specific JSON format.
    // Returns Array of JSON objects.
    convertToActivity(file_json_array) {
        const {actType} = this.props;
        var dbs_json = [];
        for (var i=0; i<file_json_array.length; i++){
        var questionnaire_title = file_json_array[i]["Questionnaire"] === file_json_array[i]["Questionnaire Sort Name"] ? file_json_array[i]["Questionnaire"] : file_json_array[i]["Questionnaire Sort Name"] + " (" + file_json_array[i]["Questionnaire"] + ")";
        var responses = [];
        if (file_json_array[i]["Activity Type"] !== "Text"){
            responses = file_json_array[i]["Value Labels"].split("\n");
            if (responses.length < 2){
            responses = file_json_array[i]["Value Labels"].split(",");
            };
            var response_json = [];
            for (var j=0; j<responses.length; j++){
            var response_value = responses[j].split("=");
            response_json.push(
                {
                "text": response_value[1].trim(),
                "value": response_value[0].trim(),
                }
            )
            }
        };
        var question_title = file_json_array[i]["Question"].trim();
        if (file_json_array[i]["Question Group Instruction"].trim().length > 0){
            question_title = file_json_array[i]["Question Group Instruction"].trim() + ": " + question_title;
        };
        var existing_questionnaire = dbs_json.find(questionnaire_exists, questionnaire_title);
        if (existing_questionnaire) {
            existing_questionnaire.act_data.questions.push(questions_responses(responses.length, question_title, question_types, file_json_array[i], response_json));
        } else {
            dbs_json.push(
            {
                type: actType,
                title: questionnaire_title,
                act_data: {
                    mode: "basic",
                    frequency: "1",
                    questions: [
                        questions_responses(responses.length, question_title, question_types, file_json_array[i], response_json),
                    ],
                }
                
            }
            );
        };
        //if file_json_array[i]);
        };
        return(dbs_json);
    }

    onResult = (results, file) => {
        const {addAct} = this.props;
        let acts = this.convertToActivity(results.data);
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
        var i = 0,
        len = files.length;
  
        for (; i < len; i++){
        var file = files[i];
        var ext = re.exec(file.name)[1];
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
                    <Button bsStyle="danger" onClick={() => this.onDeleteAct(act)}>Delete</Button>
                </td>
            </tr>
        )
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
                </Panel>}
                
            </div>
        )
    }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(UploadAct)

// Keys are question types as displayed in the app's frontend.
// Values are question types as encoded in the app's backend.
var question_types = {
    "Choice": "single_sel",
    "Image": "image_sel",
    "Multiple": "multi_sel",
    "Text": "text",
  };
  
  // Test for Array find to check for an existing questionnaire.
  // Returns Boolean.
  function questionnaire_exists(questionnaire_array){
    return(this === questionnaire_array["title"]);
  }
  
  // Function to generate JSON for a question with responses iff responses are provided.
  // Returns JSON object
  function questions_responses(test, question_title, question_types, file_json_array_i, response_json){
    return(
      test ? {
        "title": question_title,
        "type": question_types[file_json_array_i["Activity Type"]],
        "rows": response_json,
        "variable_name": file_json_array_i["Variable Name"],
      } : {
        "title": question_title,
        "type": question_types[file_json_array_i["Activity Type"]],
        "variable_name": file_json_array_i["Variable Name"],
      }
    )
  }
  
  // Function to create a list item link to download a created JSON object.
  // Returns HTML <li>
  function json_link(object){
    var li = document.createElement("li");
    var link = document.createElement("a");
    var text = document.createTextNode(object.title);
    link.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(object, null, '  ')));
    link.setAttribute("download", encodeURIComponent(object.title.replace(/ /g,'_')) + ".json");
    link.appendChild(text);
    li.appendChild(link);
    return(li);
  }
  
  // Function to parse CSV
  // Returns list of JSON objects
    
  // prepare to look for file extensions
  var re = /(?:\.([^.]+))?$/;
  // get file(s)