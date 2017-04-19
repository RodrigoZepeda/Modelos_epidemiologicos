
//Create svg2 object
var svg2 = d3.select("#zika2")
        .append("svg:svg")
        .attr("width", 900)
        .attr("height", 500);

var x2 = d3.scaleLinear().rangeRound([0, width]),
    y2 = d3.scaleLinear().rangeRound([height, 0]);

var g2 = svg2.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(url, function(d) {
    
        d.Zika = +d.Zika;
        d.semana = +d.semana;
    
    return d;
}, function(error, data) {
  if (error) throw error;

  x2.domain([0, 1 + d3.max(data, function(d) { return d.semana; })]);
  y2.domain([0, d3.max(data, function(d) { return d.Zika; })]);

  g2.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x2));

  g2.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y2))
   
  g2.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.semana); })
      .attr("y", function(d) { return y(d.Zika); })
      .attr("width", function(d) { return 20; })
      .attr("height", function(d) { return height - y(d.Zika); });

   g2.append("line")
     .attr("x1", 0)
     .attr("y1", height)
     .attr("x2", width)
     .attr("y2", 50)
     .style("stroke-width", 3)
     .style("stroke", "red"); 
});