import React, { Component } from 'react';
import NumberFormatter from 'number-formatter';
import update from 'immutability-helper';
import '../scss/application.scss';
import PolarDiagramContainer from './PolarDiagramContainer.jsx';
import tempPolarData from "./tempPolarData.js"

export default class App extends Component {

  constructor(){
    super();
    this.state = {
      currentPoint: {boatSpeed: 0, angle: 0},
      // polarData structure is [ {windspeed: 14, points:[ {angle: 120, boatSpeed: 9.32}, ... ]}, ... ]
      polarData: tempPolarData(),
      editPoint: { boatSpeed: null, angle: null },
      editActive: false
    }

    this.updateCurrentPoint = this.updateCurrentPoint.bind(this);
    this.updateEditPoint = this.updateEditPoint.bind(this);
  }

  updateCurrentPoint(newPoint, action){

    const actions = {
      update: () => {
        if(!this.state.editActive){
          this.setState({ currentPoint: newPoint })
        }
      },
      beginEdit: () => {
        this.setState({ currentPoint: newPoint, editActive: true, editPoint: newPoint });
        document.getElementById("polarDiagramEditInput").focus();
      },
      saveEdit: () => {

        let pointsIndex;

        const polarDataIndex = this.state.polarData.findIndex(({ points }) => {
          pointsIndex = points.findIndex((point) => {

            return point.boatSpeed === this.state.currentPoint.boatSpeed && point.angle === this.state.currentPoint.angle;
          });
          return pointsIndex >= 0 ? true : false;
        });

        const newPolarDataPoint = { boatSpeed: this.state.editPoint.boatSpeed, angle: this.state.editPoint.angle };

        this.setState({
          polarData: update(this.state.polarData, { [polarDataIndex]: { "points": { [pointsIndex]: { $set: newPolarDataPoint } } } }),
          editActive: false
        });



        // find the current point in polarData
        // Use found indices to set state to editPoint
      }
    }

    try {
      actions[action]();
    } catch (e) {
      console.log(`Unrecognized Action ${action}`, e);
    }
  }

  updateEditPoint(input){
    const newData = input.split(/@/)
    this.setState({ editPoint: { boatSpeed: Number(newData[0]), angle: Number(newData[1]) } });
  }

  render() {
    return (
      <div>
        <PolarDiagramContainer
          updateCurrentPoint={ this.updateCurrentPoint }
          updateEditPoint={ this.updateEditPoint }
          currentPoint={ this.state.currentPoint }
          polarData={ this.state.polarData }
          editPoint={ this.state.editPoint }
          editActive={ this.state.editActive }
        />
      </div>
    )
  }
}
