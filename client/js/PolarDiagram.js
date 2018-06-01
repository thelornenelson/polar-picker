const d3 = require('d3');
const Coordinate = require('coordinate-systems');

export default class PolarDiagram {


  constructor(container, data, options = {}) {

    this._data = data;
    this._config = {
        displayWidth: options.displayWidth || 400,
        displayHeight: options.displayHeight || 800,
        margin: {top: 20, right: 20, bottom: 20, left: 20},
        radialPaddingFactor: 1.1,
        minDegreesToWind: options.minDegreesToWind || 30,
        outerRimThickness: 1

      };


    // initialize scale for main axis (boat speed)
    this._radialScale = d3.scaleLinear()
      .range([0, this._config.displayWidth - this._config.margin.left - this._config.margin.right])
      .domain([0, this.maxValue * this._config.radialPaddingFactor]);

    // maps degrees from wind to applicable angle for display (in radians)
    this._angularScale = d3.scaleLinear()
      .range([Math.radians(this._config.minDegreesToWind), Math.PI])
      .domain([this._config.minDegreesToWind, 180]);

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
    // Create group to hold axis and main radial gridlines
    const axisGroup = parentGroup.append("g").attr("class", "axisGroup");

    // draw main radial gridlines at minDegreesToWind, 90deg, 180 deg
    axisGroup.selectAll(".radialGridline")
      .data(this._radialGridlineData)
      .enter().append("g")
        .attr("class", ".radialGridline")
      .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => { return this._radialScale(d.cart()[0]) })
        .attr("y2", (d, i) => { return this._radialScale(d.cart()[1]) })
        .attr("class", "line")
        .style("stroke", "black")
        .style("stroke-width", "2px");

    // draw outer rim
    const dOuterRadius = d3.arc()
      .innerRadius(this._radialScale(this._paddedOuterRadius) - this._config.outerRimThickness)
      .outerRadius(this._radialScale(this._paddedOuterRadius))
      .startAngle(this._angularScale(this._config.minDegreesToWind))
      .endAngle(Math.PI);

    axisGroup.append("path")
      .attr("d", dOuterRadius());

    // draw main scale for boat speed
    axisGroup.append("g")
      .call(d3.axisTop(this._radialScale));
    return axisGroup;
  }

  // return array of Coordinate objects corresponding to outer ends of radial gridlines.
  get _radialGridlineData(){
    const angles = [this._config.minDegreesToWind, 90, 180];

    return angles.map((angle) => {
      return  Coordinate.polar({
        coords: [this._paddedOuterRadius, angle - 90],
        isDegree: true
      });
    })

  }

  get _paddedOuterRadius(){
    return this.maxValue * this._config.radialPaddingFactor;
  }

  get maxValue() {
    return 10;
  }

}

// Angular Helper Functions
// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};
