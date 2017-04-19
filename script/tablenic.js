//Update simulations on change of parameters
var sdefault = 25;
document.getElementById("nic").onchange = function(){
    var nval = document.getElementById("nic").value;
    if (nval > 338650){
        document.getElementById("nic").value = 338650;
        creamuestra(338650)
    } else if (nval < 2){
        document.getElementById("nic").value = 2;
        creamuestra(2);
    } else {
        creamuestra(nval);
    }
    
}


//Crear tabla
function creamuestra(n){
     //Delete previous table
  if (document.contains(document.getElementById("table2"))) {
             document.getElementById("table2").remove();
  } 
    
//Create table  
    var table = document.createElement("TABLE");
        table.setAttribute("id", "table2");
        document.getElementById("tablenic").appendChild(table);

//Table header
    var tr  = document.createElement('tr');   
    var td1 = document.createElement('th');
    var td2 = document.createElement('th');
    var td3 = document.createElement('th');

    var text1 = document.createTextNode('Media');
    var text2 = document.createTextNode('Intervalo de confianza');
    var text3 = document.createTextNode('¿Funciona?');

    td1.appendChild(text1);
    td2.appendChild(text2);
    td3.appendChild(text3);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    table.appendChild(tr);

    tr = document.createElement('tr');   

    td1 = document.createElement('td');
    td2 = document.createElement('td');
    td3 = document.createElement('td');

    var sims = getsim(n);

    text1 = document.createTextNode(sims.mean);
    text2 = document.createTextNode("(" + sims.ic[0] + " , " + sims.ic[1] + ")");
    text3 = document.createTextNode(sims.htest);

    td1.appendChild(text1);
    td2.appendChild(text2);
    td3.appendChild(text3);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    table.appendChild(tr);
    
}

function getsim(n){

    var meanval = 0;
    if (n < 338650){
        for (var i = 0; i < n; i++){
            meanval += d3.randomNormal(36.01,1)()/n;
        }
    } else {
        meanval = 36.01;
    }


    var icval1 = meanval - 1.96*Math.sqrt(1/n);
    var icval2 = meanval + 1.96*Math.sqrt(1/n);

    var test = "No";
    if (icval1 > 36){
        test = "Sí";
    }

    var simresult = {
            mean: Math.round(meanval*1000)/1000, 
            ic: [Math.round(icval1*1000)/1000, Math.round(icval2*1000)/1000],
            htest: test};

    return simresult;
}