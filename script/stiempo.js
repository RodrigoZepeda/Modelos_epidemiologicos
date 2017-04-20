//Adapted from http://bl.ocks.org/phil-pedruco/88cb8a51cdce45f13c7e

// Set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 30, left: 90},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

//setting up empty data array
var data, points;
var npoints = 1000;
var tmax   = 100;
var speed  = 0.2,
    incline = 2,
    betainc = 20;

function getvals(){
    var xdom = {
        min: 0,
        max: tmax,
    };

    var maxy = 0;
    var miny = 0;

    if (incline >= 0){
        maxy = tmax*incline + betainc;
    } 
    
    if (incline <= 0) {
        miny = tmax*incline - betainc;
    }

    var ydom = {
        min: miny,
        max: maxy
    };

    return {xdom: xdom, ydom: ydom}
}

document.body.onload = function(){
    document.getElementById("speed").value = speed;
    document.getElementById("incline").value = incline;
    document.getElementById("betainc").value = betainc;

    addpath(); 
}

document.getElementById("speed").onchange = function(){
    addpath();
}

document.getElementById("betainc").onchange = function(){
    addpath();
}

document.getElementById("incline").onchange = function(){
    addpath();
}



function addpath (){

    if (document.contains(document.getElementById("myseries"))){
        document.getElementById("myseries").remove();
    } 

    if (document.contains(document.getElementById("myseries2"))){
        document.getElementById("myseries2").remove();
    } 

    if (document.contains(document.getElementById("myseries3"))){
        document.getElementById("myseries3").remove();
    } 

    //update values
    speed = +document.getElementById("speed").value;
    betainc = +document.getElementById("betainc").value;
    incline = +document.getElementById("incline").value;


    getData(speed, betainc, incline); 

    var myaxis = getvals();

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([myaxis.xdom.min, myaxis.xdom.max]);

    var y = d3.scaleLinear()
        .range([1.2*height, 0])
        .domain([myaxis.ydom.min, myaxis.ydom.max]); 

    var y2 = d3.scaleLinear()
        .range([height/2, 0])
        .domain([0, tmax*incline]); 

    var y3 = d3.scaleLinear()
        .range([height/2, 0])
        .domain([-betainc, betainc]); 

    var svg2 = d3.select("#stiempo").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", 1.2*height + margin.top + margin.bottom)
        .attr("id","myseries")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var svg3 = d3.select("#stiempo2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height/2 + margin.top + margin.bottom)
        .attr("id","myseries2")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var svg4 = d3.select("#stiempo3").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height/2 + margin.top + margin.bottom)
            .attr("id","myseries3")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var series = d3.line()
        .x(function(d) {
            return x(d.x);
        })
        .y(function(d) {
            return y(d.y);
        });  

    var trend = d3.line()
        .x(function(d) {
            return x(d.x);
        })
        .y(function(d) {
            return y2(d.tr);
        });  

    var season = d3.line()
        .x(function(d) {
            return x(d.x);
        })
        .y(function(d) {
            return y3(d.s);
        }); 

    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 1.2*height + ")")
        .call(d3.axisBottom(x));  

    svg2.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));
        
    svg2.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("id","real")
        .attr("stroke-width", 4)
        .attr("d", series);

     svg3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height/2 + ")")
        .call(d3.axisBottom(x));  

    svg3.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y2));
        
    svg3.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("id","trend")
        .attr("stroke-width", 4)
        .attr("d", trend);

    svg4.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height/2 + ")")
        .call(d3.axisBottom(x));  

    svg4.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y3));
        
    svg4.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("id","season")
        .attr("stroke-width", 4)
        .attr("d", season);    

}




function getData(speed, betainc, incline) {

    //Create data vectior
    data = [];

    //Create vector of points to plot
    points = linspace(0, tmax, npoints);

    // loop to populate data array with 
    // probabily - quantile pairs
    for (var i = 0; i < npoints; i++) {
        var t = points[i];
        var y = tseries(t, speed, betainc, incline);
        
        el = {
            "x": t,
            "y": y.series,
            "s": y.seasonal,
            "tr": y.linear
        }

        data.push(el);
    };



}


function tseries(x, speed, betainc, incline) {
	var linearcomponent = incline*x;
    var seasonalcomponent = betainc*Math.sin(speed*x);

    return {linear: linearcomponent, 
        seasonal: seasonalcomponent, 
        series: linearcomponent + seasonalcomponent};
};

//From github
//https://gist.github.com/joates/6584908
function linspace(a,b,n) {

    if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);

    if(n<2) { return n===1?[a]:[]; }

    var i,ret = Array(n);

    n--;

    for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }

    return ret;

}
