import React, { Component } from "react";
import PolarDiagram from './PolarDiagram.js';
import ReactFauxDOM from "react-faux-dom";

export default class PolarDiagramContainer extends Component {
  constructor(){
    super();
  }

  render(){

    const container = ReactFauxDOM.createElement("div");

    const polarDiagram = new PolarDiagram(container, [1, 2, 3]);

    return container.toReact();
  }
}
