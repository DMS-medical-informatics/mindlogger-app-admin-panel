import React, { Component } from 'react';
import cn from 'classnames';

class InputWeekdayField extends Component {
  componentWillMount() {
    const {input} = this.props;
    let days = input.value || [];
    this.setState({days})
  }
  onCheck(day) {
    let {days} = this.state;
    let index = days.indexOf(day);
    if (index>-1) {
      days.splice(index,1);
    } else {
      days.push(day);
    }
    this.setState({days});
    this.props.input.onChange(days);

  }
  render() {
    const { days } = this.state;
    const { bordered } = this.props;
    var rows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className={cn('weekday',{ bordered })}>
        { rows.map((value, i) => 
          (<div key={i} className={ cn('cell', { selected: days.includes(i) })} onClick={()=>this.onCheck(i)}>{value}</div>)
        ) }
      </div>
    );
  }
}

export default InputWeekdayField;