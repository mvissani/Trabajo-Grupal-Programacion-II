let monedas = document.getElementsByClassName("valores")[0];

fetch("https://api.argentinadatos.com/v1/cotizaciones/dolares")
    .then(response => response.json())
    .then(data => console.log(data));

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