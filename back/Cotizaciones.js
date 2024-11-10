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
    
    .then(response => response.json())
    
    .then(data => {
      for (i=0; i<data.length; i++) {
        agregarCotizacion(data[i].nombre, data[i].compra, data[i].venta)
      }
    })
    .then(borrarCotizacionVacia);
  

    // (function() {
    //         // https://dashboard.emailjs.com/admin/account
    //         emailjs.init({
    //           publicKey: "YOUR_PUBLIC_KEY",
    //         });
    //     })();

        // window.onload = function() {
        //     document.getElementById('contact-form').addEventListener('submit', function(event) {
        //         event.preventDefault();
        //         // these IDs from the previous steps
        //         emailjs.sendForm('contact_service', 'contact_form', this)
        //             .then(() => {
        //                 console.log('SUCCESS!');
        //             }, (error) => {
        //                 console.log('FAILED...', error);
        //             });
        //     });
        // }
