import React, { Component } from "react";
import GeneratePolarChart from './GeneratePolarChart.js';
import ReactFauxDOM from "react-faux-dom";

export default class PolarChart extends Component {
  constructor(){
    super();
    this.state = {
      data: [
  					  [//iPhone
  						{axis:"Battery Life",value:0.22},
  						{axis:"Brand",value:0.28},
  						{axis:"Contract Cost",value:0.29},
  						{axis:"Design And Quality",value:0.17},
  						{axis:"Have Internet Connectivity",value:0.22},
  						{axis:"Large Screen",value:0.02},
  						{axis:"Price Of Device",value:0.21},
  						{axis:"To Be A Smartphone",value:0.50}
  					  ],[//Samsung
  						{axis:"Battery Life",value:0.27},
  						{axis:"Brand",value:0.16},
  						{axis:"Contract Cost",value:0.35},
  						{axis:"Design And Quality",value:0.13},
  						{axis:"Have Internet Connectivity",value:0.20},
  						{axis:"Large Screen",value:0.13},
  						{axis:"Price Of Device",value:0.35},
  						{axis:"To Be A Smartphone",value:0.38}
  					  ],[//Nokia Smartphone
  						{axis:"Battery Life",value:0.26},
  						{axis:"Brand",value:0.10},
  						{axis:"Contract Cost",value:0.30},
  						{axis:"Design And Quality",value:0.14},
  						{axis:"Have Internet Connectivity",value:0.22},
  						{axis:"Large Screen",value:0.04},
  						{axis:"Price Of Device",value:0.41},
  						{axis:"To Be A Smartphone",value:0.30}
            ]
          ]
    };
  }

  render(){



    const options = {
			  w: 700,
			  h: 500,
			  margin: {top: 100, right: 100, bottom: 100, left: 100},
			  maxValue: 0.5,
			  levels: 5,
			  roundStrokes: true,
			};

    const container = ReactFauxDOM.createElement("div");

    GeneratePolarChart(container, this.state.data, options);

    return container.toReact();
  }
}
