import React, { Component } from "react";
import NumberFormatter from "number-formatter";


export default class PolarDiagramToolTip extends Component {

  constructor(){
    super();

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(e){
    if(e.key === "Enter"){
      this.props.updateCurrentPoint(null, "saveEdit");
    }
  }

  render(){

    const toolTipContent = {
      display: (<span>{ NumberFormatter("#.#", this.props.currentPoint.boatSpeed) } kt @ { NumberFormatter("#", this.props.currentPoint.angle) }°</span>),
      edit: (
        <input
        id="polarDiagramEditInput"
        onChange={ e => this.props.updateEditPoint(e.target.value) }
        onKeyPress={ this.handleKeyPress }
        value={ `${this.props.editPoint.boatSpeed}@${this.props.editPoint.angle}` }
        ></input>
      )
    }

    const toolTipStyles = {
            top: this.props.currentPoint.y,
            left: this.props.currentPoint.x
          };

    return (
      <div
      id="polar-diagram-tooltip"
      style={ toolTipStyles }
      >{ this.props.editActive ? toolTipContent.edit : toolTipContent.display }</div>
    );
  }
}
