import React, { Component } from "react";
import PolarDiagram from './PolarDiagram.js';
import NumberFormatter from 'number-formatter';
import tempPolarData from "./tempPolarData.js"


export default class PolarDiagramContainer extends Component {
  constructor(){
    super();

    // this.showToolTip = this.showToolTip.bind(this);
    // this.hideToolTip = this.hideToolTip.bind(this);
  }

  componentDidMount() {
    this.polarDiagram = new PolarDiagram(this.node, tempPolarData(), this.props);
  }
  componentDidUpdate() {
    this.polarDiagram.updateData(tempPolarData());
  }

  // showToolTip() {
  //   const newStyles = Object.assign({}, this.state.toolTipStyles);
  //   newStyles.opacity = 1;
  //   console.log("newStyles", newStyles);
  //   this.setState({ toolTipStyles: newStyles })
  //   console.dir(this.state);
  // }
  //
  // hideToolTip() {
  //   const newStyles = Object.assign({}, this.state.toolTipStyles);
  //   newStyles.opacity = 0;
  //   this.setState({ toolTipStyles: newStyles })
  // }

  // get myProps(){
  //   const myProps = Object.assign({}, this.props);
  //   myProps.updateCurrentPoint = this.updateCurrentPoint;
  //   return myProps;
  // }

  render(){

    const toolTipStyles = {
            top: this.props.currentPoint.y,
            left: this.props.currentPoint.x
          };

    return (
      <div className="diagram-container"
        onMouseOver={ this.showToolTip }
        onMouseOut={ this.hideToolTip }
      >
      <svg ref={node => this.node = node}
      width={400} height={800}>
      </svg>
      <div
      id="polar-diagram-tooltip"
      style={ toolTipStyles }
      >{ NumberFormatter("#.#", this.props.currentPoint.speed) } kt @ { NumberFormatter("#", this.props.currentPoint.angle) }°</div>
      </div>
    );
  }
}
