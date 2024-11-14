emailjs.init("EoLKxlYYQCCZ-ON8B");

arrayDatos = []

var xValues = []
var yValues = []

var chart = new Chart("myChart", {
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
  });;

window.onload = function() {
    enviaMailDelUsuario();
    enviaCotizacionesAlUsuario();
}
    
function enviaMailDelUsuario() {
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();
        emailjs.sendForm('service_gmail_1', 'template_email_1', this)
            .then(() => {console.log('SUCCESS!');
                         alert('El mensaje se envio correctamente!');
                         }, 
                (error) => {console.log('FAILED...', error);
                            alert('Ha ocurrido un error al enviar el mensaje.');
                });
        });

}


function enviaCotizacionesAlUsuario() {
    document.getElementById('contact-form1').addEventListener('submit', function(event) {
        event.preventDefault();  // Evitamos el envío tradicional del formulario
        enviarCotizaciones(event);  // Llamamos a la función que maneja el envío del correo
    });
}

function enviarCotizaciones(event) {
    event.preventDefault();  // Evitamos el envío tradicional del formulario

    // Obtenemos el correo que el usuario ingresó en el formulario
    const fromEmail = document.getElementById('from_email_1').value;
    console.log(fromEmail);  // Verificamos que estamos obteniendo el correo correctamente

    let cotizaciones = []
    arrayDatos.forEach(cotizacion => {
        cotizaciones.push({fecha: cotizacion.fecha, compra: cotizacion.compra, venta: cotizacion.venta})
    })

    // Enviamos el correo con la información de las cotizaciones
    emailjs.send('service_gmail_1', 'template_formulario', { 
        to_email: fromEmail,  // Enviamos el correo del usuario
        cotizaciones: JSON.stringify(cotizaciones)  // Enviamos las cotizaciones como una cadena JSON
    }).then(function(response) {
        console.log('SUCCESS!', response);
        alert('Cotizaciones enviadas exitosamente!');
    }, function(error) {
        console.log('FAILED...', error);
        alert('Hubo un error al enviar las cotizaciones.');
    });

    
}

function armaGrafico(data){
    xValues.length = 0; // Limpiar el array xValues
    yValues.length = 0; // Limpiar el array yValues

    // Iterar sobre las cotizaciones y extraer las fechas y los valores de venta
    data.forEach(cotizacion => { //Iteramos data, que es lo que devolvió el backend
        xValues.push(cotizacion.fecha);
        yValues.push(cotizacion.venta);  // O si quieres el valor de compra: cotizacion.compra
    });

    chart.data.labels = xValues; // Nuevos valores para el eje X
    chart.data.datasets[0].data = yValues; // Nuevos valores para el eje Y

    chart.update(); //Es un metodo del objeto chart que sirve para actualizar el gráfico segun sus datos
}

function limpiarTabla() {
    const tabla = document.getElementById("tabla-valores").getElementsByTagName("tbody")[0];
    while (tabla.rows.length > 0) {
        tabla.deleteRow(0);  // Elimina la primera fila (repite hasta que no haya más filas)
    }
}

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
    celda2.innerText= "$" + compra
   

    // Crear la tercera celda (td) con clase "precio-venta" y contenido "$"
    const celda3 = document.createElement('td');
    celda3.classList.add('precio-venta');  // Asignar la clase "precio-venta" a la celda
    celda3.innerText="$" + venta
    

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
            console.log(data);
            arrayDatos = data;
            return data;
        })
        .then(data => {
            armarTabla(data);
            armaGrafico(data);
        })
      } else {
        // Si alguna de las fechas no está seleccionada, mostramos un mensaje
        alert("Por favor, selecciona ambas fechas.");
      }
  };

  function armarTabla(data) {
    limpiarTabla();
    for (i=0; i<data.length; i++) {
        armarFila(data[i].fecha, data[i].compra, data[i].venta)
    }
  }

