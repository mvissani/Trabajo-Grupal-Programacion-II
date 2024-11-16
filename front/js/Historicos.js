emailjs.init("EoLKxlYYQCCZ-ON8B");

tipoConCotizaciones = null

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

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

   
  const formattedDate = yesterday.toISOString().split('T')[0];

   
  document.getElementById('fecha-desde').setAttribute('max', formattedDate);
  document.getElementById('fecha-hasta').setAttribute('max', formattedDate);

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
        event.preventDefault();  // 
        enviarCotizaciones(event); 
    });
}

function enviarCotizaciones(event) {
    event.preventDefault(); 

    
    const fromEmail = document.getElementById('from_email_1').value;
    console.log(fromEmail);  

    let cotizaciones = []
    tipoConCotizaciones.cotizaciones.forEach(cotizacion => {
        cotizaciones.push({fecha: cotizacion.fecha, compra: cotizacion.compra, venta: cotizacion.venta})
    })

    
    emailjs.send('service_gmail_1', 'template_formulario', { 
        to_email: fromEmail,  
        cotizaciones: JSON.stringify(cotizaciones)  
    }).then(function(response) {
        console.log('SUCCESS!', response);
        alert('Cotizaciones enviadas exitosamente!');
    }, function(error) {
        console.log('FAILED...', error);
        alert('Hubo un error al enviar las cotizaciones.');
    });

    
}

function armaGrafico(data){
    xValues.length = 0; 
    yValues.length = 0; 

   
    data.cotizaciones.forEach(cotizacion => { 
        xValues.push(cotizacion.actualizacion);
        yValues.push(cotizacion.valor_venta);  
    });

    chart.data.labels = xValues;
    chart.data.datasets[0].data = yValues; 

    chart.update(); 
}

function limpiarTabla() {
    const tabla = document.getElementById("tabla-valores").getElementsByTagName("tbody")[0];
    while (tabla.rows.length > 0) {
        tabla.deleteRow(0);  
    }
}

function armarFila(fecha, compra, venta){
    const tabla = document.getElementById("tabla-valores").getElementsByTagName("tbody")[0];
    
    
    const nuevaFila = document.createElement('tr');
    nuevaFila.classList.add('fila-dolar');  

    
    const celda1 = document.createElement('td');
    celda1.classList.add('fecha'); 
    celda1.innerText=fecha
    

   
    const celda2 = document.createElement('td');
    celda2.classList.add('precio-compra'); 
    celda2.innerText= "$" + compra
   

    
    const celda3 = document.createElement('td');
    celda3.classList.add('precio-venta');  
    celda3.innerText="$" + venta
    

    
    nuevaFila.appendChild(celda1);
    nuevaFila.appendChild(celda2);
    nuevaFila.appendChild(celda3);

    
    tabla.appendChild(nuevaFila);
    
}



function obtenerDatosForm(event) {
    event.preventDefault();
    

    
    var selectElement = document.getElementById("tipo-dolar");
    var selectedValueTipoDolar = selectElement.value;  
  

    var fechaDesdeInput = document.getElementById("fecha-desde");
    var fechaHastaInput = document.getElementById("fecha-hasta");
    var fechaDesde = fechaDesdeInput.value;
    var fechaHasta = fechaHastaInput.value;
  
     
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
            tipoConCotizaciones = data;
            return data;
        })
        .then(data => {
            armarTabla(data);
            armaGrafico(data);
        })
      } else {
        
        alert("Por favor, selecciona ambas fechas.");
      }
  };

  function armarTabla(data) {
    limpiarTabla();
    for (i=0; i<data.cotizaciones.length; i++) {
        armarFila(data.cotizaciones[i].actualizacion, data.cotizaciones[i].valor_compra, data.cotizaciones[i].valor_venta)
    }
  }

