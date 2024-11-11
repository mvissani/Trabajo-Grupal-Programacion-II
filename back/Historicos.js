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


