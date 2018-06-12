const d3 = require('d3');
const Coordinate = require('coordinate-systems');

export default class PolarDiagram {

  constructor(container, data, props, options = {}) {

    this.mouseMoved = this.mouseMoved.bind(this);

    this._data = this.checkData(data);

    this.props = props;
    this.svg = d3.select(container);

    // remove any previous contents so we don't render multiple times. Because of interaction with react, we need to re-render the whole thing whenever any data changes.
    this.svg.selectAll("g").remove();

    this._config = {
        displayWidth: options.displayWidth || 400,
        displayHeight: options.displayHeight || 800,
        centerPositionFromTop: 400,
        margin: {top: 20, right: 40, bottom: 20, left: 20},
        radialPaddingFactor: 1.1,
        minDegreesToWind: options.minDegreesToWind || 30,
        outerRimThickness: 1,
        outerRimLabelAngles: [180, 165, 150, 135, 120, 105, 90, 75, 60, 45, options.minDegreesToWind || 30],
        dataPointAttrs: { r: 3, fill: "tomato" },
        dataPointHighlightedAttrs: { r: 8, fill: "orange" },
        closestPointAttrs: { r: 5, fill: "yellow" }
      };


    // initialize scale for main axis (boat speed)
    this._radialScale = d3.scaleLinear()
      .range([0, this._config.displayWidth - this._config.margin.left - this._config.margin.right])
      .domain([0, this.maxValue * this._config.radialPaddingFactor]);

    // maps degrees from wind to applicable angle for display (in radians)
    this._angularScale = d3.scaleLinear()
      .range([Math.radians(this._config.minDegreesToWind), Math.PI])
      .domain([this._config.minDegreesToWind, 180]);

    console.log("Rendering Chart");
    this.baseGroup = this._drawSvgContainer(container);
    this.mainAxis = this._drawMainAxis(this.baseGroup, true);
    this.polarCurves = this._drawPolarCurves(this.baseGroup, true);
    this.dataPoints = this._drawDataPoints(this.baseGroup, true);
    this.markClosestPoint();

  }

  updateData(newData){
    this._data = this.checkData(newData);
    this._drawPolarCurves(this.baseGroup);
    this._drawDataPoints(this.baseGroup);
  }

  checkData(data){
    return data.map((windSpeedSeries) => {
      // ensure data is sorted by wind angle, ascending
      windSpeedSeries.points.sort((pointA, pointB) => {
        return pointA.angle - pointB.angle;
      });
      return windSpeedSeries;
    });
  }

  markClosestPoint(enable=true) {

    if(!this.closestPointMarker) {
      // create marker if it doesn't already exist
      this.closestPointMarker = this.baseGroup.append("circle")
      .attr("r", this._config.closestPointAttrs.r)
      .style("fill", this._config.closestPointAttrs.fill)
      .classed("closest-point", true);
    }

    if(enable){
      // bind event
      this.svg.on("mousemove", this.mouseMoved );
      this.closestPointMarker
        .attr("fill-opacity", 1)
    } else {
      this.svg.on("mousemove", null);
      this.closestPointMarker
        .attr("fill-opacity", 0);
    }

  }

  // event handler to move highlighted circle
  mouseMoved() {
    const m = d3.mouse(this.baseGroup.node());
    const p = this.closestPoint(this.polarCurves.nodes(), m);
    // line.attr("x1", p[0]).attr("y1", p[1]).attr("x2", m[0]).attr("y2", m[1]);
    this.closestPointMarker.attr("cx", p.x).attr("cy", p.y);
    this.updateCurrentPoint(p);
  }

  // takes point p, an object with either x and y pixel coordinates, or boatSpeed and angle keys. Will automatically calculate the other keys and call the update function passed as a prop with the complete {x, y, boatSpeed, angle} point.
  updateCurrentPoint(p, action="update"){
    if(p.x){
      // if x and y were provided
      let currentPointPolar = Coordinate.cart([p.x, p.y]).polar();
      p.boatSpeed = this._radialScale.invert(currentPointPolar[0]);
      p.angle = this._angularScale.invert(currentPointPolar[1]) + 90;
    } else {
      // otherwise, if boatSpeed and heading were provided
      let currentPointPixels = Coordinate.polar({
        coords: [this._radialScale(p.boatSpeed), this._angularScale(p.angle - 90)]
      }).cart();
      p.x = currentPointPixels[0];
      p.y = currentPointPixels[1];
    }

    // account for margins
    p.x += this._config.margin.left;
    p.y += this._config.displayHeight - this._config.centerPositionFromTop + this._config.margin.top;


    this.props.updateCurrentPoint(p, action);
  }

