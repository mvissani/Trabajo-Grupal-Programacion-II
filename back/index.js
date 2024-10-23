function agregarCotizacion(nombre, venta, compra) {
  var x = document.getElementsByClassName("small-container")[0].cloneNode(true)
  x.querySelector(".nombre-moneda").innerHTML= nombre
  x.querySelector(".precio-venta").innerHTML= venta
  x.querySelector(".precio-compra").innerHTML= compra
  monedas.appendChild(x)
};

function borrarCotizacionVacia() {
  let cotizacionVacia = document.getElementsByClassName("small-container")[0];
  monedas.removeChild(cotizacionVacia);
} 

let monedas = document.getElementsByClassName("big-container")[0];

fetch("https://dolarapi.com/v1/cotizaciones")
  
  .then(response => response.json())
  
  .then(data => {
    for (i=0; i<data.length; i++) {
      agregarCotizacion(data[i].nombre, data[i].venta, data[i].compra)
    }
  })
  .then(borrarCotizacionVacia);

