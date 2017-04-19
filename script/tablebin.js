//Update simulations on change of parameters
var ndefault = 10;
document.getElementById("nbin").onchange = function(){
    creatabla();
}


function patinarle (n, k) {
    var proba = binom(n, k)* Math.pow(0.5, n);
    return proba;
}

//From Rosetta code
function binom(n, k) {
    var coeff = 1;
    for (var i = n-k+1; i <= n; i++) coeff *= i;
    for (var i = 1;     i <= k; i++) coeff /= i;
    return coeff;
}

//Crear tabla
function creatabla(){
     //Delete previous table
  if (document.contains(document.getElementById("myTable"))) {
             document.getElementById("myTable").remove();
  } 
    

    var n = document.getElementById("nbin").value;

//Create table  
    var table = document.createElement("TABLE");
        table.setAttribute("id", "myTable");
        document.getElementById("tablen").appendChild(table);

//Table header
    var tr  = document.createElement('tr');   
    var td1 = document.createElement('th');
    var td2 = document.createElement('th');

    var text1 = document.createTextNode('Número de tiros');
    var text2 = document.createTextNode('Probabilidad de atinarle');

    td1.appendChild(text1);
    td2.appendChild(text2);
    tr.appendChild(td1);
    tr.appendChild(td2);

    table.appendChild(tr);

//Calculate each row
    for (var i = 0; i <= n; i++) {

        tr = document.createElement('tr');   

        td1 = document.createElement('td');
        td2 = document.createElement('td');

        text1 = document.createTextNode(i);
        text2 = document.createTextNode(patinarle(n, i));

        td1.appendChild(text1);
        td2.appendChild(text2);
        tr.appendChild(td1);
        tr.appendChild(td2);

        table.appendChild(tr);
    }
}
