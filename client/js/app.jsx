import React, { Component } from 'react';
import '../scss/application.scss';
import PolarDiagramContainer from './PolarDiagramContainer.jsx';

export default class App extends Component {

  constructor(){
    super();
    this.state = { mousePosition: null };
    this.testMouse = this.testMouse.bind(this);
  }

  testMouse(e){
    console.log(`(${e.offsetX},${e.offsetY})`);
    console.dir(e);
    this.setState({mousePosition: {x: e.offsetX, y: e.offsetY}});
  }

  render() {
    return (
      <div>
        <PolarDiagramContainer
          mousePosition={ this.state.mousePosition }
          mouseHandler={ this.testMouse }
        />
      </div>
    )
  }
}
