
//Create svg object
var svg = d3.select("#zika1")
        .append("svg:svg")
        .attr("width", 900)
        .attr("height", 500);

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleLinear().rangeRound([0, width]),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var url = "https://raw.githubusercontent.com/RodrigoZepeda/Modelos_epidemiologicos/master/data/Zika.csv";

d3.csv(url, function(d) {
    
        d.Zika = +d.Zika;
        d.semana = +d.semana;
    
    return d;
}, function(error, data) {
  if (error) throw error;

  x.domain([0, 1 + d3.max(data, function(d) { return d.semana; })]);
  y.domain([0, d3.max(data, function(d) { return d.Zika; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
   
  g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.semana); })
      .attr("y", function(d) { return y(d.Zika); })
      .attr("width", function(d) { return 20; })
      .attr("height", function(d) { return height - y(d.Zika); });
});