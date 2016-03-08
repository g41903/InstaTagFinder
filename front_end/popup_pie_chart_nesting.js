// <!-- popup_pie_chart_nesting.js -->

// Load the flight data asynchronously.
d3.csv("flights.csv", function(flights) {

  // Define the margin, radius, and color scale. Colors are assigned lazily, so
  // if you want deterministic behavior, define a domain for the color scale.
  var m = 10,
      r = 100,
      z = d3.scale.category20c();

  // Define a pie layout: the pie angle encodes the count of flights. Since our
  // data is stored in CSV, the counts are strings which we coerce to numbers.
  var pie = d3.layout.pie()
      .value(function(d) { return +d.count; })
      .sort(function(a, b) { return b.count - a.count; });

  // Define an arc generator. Note the radius is specified here, not the layout.
  var arc = d3.svg.arc()
      .innerRadius(r / 2)
      .outerRadius(r);

  // Nest the flight data by originating airport. Our data has the counts per
  // airport and carrier, but we want to group counts by aiport.
  var airports = d3.nest()
      .key(function(d) { return d.origin; })
      .entries(flights);

  // Insert an svg element (with margin) for each airport in our dataset. A
  // child g element translates the origin to the pie center.
  var svg = d3.select("body").selectAll("div")
      .data(airports)
    .enter().append("div") // http://code.google.com/p/chromium/issues/detail?id=98951
      .style("display", "inline-block")
      .style("width", (r + m) * 2 + "px")
      .style("height", (r + m) * 2 + "px")
    .append("svg:svg")
      .attr("width", (r + m) * 2)
      .attr("height", (r + m) * 2)
    .append("svg:g")
      .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

  // Add a label for the airport. The `key` comes from the nest operator.
  svg.append("svg:text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.key; });

  // Pass the nested per-airport values to the pie layout. The layout computes
  // the angles for each arc. Another g element will hold the arc and its label.
  var g = svg.selectAll("g")
      .data(function(d) { return pie(d.values); })
    .enter().append("svg:g");

  // Add a colored arc path, with a mouseover title showing the count.
  g.append("svg:path")
      .attr("d", arc)
      .style("fill", function(d) { return z(d.data.carrier); })
    .append("svg:title")
      .text(function(d) { return d.data.carrier + ": " + d.data.count; });

  // Add a label to the larger arcs, translated to the arc centroid and rotated.
  g.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
      .text(function(d) { return d.data.carrier; });

  // Computes the label angle of an arc, converting from radians to degrees.
  function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    return a > 90 ? a - 180 : a;
  }
});

