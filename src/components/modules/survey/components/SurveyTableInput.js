import React, {Component} from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import SurveyInputComponent from './SurveyInputComponent'
//import styles from './styles'

class SurveyTableInput extends SurveyInputComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let {answer, question} = this.props.data
        const {rows, cols, type} = question
        answer = answer || []
        if(answer.length<rows.length) {
            switch(type) {
                case 'text':
                    answer = rows.map((row)=>cols.map( (col) => '' ))
                    break;
                case 'number':
                    answer = rows.map((row)=>cols.map( (col) => 0 ))
                    break;
                case 'single_sel':
                    answer = rows.map((row) => null)
                    break;
                case 'multi_sel':
                    answer = rows.map((row)=>cols.map( (col) => false ))
                    break;
            }
        }
        this.setState({answer})
    }

    onTextInput(value, rowIdx, colIdx) {
        let {answer} = this.state
        answer[rowIdx][colIdx] = value
        this.selectAnswer(answer)
    }

    onChoiceSelect(rowIdx, colIdx) {
        let {answer} = this.state
        answer[rowIdx] = colIdx
        this.selectAnswer(answer)
    }

    onMultiSelect(rowIdx, colIdx) {
        let {answer} = this.state
        answer[rowIdx][colIdx] = !answer[rowIdx][colIdx]
        this.selectAnswer(answer)
    }

    onNumberAdd(value, rowIdx, colIdx) {
        let {answer} = this.state
        answer[rowIdx][colIdx] = (answer[rowIdx][colIdx] || 0) + value
        this.selectAnswer(answer)
    }

    renderCell(question, rowIdx, colIdx) {
        const {answer} = this.state

        switch(question.type) {
            case 'text':
                return (<div key={colIdx} className='text-input' ><input placeholder='' onChange={(value)=>this.onTextInput(value, rowIdx, colIdx)} value={answer[rowIdx][colIdx]}/></div>)
            case 'number':
                return (<Button style={{width:'100%'}} delayLongPress={600} onPress={() => this.onNumberAdd(1, rowIdx,colIdx)} onLongPress={() => this.onNumberAdd(-1, rowIdx, colIdx)}>{answer[rowIdx][colIdx]}</Button>)
            case 'single_sel':
                return (<Button onPress={() => this.onChoiceSelect(rowIdx, colIdx) }><input type='radio' selected={answer[rowIdx] == colIdx} onPress={() => this.onChoiceSelect(rowIdx, colIdx) }/></Button>)
            case 'multi_sel':
                return (<div onPress={() => this.onMultiSelect(rowIdx, colIdx) }><input type='checkbox' checked={answer[rowIdx][colIdx]} onPress={() => this.onMultiSelect(rowIdx, colIdx) } /></div>)
            case 'image_sel':
                return (<div key={colIdx} onPress={() => {
                    this.onChoiceSelect(rowIdx, colIdx)
                  }}>
                  <img style={answer[rowIdx] == colIdx ? { ...this.imageStyle, borderWidth: 3, borderColor: '#ee5555'} : this.imageStyle} source={{uri: question.cols[colIdx].image_url}}/>
                  </div>)
            default:
                  return (<div></div>)
      }
    }
    render() {
        const { answer, question} = this.props.data
        let height = 60
        if(this.state.dimensions && question.type == 'image_sel') {
            height = this.state.dimensions.width/(question.cols.length + 1)
        }
        const cellStyle = {
            height,
            padding: 4,
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
        }
        const rowStyle = {
            height
        }
        this.imageStyle = {
            width: (height-3),
            height: (height-3),
            padding: 3,
        }
        return (
            <div onLayout={this.onLayout}>
                {this.props.disableHeader ? false : <div style={this.rowStyle}><h2>{question.title}</h2></div> }
                <Row>
                    <Col>{' '}</Col>
                    {question.cols.map((col, idx) => (<Col key={idx}>{col.text}</Col>))}
                </Row>
                {question.rows.map((row, rowIdx) => (
                    <Row style={rowStyle} key={rowIdx}>
                        <Col>{row.text}</Col>
                        {question.cols.map( (col, colIdx) => <Col key={colIdx}>{this.renderCell(question, rowIdx, colIdx)}</Col> )}
                    </Row>)
                )}
            </div>
        )
    }

    onLayout = event => {
        if (this.state.dimensions) return // layout was already called
        let {width, height, top, left} = event.nativeEvent.layout
        this.setState({dimensions: {width, height, top, left}})
    }
}

export default connect(state => ({
    
  }),
  (dispatch) => ({
  })
)(SurveyTableInput);
