// VALORES DE LAS COTIZACIONES

let monedas = document.getElementsByClassName("big-container")[0];

function agregarCotizacion(nombre, compra, venta) {
  var cotizacion = document.getElementsByClassName("small-container")[0].cloneNode(true)
  cotizacion.querySelector(".nombre-moneda").innerHTML= nombre
  cotizacion.querySelector(".precio-compra").innerHTML= "$" + compra
  cotizacion.querySelector(".precio-venta").innerHTML= "$" + venta
  monedas.appendChild(cotizacion)
};
  
function borrarCotizacionVacia() {
  let cotizacionVacia = document.getElementsByClassName("small-container")[0];
  monedas.removeChild(cotizacionVacia);
} 
  
fetch("http://localhost:5000/mis-cotizaciones")
  
  .then(response => {
    if (!response) {
      throw new Error("No se pudieron obtener las cotizaciones")
    }
    return response.json()
  })
    
  .then(data => {
    for (i=0; i<data.length; i++) {
      agregarCotizacion(data[i].nombre, data[i].compra, data[i].venta)
    }
  })
    
  .then(borrarCotizacionVacia)
    
  .catch(error => {console.log("Error, no se pudo obtener la cotizacion solicitada")});
  

  