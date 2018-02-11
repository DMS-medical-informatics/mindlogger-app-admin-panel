import React, { Component } from 'react'
import eventDrops from './eventDrops/'
import * as d3 from 'd3'
import {select, event as currentEvent} from 'd3-selection';
const colors = d3.schemeCategory10

function selectColor(colorNum, colors) {
    if (colors < 1) 
        colors = 1; // defaults to one color - avoid divide by zero
    return "hsl(" + (colorNum * (360 / colors) % 360) + ",100%,50%)";
}

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
            {
                date:(d => new Date(d.updatedAt)),
                start:(start),
                margin:({ top: 60, left: 50, bottom: 40, right: 100 }),
                labelsWidth:(100),
                eventLineColor:(onColor ? onColor : (data, idx) => selectColor(idx, result.length)),
                click:(onSelect),
                mouseover:(data => { 
                    onHover(data, currentEvent)}),
            })
        //var node = ReactDOM.findDOMNode(this)
        return d3.select(node).datum(result).call(chart)
    }
    render() {
        return (<div style={{width: '100%', overflow:'auto'}} ref={node=>this.renderChart(node, this.props.data)} ></div>)
    }

}