//Update simulations on change of parameters
var nsample = 37;
var pinit   = 0.63;
var nsim    = 1000;

document.getElementById("size").onchange = function(){
    
    var nval = document.getElementById("size").value;
    var pval = document.getElementById("penf").value;

    if (nval > 50){
        document.getElementById("size").value = 50;
        binomsample(50, pval);
    } else if (nval < 2){
        document.getElementById("size").value = 2;
        binomsample(2, pval);
    } else {
        binomsample(nval, pval);
    }
}

document.getElementById("penf").onchange = function(){
    
    var nval = document.getElementById("size").value;
    var pval = document.getElementById("penf").value;

    if (pval > 1){
        document.getElementById("penf").value = 1;
        binomsample(nval, 1);
    } else if (pval < 0){
        document.getElementById("penf").value = 0;
        binomsample(nval, 0);
    } else {
        binomsample(nval, pval);
    }
}

document.body.onload = function(){

    //Create table bin
    document.getElementById("nbin").value = ndefault;
    creatabla();

    document.getElementById("size").value = nsample;    
    document.getElementById("penf").value = pinit;    
    binomsample(nsample, pinit);

    //Create table of IC
    document.getElementById("nic").value = sdefault;
    creamuestra(sdefault);
}


//Crear tabla
function binomsample(n, p){
  //Delete previous table
  if (document.contains(document.getElementById("table3"))) {
             document.getElementById("table3").remove();
  } 


    
//Create table  
    var table = document.createElement("TABLE");
        table.setAttribute("id", "table3");
        document.getElementById("icfails").appendChild(table);

//Table header
    var tr  = document.createElement('tr');   
    var td1 = document.createElement('th');
    var td2 = document.createElement('th');
    var td3 = document.createElement('th');

    var text1 = document.createTextNode('Simulación');
    var text2 = document.createTextNode('Intervalo de confianza');
    var text3 = document.createTextNode('¿Está el valor real?');

    td1.appendChild(text1);
    td2.appendChild(text2);
    td3.appendChild(text3);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    table.appendChild(tr);
    
    successes = 0;

    for (var i = 0; i < nsim; i++){

        tr = document.createElement('tr');   

        td1 = document.createElement('td');
        td2 = document.createElement('td');
        td3 = document.createElement('td');

        var bsims = getsample(n,p);

        text1 = document.createTextNode(i + 1);
        text2 = document.createTextNode("(" + bsims.ic[0] + " , " + bsims.ic[1] + ")");
        text3 = document.createTextNode(bsims.is);

        successes += bsims.indicator;

        td1.appendChild(text1);
        td2.appendChild(text2);
        td3.appendChild(text3);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        table.appendChild(tr);
    }

    var paragraph = document.getElementById("veces");
    paragraph.innerText = "Contenido por " + (successes/nsim)*100 + "% de las simulaciones";
    
}

function getsample(n,p){

   var binval = 0;
   for (var j = 0; j < n; j++){
       if (Math.random() < p){
           binval += 1;
       }
   }

   var pvar     = binval/n;
   var variance = pvar*(1 - pvar);
   
   var ic1 = pvar - 1.96*Math.sqrt(variance/n);
   var ic2 = pvar + 1.96*Math.sqrt(variance/n);

    var indic = 0;
    var isin  = "No";
    if ( (ic1 < p & ic2 > p) ){
        indic = 1;
        isin  = "Sí";
    }

    var simresult = {
            ic: [Math.round(ic1*1000)/1000, Math.round(ic2*1000)/1000],
            is: isin,
            indicator: indic};


    return simresult;
}