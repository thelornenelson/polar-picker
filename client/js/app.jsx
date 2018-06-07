import React, { Component } from 'react';
import '../scss/application.scss';
import PolarDiagramContainer from './PolarDiagramContainer.jsx';
import NumberFormatter from 'number-formatter';

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
          updateCurrentPoint={ this.updateCurrentPoint }
          currentPoint={ this.state.currentPoint }
        />
      </div>
    )
  }
}
