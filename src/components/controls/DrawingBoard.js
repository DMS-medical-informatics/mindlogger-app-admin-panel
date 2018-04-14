import React, {Component} from 'react';
import Immutable from 'immutable';
import './DrawingBoard.css';

export default class DrawingBoard extends Component {
    constructor() {
        
        super();

        this.state = {
        lines: new Immutable.List(),
        isDrawing: false
        };

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mouseup", this.handleMouseUp);
        const {lines} = this.props;
        if(lines) {
            console.log(lines);
            const width = this.refs.drawArea.getBoundingClientRect().width;
            let linesList = new Immutable.List(lines.map(line => (new Immutable.List(line.points.map( point => ({x:point.x*width/100, y: point.y*width/100, time: point.time}))))));
            this.setState({lines: linesList})
        }
    }

    componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseDown(mouseEvent) {
        if (mouseEvent.button != 0) {
        return;
        }

        let {start_time} = this.state;
        if(!start_time) {
            start_time = Date.now();
        }

        const point = this.relativeCoordinatesForEvent(mouseEvent);

        this.setState(prevState => ({
        lines: prevState.lines.push(new Immutable.List([{x:point.get('x'), y:point.get('y'), time:0}])),
        isDrawing: true,
        start_time,
        }));
    }

    handleMouseMove(mouseEvent) {
        if (!this.state.isDrawing) {
        return;
        }

        const point = this.relativeCoordinatesForEvent(mouseEvent);
        let time = Date.now() - this.state.start_time;
        
        this.setState(prevState =>  ({
        lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push({x:point.get('x'), y: point.get('y'), time}))
        }));
    }

    handleMouseUp() {
        this.setState({ isDrawing: false });
    }

    relativeCoordinatesForEvent(mouseEvent) {
        const boundingRect = this.refs.drawArea.getBoundingClientRect();
        return new Immutable.Map({
        x: mouseEvent.clientX - boundingRect.left,
        y: mouseEvent.clientY - boundingRect.top,
        });
    }

    render() {
        return (
        <div
            className="drawArea"
            ref="drawArea"
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
        >
            <Drawing lines={this.state.lines} />
        </div>
        );
    }

    save() {
        const {lines, start_time} = this.state;
        const width = this.refs.drawArea.getBoundingClientRect().width;
        let results = lines.map(line => ({
            points: line.map( point => ({
                ...point,
                x: point.x/width*100,
                y: point.y/width*100
                })).toArray()
            })
        ).toArray();
        return {lines: results, start_time}
    }
}

function Drawing({ lines }) {
    return (
        <svg className="drawing">
        {lines.map((line, index) => (
            <DrawingLine key={index} line={line} />
        ))}
        </svg>
    );
}

function DrawingLine({ line }) {
    const pathData = "M " +
        line
        .map(({x, y, time})=> {
            return `${x} ${y}`;
        })
        .join(" L ");

    return <path className="path" d={pathData} />;
}