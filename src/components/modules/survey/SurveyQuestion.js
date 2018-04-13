import React, {Component} from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

import randomString from 'random-string';

import { saveAnswer } from '../../../actions/api';
import { setAnswer } from '../../../actions/core';

import SurveyTextInput from './components/SurveyTextInput'
import SurveyBoolSelector from './components/SurveyBoolSelector'
import SurveySingleSelector from './components/SurveySingleSelector'
import SurveyMultiSelector from './components/SurveyMultiSelector'
import SurveyImageSelector from './components/SurveyImageSelector'
import SurveyTableInput from './components/SurveyTableInput'

import DrawingBoard from '../../../components/controls/DrawingBoard';
import SurveyPhotoInput from './components/SurveyPhotoInput';
// import AudioRecord from './../../components/audio/AudioRecord';
// import { uploadFileS3 } from '../../../helper';

// const styles=StyleSheet.create({
//   row: {flexDirection:'row', justifyContent:'space-around'},
//   block: {flex: 1, margin: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center'}
// });
class SurveyQuestion extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.setState({questionIndex:0});
  }

  onInputAnswer = (result, data=undefined, final=false) => {
    let {questionIndex} = this.state;
    let {survey:{questions}, answers} = this.props
    let answer = {
      result,
      time: (new Date()).getTime()
    }
    answers[questionIndex] = answer
    setAnswer({answers})
    if(final)
      this.nextQuestion(answers);
  }
  saveChange = () => {
    let { questionIndex } = this.state;
    let { survey } = this.props
    let answer;
    if(survey.mode == 'basic') {
      switch (survey.questions[questionIndex].type) {
        case 'drawing':
          answer = this.board.save();
          this.onInputAnswer(answer, null, false);
          break;
      }
    }
  }
  nextQuestion = () => {
    this.saveChange();
    let {questionIndex} = this.state;
    let {survey, answers, indexMap, onFinish, setAnswer} = this.props;
    let {questions} = survey;
    let condition_question_index, condition_choice;
    // Skip question does not match condition
    do {
      questionIndex = questionIndex + 1
      if (questionIndex<questions.length) {
        condition_question_index = questions[questionIndex].condition_question_index;
        condition_choice = questions[questionIndex].condition_choice;
      } else {
        break;
      }
    }while(condition_question_index>-1 && answers[condition_question_index].result != condition_choice);

    if(questionIndex<questions.length) {
        
        this.setState({questionIndex, indexMap});
    } else {
        this.props.onFinish(answers);
    }
    
  }

  prevQuestion = () => {
    this.saveChange();
    let {questionIndex, survey:{questions}} = this.props
    let {answers} = this.props
    for(questionIndex=questionIndex-1; questionIndex>=0; questionIndex--)
    {
      let { condition_question_index, condition_choice } = questions[questionIndex];
      if (condition_question_index == undefined || condition_question_index == -1 || (answers[condition_question_index] && answers[condition_question_index].result == condition_choice)) {
        break;
      }
    }

    if(questionIndex>=0) {
        this.setState({questionIndex});
    } else {
    }
  }

  renderHeader() {
    const { act } = this.props
    return (<div>
        <Button onClick={() => this.prevQuestion()}>
            Back
        </Button>
        <h3>{act.title}</h3>
        <Button onClick={() => this.nextQuestion()}>
            Next
        </Button>
    </div>);
  }

  renderContent() {
    const { questionIndex } = this.state;
    const { survey, answers} = this.props;
    let question = survey.questions[questionIndex];
    let answer = answers[questionIndex] && answers[questionIndex].result;
    const length = survey.questions.length
    const index = questionIndex + 1
    const progressValue = index/length

    let scroll = true;
    let comp = (<div></div>);
    
    if(survey.mode == 'basic') {
      switch(question.type) {
        case 'text':
          comp = (<SurveyTextInput onSelect={this.onInputAnswer} data={{question, answer}} />);
          break;
        case 'bool':
          comp = (<SurveyBoolSelector onSelect={this.onInputAnswer} data={{question, answer}}/>);
          break;
        case 'single_sel':
          comp = (<SurveySingleSelector onSelect={this.onInputAnswer} data={{question, answer}}/>);
          break;
        case 'multi_sel':
          comp = (<SurveyMultiSelector onSelect={this.onInputAnswer} data={{question, answer}}/>);
          break;
        case 'image_sel':
          comp = (<SurveyImageSelector onSelect={this.onInputAnswer} data={{question, answer}}/>);
          break;
        case 'drawing':
          scroll = false;
          comp = (
          <div>
            <h4>{question.title}</h4>
            <DrawingBoard source={question.image_url && {uri: question.image_url}} ref={board => {this.board = board}} autoStart lines={answer && answer.lines}/>
            <Row>
              <Col md={6}><Button onClick={this.saveDrawing}>Save</Button></Col>
              <Col md={6}><Button onClick={this.resetDrawing}>Reset</Button></Col>
            </Row>
          </div>);
          break;
        // case 'audio':
        //   comp = (
        //     <View>
        //       <Text>{question.title}</Text>
        //       <AudioRecord onRecordFile={(filePath)=>this.onInputAnswer(filePath)} path={answer}/>
        //     </View>
        //   );
        //   break;
        case 'camera':
          comp = (<div>
            <h4>{question.title}</h4>
            <SurveyPhotoInput onSelect={this.onInputAnswer} data={{question, answer}} />
          </div>)
          break;
        case 'capture_acc':
          comp = (<div>
            <h4>{question.title}</h4>
            <p>You are not able to track accelerometer data via web browser</p>
          </div>)
          break;
        // case 'image_sort':
        //   comp = (<View>
        //     <Text>{question.title}</Text>
        //     {this.renderImageSort(question)}
        //     <View style={styles.row}>
        //       <Right><Button onClick={this.saveAcc}><Text>Save</Text></Button></Right>
        //     </View>
        //     </View>)
        //   break;
      }
    } else {
      comp = (<SurveyTableInput onSelect={this.onInputAnswer} data={{question, answer}}/>);
    }

    return (<div>
      {comp}
      <div>
        {/* <Progress.Bar progress={progressValue} width={null} height={20}/> */}
        <p>{`${index}/${length}`}</p>
      </div>
      </div>);
  }

  saveDrawing = () => {
    let answer = this.board.save();
    this.onInputAnswer(answer, null, true);
  }

  pickPhoto = () => {
    let options = {title: 'Select Image'}
    // ImagePicker.showImagePicker(options, (response) => {
    //   if (response.didCancel) {
    //     console.log('User cancelled image picker');
    //   } else if (response.error) {
    //     console.log('Image Picker error: ', response.error);
    //   } else {
    //     let pic_source = {uri: response.uri, filename: response.fileName};
    //     this.setState({pic_source})
    //   }
    // })
  }

//   savePhoto = () => {
//     let {uri, filename} = this.state.pic_source;
//     let timestamp = Math.floor(Date.now());
//     filename = `${timestamp}_${randomString({length:20})}_`+filename;
//     uploadFileS3(uri, 'uploads/', filename).then(url => {
//       this.onInputAnswer(url, null, true);
//     })
//   }

  renderImageSort(question) {
    let {images} = question;
    // return (
    //   <SortableGrid>
    //     {
    //       images.map((item, index) => <img key={index} style={styles.block} src={item.image_url}/>)
    //     }
        
    //   </SortableGrid>
    // )
  }

  render() {
    return (
      <div>
        { this.renderHeader() }
        { this.renderContent() }
      </div>
    )
  }
}

export default connect(state => ({
    act: state.entities.act,
    survey: state.entities.act.act_data,
    answers: state.entities.answer && state.entities.answer.answers || [],
  }),
  (dispatch) => ({saveAnswer, setAnswer})
)(SurveyQuestion);
