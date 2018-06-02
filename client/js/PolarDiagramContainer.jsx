import React, { Component } from "react";
import PolarDiagram from './PolarDiagram.js';
import ReactFauxDOM from "react-faux-dom";
import tempPolarData from "./tempPolarData.js"

export default class PolarDiagramContainer extends Component {
  constructor(){
    super();
  }

  render(){

    const container = ReactFauxDOM.createElement("div");

    const polarDiagram = new PolarDiagram(container, tempPolarData(), this.props.mousePosition);
    container.childNodes[0].addEventListener("onMouseMove", this.props.mouseHandler);
    const toReact = container.toReact();
    return toReact;
  }
}
