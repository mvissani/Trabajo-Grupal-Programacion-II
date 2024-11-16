from flask import Flask, request #framework para poder usar mi servidor, asi funcionan las rutas que creamos
from flask_cors import CORS #extension del flask. sirve para que el navegador no bloquee las solicitudes al servidor. es por seguridad.
#el navegador bloque solicitudes entre el front y el back de origenes diferentes, entonces cors permite que funcione y no se bloquee. PARA QUE FLASK ACEPTE SOLICITUDES EXTERNAS
import requests  #requests: Es una librería de Python que facilita el hacer solicitudes HTTP 
#(como GET, POST, etc.). En este contexto, se utiliza para realizar solicitudes a APIs externas desde tu servidor Flask.
from datetime import datetime, timedelta
#datetime se utiliza para trabajar en formato estandar (de fecha y tiempo) de python; timedelta es para manipular tiempo
#en este caso se usa para agregar un dia
from index import Moneda, Tipo, Cotizacion
import json;

app = Flask(__name__) #inicializa mi app web, mi servidor
CORS(app) #Habilita CORS,estás configurando tu servidor para que acepte solicitudes de cualquier origen

@app.route("/mis-cotizaciones", methods=["GET"]) 
def get_cotizaciones():
   
    response = requests.get("https://dolarapi.com/v1/cotizaciones")
    
    data = response.json()
    
    tipos = []
    
    for c in data:
        tipo = Tipo(c['casa'], c['nombre'])
        cotizacion = Cotizacion(c['fechaActualizacion'], c['compra'], c['venta'])
        tipo.cargar_cotizacion(cotizacion)
        tipos.append(tipo)
        
    tipos_dict = [tipo.to_dict() for tipo in tipos]
    
    print(tipos_dict)
    
    return json.dumps(tipos_dict), 200

  
    
#/mi-historico?tipo=oficial&fecha_desde=2024-11-10&fecha_hasta=2024-11-10

@app.route("/mi-historico", methods=["GET"]) 
def get_historico():
    tipo_dolar = request.args.get('tipo')
    str_fecha_desde = request.args.get('fecha_desde')
    str_fecha_hasta = request.args.get('fecha_hasta')
    
    # se tiene que iterar dia a dia desde fecha_desde hasta fecha_hasta 
    # para cada iteracion se debe ir a buscar la cotizacion de ese tipo de dolar "casa" para una fecha "fecha" y se debe guardar en un array
    # una vez terminado de iterar se tiene un array con las cotizacones de todas las fechas y es lo que se debe devolver.  
    
    fecha_desde = datetime.strptime(str_fecha_desde, "%Y-%m-%d")
    fecha_hasta = datetime.strptime(str_fecha_hasta, "%Y-%m-%d")
    
    fecha = fecha_desde
    
    tipo = Tipo(tipo_dolar, "Dólar")
    while fecha <= fecha_hasta:
        str_fecha = fecha.strftime("%Y/%m/%d")
        response = requests.get(f"https://api.argentinadatos.com/v1/cotizaciones/dolares/{tipo_dolar}/{str_fecha}")
        c = response.json() # Formato de argentinadatos
        cotizacion = Cotizacion(c["fecha"], c["compra"], c["venta"]) # Convierto a type Cotizacion
        tipo.cargar_cotizacion(cotizacion) # Cargo la cotizacion que generé en el Tipo
        fecha += timedelta(days=1) 
    
    return json.dumps(tipo.to_dict()), 200
    
app.run(debug=True)

