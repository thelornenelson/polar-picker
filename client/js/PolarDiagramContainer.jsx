import React, { Component } from "react";
import PolarDiagram from "./PolarDiagram.js";
import PolarDiagramToolTip from "./PolarDiagramToolTip.jsx"

export default class PolarDiagramContainer extends Component {

  componentDidMount() {
    this.polarDiagram = new PolarDiagram(this.node, this.props.polarData, this.props);
  }
  componentDidUpdate() {
    this.polarDiagram.updateData(this.props.polarData);
  }

  render(){

    return (
      <div className="diagram-container">
        <svg ref={node => this.node = node}
        width={400} height={800}>
        </svg>
        <PolarDiagramToolTip
        currentPoint={ this.props.currentPoint }
        editActive={ this.props.editActive }
        />
      </div>
    );
  }
}
