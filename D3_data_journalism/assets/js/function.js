// format number to USD currency
// var formatter = new Intl.NumberFormat('en-US', {
//   style: 'currency',
//   currency: 'USD',
// });

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis, circlesGroup) {

  var xsign = "";
  var xlabel = "";
  if (chosenXAxis === "poverty") {
    xlabel = "Poverty";
    xsign = "%";
  } else if (chosenXAxis === "age"){
    xlabel = "Age";
  } else {
    xlabel = "Income($)";
  }

  var ysign = "";
  var ylabel = "";
  if (chosenYAxis === "healthcare") {
    ylabel = "Lacks Healthcare";
    ysign = "%";
  } else if (chosenYAxis === "smokes"){
    ylabel = "Smokes";
    ysign = "%";
  } else {
    ylabel = "Obesity";
    ysign = "%";
  }
    
    
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}${xsign}<br>${ylabel}: ${d[chosenYAxis]}${ysign}`);
    });
  
  circlesGroup.call(toolTip);
  
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data,this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data,this);
    });
  
  return circlesGroup;
  }
  