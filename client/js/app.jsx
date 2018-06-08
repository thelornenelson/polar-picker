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
      currentPoint: {speed: 0, angle: 0},
      polarData: tempPolarData(),
      editPoint: { speed: null, angle: null },
      editActive: false
    }

    this.updateCurrentPoint = this.updateCurrentPoint.bind(this);
    this.updateEditPoint = this.updateEditPoint.bind(this);
  }

  updateCurrentPoint(newPoint, action){
    console.log(newPoint);
    const actions = {
      update: () => {
        if(!this.state.editActive){
          this.setState({ currentPoint: newPoint })
        }
      },
      edit: () => {
        this.setState({ currentPoint: newPoint, editActive: true });
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
    setState({ editPoint: { speed: newData[0], angle: newData[1]} });
  }

  render() {
    return (
      <div>
        <PolarDiagramContainer
          updateCurrentPoint={ this.updateCurrentPoint }
          updateEditPoint={ this.updateEditPoint }
          setEditMode={ this.setEditMode }
          currentPoint={ this.state.currentPoint }
          polarData={ this.state.polarData }
          editActive={ this.state.editActive }
        />
      </div>
    )
  }
}
