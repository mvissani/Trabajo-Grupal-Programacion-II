from flask import Flask, request
from flask_cors import CORS
import requests
from datetime import datetime, timedelta


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

