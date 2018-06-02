import React, { Component } from "react";
import PolarDiagram from './PolarDiagram.js';
import tempPolarData from "./tempPolarData.js"

export default class PolarDiagramContainer extends Component {
  constructor(){
    super();
  }

  componentDidMount() {
    this.polarDiagram = new PolarDiagram(this.node, tempPolarData(), this.props);
  }
  componentDidUpdate() {
    this.polarDiagram.updateData(tempPolarData());
  }

  // get myProps(){
  //   const myProps = Object.assign({}, this.props);
  //   myProps.updateCurrentPoint = this.updateCurrentPoint;
  //   return myProps;
  // }



  render(){
    return (
      <div>
      <svg ref={node => this.node = node}
      width={400} height={800}>
      </svg>
      </div>
    );
  }
}
