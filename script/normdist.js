//Adapted from http://bl.ocks.org/phil-pedruco/88cb8a51cdce45f13c7e

//setting up empty data array
var data, points1, points2;
var mu = 0;
var sigma = 1;
var muprior = -5;
var sigmaprior = 1;
var npoints = 1000;
var nsize = 10;

function getvals(){
    var xdom = {
        min: Math.min(mu - 3.5*sigma, muprior - 3.5*sigmaprior),
        max: Math.max(mu + 3.5*sigma, muprior + 3.5*sigmaprior)
    };

    var ydom = {
        min: 0,
        max: Math.max(gaussian(mu, mu, sigma),gaussian(muprior, muprior, sigmaprior))
    };

    return {xdom: xdom, ydom: ydom}
}

document.body.onload = function(){
    document.getElementById("mu").value = mu;
    document.getElementById("sigma").value = sigma;
    document.getElementById("m").value = muprior;
    document.getElementById("c").value = sigmaprior; 
    document.getElementById("nsize").value = nsize;

    addpath(); 
}

document.getElementById("sim").onclick = function(){

    mu      = +document.getElementById("mu").value;
    sigma   = +document.getElementById("sigma").value;
    muprior = +document.getElementById("m").value;
    sigmaprior = +document.getElementById("c").value;
    nsize   = +document.getElementById("nsize").value;

    addpath()
}



function addpath (){

    if (document.contains(document.getElementById("mygaussian"))){
        document.getElementById("mygaussian").remove();
    } 

    getData(mu, sigma, muprior, sigmaprior, nsize); 

    var myaxis = getvals();

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([myaxis.xdom.max, myaxis.xdom.min]);

    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([myaxis.ydom.min, myaxis.ydom.max]); //need to change this

    var svg2 = d3.select("#dgauss").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id","mygaussian")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var linereal = d3.line()
        .x(function(d) {
            return x(d.x1);
        })
        .y(function(d) {
            return y(d.y1);
        });

    var lineprior = d3.line()
        .x(function(d) {
            return x(d.x2);
        })
        .y(function(d) {
            return y(d.y2);
        });  

    var lineposterior = d3.line()
        .x(function(d) {
            return x(d.x3);
        })
        .y(function(d) {
            return y(d.y3);
        });    

    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));  

    svg2.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));
        
    svg2.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("id","real")
        .attr("stroke-width", 4)
        .attr("d", linereal);

    svg2.append("path")
        .datum(data)
        .attr("class", "line2")
        .attr("id","prior")
        .attr("stroke-width", 4)
        .attr("d", lineprior);

    svg2.append("path")
        .datum(data)
        .attr("class", "line3")
        .attr("id","posterior")
        .attr("stroke-width", 4)
        .attr("d", lineposterior);

}




function getData(mu, sigma, muprior, sigmaprior, nsize) {

    //Create data vectior
    data = [];

    //Compute mean from random sample
    var meanrd = 0;
    for (var i = 0; i < nsize; i++){
        meanrd += d3.randomNormal(mu, sigma)()/nsize;
    }

    var alpha = nsize/Math.pow(sigma,2);
    alpha = alpha / (alpha + 1/Math.pow(sigmaprior,2));

    var muposterior = alpha*meanrd + (1 - alpha)*muprior;
    var sigmaposterior = sigma;

    //Create vector of points to plot
    points1 = linspace(mu - 3.5*sigma, mu + 3.5*sigma, npoints);
    points2 = linspace(muprior - 3.5*sigmaprior, muprior + 3.5*sigmaprior, npoints);
    points3 = linspace(muposterior - 3.5*sigmaposterior, muposterior + 3.5*sigmaposterior, npoints);
    
    // loop to populate data array with 
    // probabily - quantile pairs
    for (var i = 0; i < npoints; i++) {
        x1 = points1[i];
        x2 = points2[i];
        x3 = points3[i];
        y1 = gaussian(x1, mu, sigma);
        y2 = gaussian(x2, muprior, sigmaprior);
        y3 = gaussian(x3, muposterior, sigmaposterior);
        el = {
            "x1": x1,
            "y1": y1,
            "x2": x2,
            "y2": y2,
            "x3": x3,
            "y3": y3
        }
        data.push(el);
    };

    // need to sort for plotting
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    data.sort(function(x, y) {
        return x.x1 - y.x1;
    });


}

//taken from Jason Davies science library
// https://github.com/jasondavies/science.js/
function gaussian(x, mean, sigma) {
	var gaussianConstant = 1 / Math.sqrt(2 * Math.PI);

    x = (x - mean) / sigma;
    return gaussianConstant * Math.exp(-.5 * x * x) / sigma;
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
