import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import SurveyInputComponent from './SurveyInputComponent'


class SurveyImageSelector extends SurveyInputComponent {

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
                <img className={cn({'image-selected':idx === answer})} src={item.image_url} alt={idx}/>
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
