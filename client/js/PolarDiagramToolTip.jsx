import React, { Component } from "react";
import NumberFormatter from "number-formatter";


export default class PolarDiagramToolTip extends Component {

  render(){

    const toolTipStyles = {
            top: this.props.currentPoint.y,
            left: this.props.currentPoint.x
          };

    return (
      <div
      id="polar-diagram-tooltip"
      style={ toolTipStyles }
      >{ NumberFormatter("#.#", this.props.currentPoint.speed) } kt @ { NumberFormatter("#", this.props.currentPoint.angle) }°</div>
    );
  }
}
