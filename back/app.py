from flask import Flask, request #framework para poder usar mi servidor, asi funcionan las rutas que creamos
from flask_cors import CORS #extension del flask. sirve para que el navegador no bloquee las solicitudes al servidor. es por seguridad.
#el navegador bloque solicitudes entre el front y el back de origenes diferentes, entonces cors permite que funcione y no se bloquee. PARA QUE FLASK ACEPTE SOLICITUDES EXTERNAS
import requests  #requests: Es una librería de Python que facilita el hacer solicitudes HTTP 
#(como GET, POST, etc.). En este contexto, se utiliza para realizar solicitudes a APIs externas desde tu servidor Flask.
from datetime import datetime, timedelta
#datetime se utiliza para trabajar en formato estandar (de fecha y tiempo) de python; timedelta es para manipular tiempo
#en este caso se usa para agregar un dia
from index import Tipo, Cotizacion
from send_email import send_email
import json;

app = Flask(__name__) #inicializa mi app web, mi servidor
CORS(app) #Habilita CORS,estás configurando tu servidor para que acepte solicitudes de cualquier origen

@app.route("/mis-cotizaciones", methods=["GET"]) 
def get_cotizaciones():
   
    response = requests.get("https://dolarapi.com/v1/cotizaciones")
    
    data = response.json()
    
    tipos = []
    
    for cotiz in data:
        tipo = Tipo(cotiz['casa'], cotiz['nombre']) #instanciando una clase --> es decir con Tipo() estas creando un objeto de clase Tipo en este caso
        cotizacion = Cotizacion(cotiz['fechaActualizacion'], cotiz['compra'], cotiz['venta'])#lo mismo aca, crea un objeto de clase cotizacion
        # si miramos index.py en el constructor de cotizacion vemos que se pasan los mismos parametros fechaAct, compra, venta.. 
        tipo.cargar_cotizacion(cotizacion)#para el objeto tipo: uso el metodo cargar_cotizacion, y le paso el objeto cotizacion que esta arriba  
        tipos.append(tipo)#se le agrega un "tipo" al array tipos que estaba creado vacio arriba
        
    tipos_dict = [tipo.to_dict() for tipo in tipos] # creo tipos_dict porque necesito pasar el objeto tipo a diccionario tipo
    # (porque si no no se puede pasar de objeto a json en python)
    
    print(tipos_dict)
    
    return json.dumps(tipos_dict), 200 #json.dumps() es una función de la biblioteca estándar json de Python que convierte un objeto Python 
    #(en este caso, un diccionario llamado tipos_dict) en una cadena de texto con formato JSON.

  
    
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
    
    tipo = Tipo(tipo_dolar, "Dólar")#la clase tipo tiene tipo y moneda.. dolar es moneda
    
    while fecha <= fecha_hasta:
        str_fecha = fecha.strftime("%Y/%m/%d")
        response = requests.get(f"https://api.argentinadatos.com/v1/cotizaciones/dolares/{tipo_dolar}/{str_fecha}")
        c = response.json() # Formato de argentinadatos
        cotizacion = Cotizacion(c["fecha"], c["compra"], c["venta"]) # Instanciamos la clase cotizacion y creo un objeto tipo cotizacion
        tipo.cargar_cotizacion(cotizacion) # Cargo la cotizacion que generé en el Tipo
        fecha += timedelta(days=1) # Agrego un dia a fecha para iterar el siguiente 
    
    return json.dumps(tipo.to_dict()), 200


# {
#     "to_email": "francomoralespinas@gmail.com",
#     "cotizaciones": [
#         {
#             "fecha": "sarasa",
#             "compra": 1001,
#             "venta": 1010
#         }
#     ]
# }

@app.route("/mi-historico/email", methods=["POST"])
def send_email_historico():
    json_body = request.get_json()
    to_email = json_body['to_email']
    cotizaciones = json_body['cotizaciones']
    
    template = {
        "to_email": to_email,
        "cotizaciones": json.dumps(cotizaciones)
    }
    
    try:
        send_email('template_historico', template)
        return "Email sent ok", 200
    except Exception as e:
        return e.__str__, 500


# {
#     "from_name": "El Frank",
#     "reply_to": "francomoralespinas@gmail.com",
#     "message": "Hola Comandante, tas re lok?" 
# }

@app.route("/contacto/email", methods=["POST"])
def send_email_contacto():
    json_body = request.get_json()
    from_name = json_body['from_name']
    reply_to = json_body['reply_to']
    message = json_body['message']
    
    template = {
        "from_name": from_name,
        "reply_to": reply_to,
        "message": message
    }
    
    try:
        send_email('template_form_contacto', template)
        return "Email sent ok", 200
    except Exception as e:
        return e.__str__, 500
    
app.run(debug=True)

