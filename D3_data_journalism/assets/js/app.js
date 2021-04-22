// import * as d3 from d3
// import d3Tip from "d3-tip"
// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight+ 40);//extra padding

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare"

// function used for updating x-scale var upon click on axis label
function xScale(Demodata, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(Demodata, d => d[chosenXAxis]) * 0.8,
      d3.max(Demodata, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(Demodata, chosenYAxis) { 
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(Demodata, d => d[chosenYAxis]) * 0.8,
        d3.max(Demodata, d => d[chosenYAxis]) * 1.2
      ])
      .range([height,0]);
  
    return yLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// function used for updating YAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }


// function used for updating circles group with a transition to
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderYCircles(circlesGroup, newXScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}
// functions used for updating circles text with a transition on
// new circles for both X and Y coordinates
function renderXText(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderYText(circlesGroup, newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[chosenYAxis])+5);

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "poverty") {
    label = "In Poverty(%):";
  }
  else if (chosenXAxis === "age") {
    label = "Age (Median):";
  
  }
  else {label ="Household Income (Median):"}

  if (chosenYAxis === "healthcare"){
    label = "Lacks Healthcare(&):";
  }
  else if (chosenYAxis === "smokes"){
    label = "Smokes (%):";
  }
  else {label = "Obesity (%):";
  }  
  

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}${xpercentsign}<br>${ylabel}: ${d[chosenYAxis]}${ypercentsign}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(Demodata, err) {
  if (err) throw err;

  // parse data
  Demodata.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(Demodata, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(Demodata,chosenYAxis);
    
  

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("g circle")
    .data(Demodata)
    .enter()
    .append("g")

  var circlexy = circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .classed("stateCircle",true)
    .attr("fill", "lightblue")
    .attr("opacity", ".5");

  var circletext = circlesGroup.append("text")
    .text(d =>d.abbr)
  console.log(circletext)
    // .attr("dx", d => xLinearScale(d[chosenXAxis]))
    // .attr("dy", d => yLinearScale(d[chosenYAxis]))
    // .classed("stateCircle",true)
    // .attr("text-anchor", "middle")





  // Create group for 3 x-axis labels
  
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
     
    

  var povertyLabel = xlabelsGroup.append("text")
    
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Median Age");

  var incomeLabel = xlabelsGroup.append("text")
    
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income");

    // Append 3 y axis label
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)")

  var healthcareLabel = ylabelsGroup.append("text")
  
    .attr("y", 40 - margin.left )
    .attr("x",0-(height/2))
    .attr("dy", "1em")
    .attr("value","healthcare")
    .classed("active", true)
    .text("Lacks Healthcare(%)");

   
  
  var smokesLabel = ylabelsGroup.append("text")
    
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value","obesity")
    .classed("inactive", true)
    .text("Smokers(%)");

    var smokesLabel = ylabelsGroup.append("text")
    
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value","smokes")
    .classed("inactive", true)
    .text("Obese(%)");



  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(Demodata, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

             // updates circles with new x values
        circlesXY = renderXCircles(circlesXY, xLinearScale, chosenXAxis);

      // updates circles text with new x values
        circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);


        
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis ,circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active",false)
            .classed("inactive",true);
              
        }
        else if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
          .classed("active", false)
          .classed("inactive", true);

        }
        else{
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
         .classed("active", true)
         .classed("inactive", false);


        }
      }
    });

    // y axis labels event listener
  ylabelsGroup.selectAll("text")
  .on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenYAxis) {

    // replaces chosenYAxis with value
    chosenYAxis = value;

    // updates y scale for new data
    yLinearScale = yScale(stateData, chosenYAxis);

    // updates y axis with transition
    yAxis = renderYAxes(yLinearScale, yAxis);

    // updates circles with new y values
    circlesXY = renderYCircles(circlesXY, yLinearScale, chosenYAxis);

    // updates circles text with new y values
    circlesText = renderYText(circlesText, yLinearScale, chosenYAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

    // changes classes to change bold text
    if (chosenYAxis === "smokes") {
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel
        .classed("active", true)
        .classed("inactive", false);
      obeseLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else if (chosenYAxis === "obesity"){
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);
      obeseLabel
        .classed("active", true)
        .classed("inactive", false);
    }
    else {
      healthcareLabel
        .classed("active", true)
        .classed("inactive", false);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);
      obeseLabel
        .classed("active", false)
        .classed("inactive", true);
    }
  }
});

}).catch(function(error) {
  console.log(error);
});
