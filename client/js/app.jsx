import React, { Component } from 'react';
import '../scss/application.scss';
import PolarDiagramContainer from './PolarDiagramContainer.jsx';

export default class App extends Component {

  constructor(){
    super();
    this.state = { currentPoint: {speed: 0, angle: 0} }
    this.updateCurrentPoint = this.updateCurrentPoint.bind(this);
  }

  updateCurrentPoint(newPoint){
    this.setState({ currentPoint: newPoint });
  }

  render() {
    return (
      <div>
        <PolarDiagramContainer
          updateCurrentPoint={this.updateCurrentPoint}
        />
        <p>{this.state.currentPoint.speed} kt @ {this.state.currentPoint.angle}°</p>
      </div>
    )
  }
}
