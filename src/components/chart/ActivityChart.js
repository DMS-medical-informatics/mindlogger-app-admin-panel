import React, { Component } from 'react'
import eventDrops from './eventDrops/'
import * as d3 from 'd3'
import {select, event as currentEvent} from 'd3-selection';
const colors = d3.schemeCategory10

export default class ActivityChart extends Component {
    componentWillMount() {
        
    }
    componentDidUpdate() {

    }
    renderChart = (node, data) => {
        if(this.node) return
        this.node = node
        const {start, result} = data
        const {onSelect, onHover, onOut, onColor} = this.props

        let chart = eventDrops(
            {date:(d => d.date),
            start:(start),
            margin:({ top: 60, left: 50, bottom: 40, right: 100 }),
            labelsWidth:(100),
            eventColor:(onColor),
            click:(onSelect),
            mouseover:(data => { 
                onHover(data, currentEvent)}),
            })
        //var node = ReactDOM.findDOMNode(this)
        return d3.select(node).datum(result).call(chart)
    }
    render() {
        return (<div style={{width: '100%', height: '400px', overflow:'auto'}} ref={node=>this.renderChart(node, this.props.data)} ></div>)
    }

}