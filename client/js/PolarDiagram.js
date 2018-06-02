const d3 = require('d3');
const Coordinate = require('coordinate-systems');

export default class PolarDiagram {

  constructor(container, data, props, options = {}) {

    this._data = data.map((windSpeedSeries) => {
      // ensure data is sorted by wind angle, ascending
      windSpeedSeries.points.sort((pointA, pointB) => {
        return pointA.angle - pointB.angle;
      });

      return windSpeedSeries;
    });

    this.props = props;

    this._config = {
        displayWidth: options.displayWidth || 400,
        displayHeight: options.displayHeight || 800,
        margin: {top: 20, right: 40, bottom: 20, left: 20},
        radialPaddingFactor: 1.1,
        minDegreesToWind: options.minDegreesToWind || 30,
        outerRimThickness: 1,
        outerRimLabelAngles: [180, 165, 150, 135, 120, 105, 90, 75, 60, 45, options.minDegreesToWind || 30]
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
    this.polarCurves = this._drawPolarCurves(this.baseGroup);

    const circle = d3.select(container).append("circle")
      .attr("r", 5)
      // .attr("transform", "translate(" + (-this._config.margin.left) + "," + (-this._config.displayHeight / 2) + ")")
      .style("fill", "yellow");


    const mouseMoved = () => {
        const m = d3.mouse(this.baseGroup.node());
        console.log("m is", m);
        const p = this.closestPoint(this.polarCurves.node(), m);
        console.log("Closest Point is", p);
        // line.attr("x1", p[0]).attr("y1", p[1]).attr("x2", m[0]).attr("y2", m[1]);
        circle.attr("cx", p[0] + this._config.margin.left).attr("cy", p[1] + this._config.displayHeight / 2);
    };

    d3.select(container).on("mousemove", mouseMoved );
  }



  closestPoint(pathNode, point) {
    var pathLength = pathNode.getTotalLength(),
        precision = 8,
        best,
        bestLength,
        bestDistance = Infinity;

    // linear scan for coarse approximation
    for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
      if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
        best = scan, bestLength = scanLength, bestDistance = scanDistance;
      }
    }

    // binary search for precise estimate
    precision /= 2;
    while (precision > 2) {
      var before,
          after,
          beforeLength,
          afterLength,
          beforeDistance,
          afterDistance;
      if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
        best = before, bestLength = beforeLength, bestDistance = beforeDistance;
      } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
        best = after, bestLength = afterLength, bestDistance = afterDistance;
      } else {
        precision /= 2;
      }
    }

    best = [best.x, best.y];
    best.distance = Math.sqrt(bestDistance);
    return best;

    function distance2(p) {
      var dx = p.x - point[0],
          dy = p.y - point[1];
      return dx * dx + dy * dy;
    }
  }

  _drawSvgContainer(container) {
    //append a container for the entire svg diagram
    // const svg = d3.select(container).append("svg")
    //     .attr("width",  this._config.displayWidth)
    //     .attr("height", this._config.displayHeight);

    // append a group, transformed to the diagram origin
    const baseGroup = d3.select(container).append("g")
        .attr("transform", "translate(" + this._config.margin.left + "," + (this._config.displayHeight / 2) + ")");

    // const baseGroup = d3.select(container)
    //     .attr("transform", "translate(" + this._config.margin.left + "," + (this._config.displayHeight / 2) + ")");

    return baseGroup;
  }

  _drawMainAxis(parentGroup) {
    // Create group to hold axis and main radial gridlines
    const axisGroup = parentGroup.append("g").attr("class", "axisGroup");

    // draw main radial gridlines at minDegreesToWind, 90deg, 180 deg
    axisGroup.selectAll(".radialGridline")
      .data(this._radialCoordinates([this._config.minDegreesToWind, 90, 180], this._paddedOuterRadius))
      .enter().append("g")
        .attr("class", ".radialGridline")
      .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => { return this._radialScale(d.cart()[0]); })
        .attr("y2", (d, i) => { return this._radialScale(d.cart()[1]); })
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

    // Add angle labels

    axisGroup.selectAll(".outerRimLabel")
      .data(this._radialCoordinates(this._config.outerRimLabelAngles, this._paddedOuterRadius + 0.5))
      .enter().append("g")
        .classed(".outerRimLabel", true)
      .append("text")
        .attr("text-anchor", "middle")
        .attr("x", (d, i) => { return this._radialScale(d.cart()[0]); })
        .attr("y", (d, i) => { return this._radialScale(d.cart()[1]); })
        .text((d, i) => { return (d.polar()[1] + 90) + "°"; });

    // Add angle tick marks

    // draw main scale for boat speed
    const mainAxisTicks = this._radialScale.ticks();

    // remove first and last values
    mainAxisTicks.pop();
    mainAxisTicks.shift();

    const mainAxis = d3.axisTop(this._radialScale)
      .tickValues(mainAxisTicks)
      .tickSizeOuter(0);

    axisGroup.append("g")
      .call(mainAxis);
    return axisGroup;
  }

  _drawPolarCurves(parentGroup){

    const polarCurvesGroup = parentGroup.append("g").classed("polarCurves", true);

    const defineCurvePath = d3.lineRadial()
      .angle((point) => { return Math.radians(point.angle); })
      .radius((point) => { return this._radialScale(point.boatSpeed); })
      .curve(d3.curveCardinal);

    return polarCurvesGroup.selectAll(".polarCurve")
      .data(this._data)
      .enter()
        .append("g")
          .classed(".polarCurve", true)
      .append("path")
        .attr("d", (d) => { return defineCurvePath(d.points); })
        .attr("fill", "none")
        .attr("stroke", "black");

  }

  // return array of Coordinate objects corresponding to outer ends of radial gridlines.
  _radialCoordinates(angles, radius){

    return angles.map((angle) => {
      return  Coordinate.polar({
        coords: [radius, angle - 90],
        isDegree: true
      });
    })

  }

  get _paddedOuterRadius(){
    return this.maxValue * this._config.radialPaddingFactor;
  }

  get maxValue() {
    return d3.max(this._data, (windSpeedSeries) => {
      return d3.max(windSpeedSeries.points, (point) => {
        return point.boatSpeed;
      });
    });
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
