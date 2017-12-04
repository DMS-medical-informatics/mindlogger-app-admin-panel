import React, { Component } from 'react'
import {connect} from 'react-redux'
import ReactDOM from 'react-dom'
import {Table, Row, Col, Button, Panel, Modal, Clearfix} from 'react-bootstrap'
import eventDrops from 'event-drops'
import * as d3 from 'd3'
const colors = d3.schemeCategory10

export default class ActivityChart extends Component {
    componentWillMount() {
        
    }
    componentDidUpdate() {

    }
    renderChart = (node, data) => {
        const {start, result} = data
        const {onSelect} = this.props
        let chart = eventDrops()
            .date(d => d.date)
            .start(start)
            .margin({ top: 60, left: 50, bottom: 40, right: 100 })
            .labelsWidth(100)
            .eventLineColor((d, i) => colors[i])
            .click(onSelect)
        //var node = ReactDOM.findDOMNode(this)
        return d3.select(node).datum(result).call(chart)
    }
    render() {
        return (<div style={{width: '100%', height: '400px', overflow:'auto'}} ref={node=>this.renderChart(node, this.props.data)} ></div>)
    }

}