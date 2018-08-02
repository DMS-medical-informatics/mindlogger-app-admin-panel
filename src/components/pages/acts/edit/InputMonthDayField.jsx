import React, { Component } from 'react';
import cn from 'classnames';

const MONTH_DAY_COUNT = 28;

class InputMonthDayField extends Component {
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
    const {bordered} = this.props;
    var rows = [];
    for (let day = 1; day <= MONTH_DAY_COUNT; day++) {
      rows.push(<div key={day} className={days.includes(day) ? "cell selected" : "cell"} onClick={()=>this.onCheck(day)}>{day}</div>)
    }
    return (
      <div className={cn('weekday',{ bordered })}>
        {rows}
      </div>
    );
  }
}

export default InputMonthDayField;