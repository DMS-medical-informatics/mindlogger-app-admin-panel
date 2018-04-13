import React, {Component} from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import cn from 'classnames';

import SurveyInputComponent from './SurveyInputComponent'

// var styles = StyleSheet.create({
//   imagesContainer: {
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     flexDirection: 'row'
//   },
//   image: {
//     paddingTop: 50,
//     width: 120,
//     height: 120,
//     margin: 10,
//     borderRadius: 4,
//   },
//   imageSelected: {
//     paddingTop: 50,
//     width: 120,
//     height: 120,
//     margin: 10,
//     borderRadius: 4,
//     borderWidth: 4,
//     borderColor: '#ff345a',
//   },
//   backdropView: {
//     height: 20,
//     width: 120,
//     backgroundColor: 'rgba(255,255,255,0.4)',
//   },
//   headline: {
//     fontSize: 20,
//     textAlign: 'center',
//     backgroundColor: 'rgba(255,255,255,0.4)',
//     color: 'black'
//   }
// });

class SurveyImageSelector extends SurveyInputComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { answer, question} = this.props.data
    const { title, images } =question

    return (
      <div>
        { !this.props.disableHeader && (<h4>{title}</h4>) }
        <div className="image-selector">
        {
          images.map((item, idx) => {
            return (
                <div key={idx} onClick={() => {
                  this.selectAnswer(idx, true)
                }}>
                <img className={cn({'image-selected':idx == answer})} src={item.image_url}/>
                </div>
              )
          })
        }
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  }),
  (dispatch) => ({
    //actions: bindActionCreators(counterActions, dispatch)
  })
)(SurveyImageSelector);