  // based on Closest Point on Path code from https://bl.ocks.org/mbostock/8027637 (Distributed under GPL 3.0)
  // Modified to handle multiple paths and return {x: , y: } object instead of array.
  closestPoint(pathNodes, point) {

    const scanResults = [];
    let precision = 8;

    pathNodes.forEach((pathNode, index) => {
      let pathLength = pathNode.getTotalLength(),
      best,
      bestLength,
      bestDistance = Infinity;

      // linear scan for coarse approximation
      for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
        if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
          best = scan, bestLength = scanLength, bestDistance = scanDistance;
        }
      }
      scanResults.push({best, bestLength, bestDistance, pathLength, pathNodeIndex: index});
    });
    scanResults.sort((a, b) => {
      b.bestDistance - a.bestDistance;
    });

    let overallBest = [scanResults[0].best.x, scanResults[0].best.y];
    overallBest.distance = scanResults[0].bestDistance;
    let lastPathBest = overallBest;
    let currentResultIndex = 0;

    while(currentResultIndex < scanResults.length){
      const currentResult = scanResults[currentResultIndex];
      // binary search for precise estimate
      precision /= 2;
      while (precision > 0.5) {
        var before,
        after,
        beforeLength,
        afterLength,
        beforeDistance,
        afterDistance;
        if ((beforeLength = currentResult.bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNodes[currentResult.pathNodeIndex].getPointAtLength(beforeLength))) < currentResult.bestDistance) {
          currentResult.best = before, currentResult.bestLength = beforeLength, currentResult.bestDistance = beforeDistance;
        } else if ((afterLength = currentResult.bestLength + precision) <= currentResult.pathLength && (afterDistance = distance2(after = pathNodes[currentResult.pathNodeIndex].getPointAtLength(afterLength))) < currentResult.bestDistance) {
          currentResult.best = after, currentResult.bestLength = afterLength, currentResult.bestDistance = afterDistance;
        } else {
          precision /= 2;
        }
      }

      currentResult.best = [currentResult.best.x, currentResult.best.y];
      currentResult.best.distance = Math.sqrt(currentResult.bestDistance);
      lastPathBest = currentResult.best;
      currentResultIndex += 1;
      if(currentResult.best.distance < overallBest.distance){
        overallBest = currentResult.best;
      }
    }
    return {x: overallBest[0], y: overallBest[1]};

    function distance2(p) {
      const dx = p.x - point[0];
      const dy = p.y - point[1];
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
        .attr("transform", "translate(" + this._config.margin.left + "," + (this._config.displayHeight  - this._config.centerPositionFromTop) + ")");

    return baseGroup;
  }

  _drawMainAxis(parentGroup, initialize) {
    // Create group to hold axis and main radial gridlines
    const axisGroup = initialize ? parentGroup.append("g").attr("class", "axisGroup") : parentGroup.select("g .axisGroup");

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

  _drawPolarCurves(parentGroup, initialize=false){

    const polarCurvesGroup = initialize ? parentGroup.append("g").classed("polarCurves", true) : parentGroup.select("g .polarCurves");

    const defineCurvePath = d3.lineRadial()
      .angle((point) => { return Math.radians(point.angle); })
      .radius((point) => { return this._radialScale(point.boatSpeed); })
      .curve(d3.curveCardinal);

    // const polarCurves = polarCurvesGroup.selectAll(".polarCurve")
    const polarCurves = polarCurvesGroup.selectAll(".polarCurve")
      .data(this._data);

    polarCurves.exit()
        .remove();

    return polarCurves.enter()
      .append("path")
        .classed("polarCurve", true)
        .attr("fill", "none")
        .attr("stroke", "black")
      .merge(polarCurves)
          .attr("d", (d) => { return defineCurvePath(d.points); });

    // return polarCurves;
  }

  _drawDataPoints(parentGroup, initialize=false){

    const dataPointsGroup = initialize ? parentGroup.append("g").classed("dataPoints", true) : parentGroup.select("g .dataPoints");
    console.log(dataPointsGroup);
    const dataPointAttrs = {
      r: this._config.dataPointAttrs.r,
      fill: this._config.dataPointAttrs.fill,
      cx: (d) => {
        const coordinate = this._radialCoordinates([d.angle], d.boatSpeed)[0];
        return this._radialScale(coordinate.cart()[0]);
      },
      cy: (d) => {
        const coordinate = this._radialCoordinates([d.angle], d.boatSpeed)[0];
        return this._radialScale(coordinate.cart()[1]);
      }
    };

    const dataPointHighlightedAttrs = this._config.dataPointHighlightedAttrs;

    const callMarkClosestPoint = (enable) => {
      this.markClosestPoint(enable);
    };

    const callUpdateCurrentPoint = (p, action="update") => {
      this.updateCurrentPoint(p, action);
    };

    const callSetEditMode = (active) => {
      this.props.setEditMode(active);
    }

    const dataPoints = dataPointsGroup.selectAll(".dataPoint")
      .data(this._data.reduce((dataPoints, currentWindSpeedSeries) => {
        return [...dataPoints, ...currentWindSpeedSeries.points];
      }, []));

      dataPoints.exit()
        .remove();

    dataPoints.enter()
        .append("circle")
          .classed("dataPoint", true)
          .attr("r", dataPointAttrs.r)
          .attr("fill", dataPointAttrs.fill)
        .merge(dataPoints)
          .attr("cx", dataPointAttrs.cx)
          .attr("cy", dataPointAttrs.cy)
          .on("click.dataPoint", function() {
            const data = d3.select(this).data()[0];
            callUpdateCurrentPoint({ boatSpeed: data.boatSpeed, angle: data.angle }, "beginEdit");
          })
          .on("mouseover", function(d) {
            callMarkClosestPoint(false);
            d3.select(this)
              .attr("r", dataPointHighlightedAttrs.r)
              .attr("fill", dataPointHighlightedAttrs.fill);

            const pixelPosition = d3.mouse(this);
            callUpdateCurrentPoint({ x: pixelPosition[0], y: pixelPosition[1] });
          })
          .on("mouseout", function(d) {
            callMarkClosestPoint(true);
            d3.select(this)
              .attr("r", dataPointAttrs.r)
              .attr("fill", dataPointAttrs.fill);
          });

    return dataPoints;
  }

  dataPointToPixels(dataPoint) {
    const coordinate = Coordinate.polar({
      coords: [dataPoint.boatSpeed, dataPoint.angle - 90],
      isDegree: true
    }).cart();

    return { x: coordinate[0], y: coordinate[1] };
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
