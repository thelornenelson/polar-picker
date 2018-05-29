const d3 = require('d3');

export default function GeneratePolarChart(container, data) {

  var cfg = {
   w: 600,				//Width of the circle
   h: 600,				//Height of the circle
   margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
   levels: 3,				//How many levels or inner circles should there be drawn
   maxValue: 10, 			//What is the value that the biggest circle will represent
   labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
   wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
   opacityArea: 0.35, 	//The opacity of the area of the blob
   dotRadius: 4, 			//The size of the colored circles of each blog
   opacityCircles: 0.1, 	//The opacity of the circles of each blob
   strokeWidth: 2, 		//The width of the stroke around each blob
   roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
   color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
  };

  let maxValue = cfg.maxValue;

  //Scale for the radius

  let radius = Math.min(cfg.w/2, cfg.h/2);

  const rScale = d3.scaleLinear()
    .range([0, radius])
    .domain([0, maxValue]);

  //Initiate the radar chart SVG
  const svg = d3.select(container).append("svg")
      .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
  //Append a g element
  const g = svg.append("g")
      .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");


  const addLines = function(minAngle){
    const axisGrid = g.append("g").attr("class", "axisWrapper");

    const axis = axisGrid.selectAll(".axis")
      .data(["A", "B", "C", "D"])
      .enter().append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(1*(i + 1) - Math.PI/2); })
      .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(1*(i + 1) - Math.PI/2); })
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(1*(i + 1) - Math.PI/2); })
      .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(1*(i + 1) - Math.PI/2); })
      .text(function(d){return d});
  };

  addLines();
}
