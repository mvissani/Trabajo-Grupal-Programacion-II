let monedas = document.getElementsByClassName("valores")[0];

function agregarHistorico(nombre, venta, compra) {
    var historico = document.getElementsByClassName("tabla-valores")[0].cloneNode(true)
    historico.querySelector(".nombre-dolar").innerHTML= nombre
    historico.querySelector(".historico-compra").innerHTML= compra
    historico.querySelector(".historico-venta").innerHTML= venta
    monedas.appendChild(historico)
};

(function() {
        emailjs.init("cVWZJPSvMYbM0Hwlg");
    })();


window.onload = function() {
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();
        emailjs.sendForm('service_3gfwajh', 'template_rut4dgr', this)
            .then(() => {
                console.log('SUCCESS!');
            }, (error) => {
                console.log('FAILED...', error);
            });
        });
    }

    const xValues = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    const yValues = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15];

    new Chart("myChart", {
      type: "line",  
      data: {
        labels: xValues,  
        datasets: [{
          label: "Evolucion del dolar en pesos argentinos",  
          backgroundColor: "rgba(0,0,255,0.1)",  
          borderColor: "rgba(0,0,255,1.0)",  
          borderWidth: 2,  
          data: yValues,  
          fill: true  
        }]
      },
      options: {
        responsive: true,  
        maintainAspectRatio: false,  
        scales: {
          x: {
            beginAtZero: true,  
            title: {
              display: true,
              text: 'Eje X (Valores)',  
              color: '#333'  
            }
          },
          y: {
            beginAtZero: true,  
            title: {
              display: true,
              text: 'Eje Y (Valores)',  
              color: '#333'  
            },
            ticks: {
              stepSize: 1  
            }
          }
        },
        plugins: {
          legend: {
            display: true,  
            position: 'top'  
          },
          tooltip: {
            enabled: true,  
            backgroundColor: 'rgba(0,0,0,0.7)',  
            titleColor: '#fff',  
            bodyColor: '#fff'  
          }
        }
      }
    });


function armarFila(fecha, compra, venta){


    const tabla = document.getElementById("tabla-valores").getElementsByTagName("tbody")[0];
    
    // Crear una nueva fila (tr) con la clase "fila-dolar"
    const nuevaFila = document.createElement('tr');
    nuevaFila.classList.add('fila-dolar');  // Asignar la clase "fila-dolar" a la fila

    // Crear la primera celda (td) con clase "fecha" y contenido "B1"
    const celda1 = document.createElement('td');
    celda1.classList.add('fecha');  // Asignar la clase "fecha" a la celda
   
     celda1.innerText=fecha
    

    // Crear la segunda celda (td) con clase "precio-compra" y contenido "$"
    const celda2 = document.createElement('td');
    celda2.classList.add('precio-compra');  // Asignar la clase "precio-compra" a la celda
    celda2.innerText=compra
   

    // Crear la tercera celda (td) con clase "precio-venta" y contenido "$"
    const celda3 = document.createElement('td');
    celda3.classList.add('precio-venta');  // Asignar la clase "precio-venta" a la celda
    celda3.innerText=venta
    

    // Agregar las celdas a la fila
    nuevaFila.appendChild(celda1);
    nuevaFila.appendChild(celda2);
    nuevaFila.appendChild(celda3);

    // Agregar la fila al cuerpo de la tabla (tbody)
    tabla.appendChild(nuevaFila);
    
}



function obtenerDatosForm(event) {
    event.preventDefault();
    
    // Función que se ejecuta cuando el usuario cambia la selección
    var selectElement = document.getElementById("tipo-dolar");
    var selectedValueTipoDolar = selectElement.value;  // El valor de la opción seleccionada
  

    var fechaDesdeInput = document.getElementById("fecha-desde");
    var fechaHastaInput = document.getElementById("fecha-hasta");
    var fechaDesde = fechaDesdeInput.value;
    var fechaHasta = fechaHastaInput.value;
  
      // Comprobamos si las fechas están vacías
      if (fechaDesde && fechaHasta) {
       
        console.log(fechaDesde)
        console.log(fechaHasta)
        fetch(`http://localhost:5000/mi-historico?tipo=${selectedValueTipoDolar}&fecha_desde=${fechaDesde}&fecha_hasta=${fechaHasta}`)
       
        .then(response => {
            if (!response) {
            throw new Error("No se pudieron obtener las cotizaciones")
            }
            return response.json()
            
        })
            
        .then(data => {
            console.log(data)

             for (i=0; i<data.length; i++) {
              armarFila(data[i].fecha, data[i].compra, data[i].venta)
            }

        })
      } else {
        // Si alguna de las fechas no está seleccionada, mostramos un mensaje
        alert("Por favor, selecciona ambas fechas.");
      }
  };

