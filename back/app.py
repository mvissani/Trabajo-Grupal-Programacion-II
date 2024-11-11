from flask import Flask, request
from flask_cors import CORS
import requests
from datetime import datetime, timedelta

class Moneda:
    def __init__(self, nombre):
        self.cargar_nombre(nombre)
    def cargar_nombre(self, nombre):
        self.nombre = nombre
    def mostrar_nombre(self):
        return self.nombre

class Tipo(Moneda):
    def __init__(self, tipo, moneda):
        self.cargar_tipo(tipo)
        Moneda.cargar_nombre(self, moneda)
        self.cotizaciones = []
    # def __init__(self):
    #     pass
    def cargar_tipo(self, tipo):
        self.tipo = tipo
    def mostrar_tipo(self):
        return self.tipo
    def __str__(self):
        return f'La moneda es {self.nombre}, tipo {self.tipo}. La cotizacion es: compra {self.cotizaciones[0].valor_compra}, venta {self.cotizaciones[0].valor_venta}, actualizacion {self.cotizaciones[0].actualizacion}'
    def cargar_cotizacion(self, cotizacion):
        self.cotizaciones.append(cotizacion)
    
class Cotizacion():
    def __init__(self, actualizacion, valor_compra, valor_venta):
        self.cargar_act(actualizacion)
        self.cargar_venta(valor_venta)
        self.cargar_compra(valor_compra)
    def cargar_act(self, actualizacion):
        self.actualizacion = actualizacion
    def mostrar_act(self):
        return self.actualizacion
    def cargar_venta(self, valor_venta):
        self.valor_venta = valor_venta
    def mostrar_venta(self):
        return self.valor_venta
    def cargar_compra(self, valor_compra):
        self.valor_compra = valor_compra
    def mostrar_compra(self):
        return self.valor_compra
    def __str__(self):
        return f'La cotizacion es: compra {self.valor_compra}, venta {self.valor_venta}, actualizacion {self.actualizacion}'

app = Flask(__name__)
CORS(app)

@app.route("/mis-cotizaciones", methods=["GET"]) 
def get_cotizaciones():
   
    response = requests.get("https://dolarapi.com/v1/cotizaciones")
    
    return response.json(), 200

    #return jsonify({"moneda": "datosdelamoneda"}), 200
    #return jsonify({"error": "Moneda no encontrada"}), 404
    
#/mi-historico?tipo=oficial&fecha_desde=2024-11-10&fecha_hasta=2024-11-10
@app.route("/mi-historico", methods=["GET"]) 
def get_historico():
    tipo = request.args.get('tipo')
    str_fecha_desde = request.args.get('fecha_desde')
    str_fecha_hasta = request.args.get('fecha_hasta')
    
    # se tiene que iterar dia a dia desde fecha_desde hasta fecha_hasta 
    # para cada iteracion se debe ir a buscar la cotizacion de ese tipo de dolar "casa" para una fecha "fecha" y se debe guardar en un array
    # una vez terminado de iterar se tiene un array con las cotizacones de todas las fechas y es lo que se debe devolver.  
    
    fecha_desde = datetime.strptime(str_fecha_desde, "%Y-%m-%d")
    fecha_hasta = datetime.strptime(str_fecha_hasta, "%Y-%m-%d")
    
    current_date = fecha_desde
    
    historico=[]
    while current_date <= fecha_hasta:
        str_current_date = current_date.strftime("%Y/%m/%d")
        response = requests.get(f"https://api.argentinadatos.com/v1/cotizaciones/dolares/{tipo}/{str_current_date}")
        print(response.status_code)
        historico.append(response.json())
        current_date += timedelta(days=1) 
    
    return historico, 200
    
app.run(debug=True)

