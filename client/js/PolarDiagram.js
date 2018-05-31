const d3 = require('d3');

export default class PolarDiagram {


  constructor(container, data, options = {}) {

    this._config = {
        displayWidth: options.displayWidth || 400,
        displayHeight: options.displayHeight || 800,
        margin: {top: 20, right: 20, bottom: 20, left: 20},
        minDegreesToWind: options.minDegreesToWind || 30
      };

    this._data = data;

    // initialize scale for main axis (boat speed)
    this._radialScale = d3.scaleLinear()
      .range([0, this._config.displayWidth - this._config.margin.left - this._config.margin.right])
      .domain([0, this.maxValue]);

    this.baseGroup = this._drawSvgContainer(container);
    this.mainAxis = this._drawMainAxis(this.baseGroup);
  }

  _drawSvgContainer(container) {
    //append a container for the entire svg diagram
    const svg = d3.select(container).append("svg")
        .attr("width",  this._config.displayWidth)
        .attr("height", this._config.displayHeight);

    // append a group, transformed to the diagram origin
    const baseGroup = svg.append("g")
        .attr("transform", "translate(" + this._config.margin.left + "," + (this._config.displayHeight / 2) + ")");

    return baseGroup;
  }

  _drawMainAxis(parentGroup) {
    const axisGroup = parentGroup.append("g").attr("class", "axisGroup");
    axisGroup.append("g")
      .call(d3.axisBottom(this._radialScale));
  }

  get maxValue() {
    return 10;
  }


}


// function GeneratePolarChartOld(container, data) {
//
//   var cfg = {
//    w: 800,				//Width of the circle
//    h: 800,				//Height of the circle
//    margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
//    levels: 3,				//How many levels or inner circles should there be drawn
//    maxValue: 10, 			//What is the value that the biggest circle will represent
//    labelFactor: 0.9, 	//How much farther than the radius of the outer circle should the labels be placed
//    wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
//    opacityArea: 0.35, 	//The opacity of the area of the blob
//    dotRadius: 4, 			//The size of the colored circles of each blog
//    opacityCircles: 0.1, 	//The opacity of the circles of each blob
//    strokeWidth: 2, 		//The width of the stroke around each blob
//    roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
//    color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
//   };
//
//   let maxValue = cfg.maxValue;
//
//   //Scale for the radius
//
//   let radius = Math.min(cfg.w/2, cfg.h/2);
//
//   const rScale = d3.scaleLinear()
//     .range([0, radius])
//     .domain([0, maxValue]);
//
//   //Initiate the radar chart SVG
//   const svg = d3.select(container).append("svg")
//       .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
//       .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
//   //Append a g element
//   const g = svg.append("g")
//       .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
//
//
//   const addLines = function(minAngle){
//     const axisGrid = g.append("g").attr("class", "axisWrapper");
//
//     const axis = axisGrid.selectAll(".axis")
//       .data(["A", "B", "C", "D"])
//       .enter().append("g")
//         .attr("class", "axis");
//     //Append the lines
//     axis.append("line")
//       .attr("x1", 0)
//       .attr("y1", 0)
//       .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(1*(i + 1) - Math.PI/2); })
//       .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(1*(i + 1) - Math.PI/2); })
//       .attr("class", "line")
//       .style("stroke", "white")
//       .style("stroke-width", "2px");
//
//     //Append the labels at each axis
//     axis.append("text")
//       .attr("class", "legend")
//       .style("font-size", "11px")
//       .attr("text-anchor", "middle")
//       .attr("dy", "0.35em")
//       .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(1*(i + 1) - Math.PI/2); })
//       .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(1*(i + 1) - Math.PI/2); })
//       .text(function(d){return d});
//
//     axisGrid.append("g")
//       .call(d3.axisBottom(rScale));
//   };
//
//   addLines();
// }
