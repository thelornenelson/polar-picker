import React, { Component } from "react";
import PolarDiagram from './PolarDiagram.js';
import tempPolarData from "./tempPolarData.js"

export default class PolarDiagramContainer extends Component {
  constructor(){
    super();
  }

  componentDidMount() {
   new PolarDiagram(this.node, tempPolarData(), this.props);
  }
  componentDidUpdate() {
    new PolarDiagram(this.node, tempPolarData(), this.props);
  }

  render(){
    return (<svg ref={node => this.node = node}
      width={400} height={800}>
      </svg>);
  }
}
