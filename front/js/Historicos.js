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
        let from_name = document.getElementById('from_name').value
        let from_email = document.getElementById('from_email').value
        let message = document.getElementById('message').value
        
        fetch(
          "http://localhost:5000/contacto/email",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "from_name": from_name,
              "reply_to": from_email,
              "message": message
            })
          }
        )
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al enviar el email');
          }
          return response.text();  // O response.json() si esperas una respuesta JSON
        })
        .then(result => {
          console.log('Respuesta del servidor:', result);
          alert('El mensaje se envio correctamente!');
        })
        .catch(error => {
          console.error('Hubo un problema con la solicitud fetch:', error);
          alert('Ha ocurrido un error al enviar el mensaje.');
        });
      });

}


function enviaCotizacionesAlUsuario() {
    document.getElementById('contact-form1').addEventListener('submit', function(event) {
        event.preventDefault();  // 
        enviarCotizaciones(); 
    });
}

function enviarCotizaciones() {
    const fromEmail = document.getElementById('from_email_1').value;
    console.log(fromEmail);  

    let cotizaciones = []
    tipoConCotizaciones.cotizaciones.forEach(cotizacion => {
        cotizaciones.push({fecha: cotizacion.actualizacion, compra: cotizacion.valor_compra, venta: cotizacion.valor_venta})
    })
    
    fetch(
      "http://localhost:5000/mi-historico/email",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "to_email": fromEmail,
          "cotizaciones": cotizaciones
        })
      }
    )
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al enviar el email');
      }
      return response.text();  // O response.json() si esperas una respuesta JSON
    })
    .then(result => {
      console.log('Respuesta del servidor:', result);
      alert('El mensaje se envio correctamente!');
    })
    .catch(error => {
      console.error('Hubo un problema con la solicitud fetch:', error);
      alert('Ha ocurrido un error al enviar el mensaje.');
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

