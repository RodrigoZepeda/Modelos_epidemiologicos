
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

d3.csv("/data/Zika.csv", function(d) {
    data.forEach(function(d) {
        d.Zika = +d.Zika;
        d.semana = +d.semana;
    });
    return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.semana; }));
  y.domain([0, d3.max(data, function(d) { return d.Zika; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Semana");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.semana); })
      .attr("y", function(d) { return y(d.Zika); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.Zika); });
});