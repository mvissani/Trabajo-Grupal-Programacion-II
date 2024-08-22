# Consigna Tp Programacion II

2 partes:
- front: HTML CSS JS
- back: PYTHON

Sitio web con cotizaciones de diferentes monedas.
Front con js se conecta con una api, api creada con python, esa api se conecta con otra para traer las cotizaciones (en tiempo real, como tmb los historicos). 
La api que vamos a hacer en python tiene que poder determinar si el dato que trae de la otra api la tiene que guardar en un cache local. Lo guarda en un archivo SQLite, que es como una base de datos (no levanta un servidor desde 0, si no que solo es un archivo que lo vamos a tener dentro del proyecto).

[Api a consultar (link)](dolarapi.com)

CUANDO se quiera consultar un dato historico la primera vez lo busca en la Api externa, queda en el local SQLite y de ahi en mas las consultas se hacen en la local. 
La decision de dónde consultar, cuando se consulta la cotizacion actual, la toma la api de python. La primera vez se busca en la api externa, y programamos cada cuanto tiempo la consulta se va a pedir a la api externa... en ese tiempo (que no se pide a la externa, ejemplo 5 minutos) se hace la consulta en la api nuestra de sqlite. 

##### DOCUMENTACION:
Para todo lo que hagamos hay que hacer un documento. 
Hacer un archivo .md (para la documentacion)

El front, back, y documentos tienen que estar en un repositorio, donde los integrantes del Tp puedan hacer cambios. 

Todos los itnegrantes deben aportar al desarrollo del tp, debe haber COMMIT de todos los integrantes mas o menos en igual porcentaje. 

- Insomnia, postman para armar las llamadas a la Api (para probar el back end)

(Para la Api guardar todos los endpoints y exportar a un documento que subimos al github.. ?)

##### REPOSITORIO:
Estructura:
..Readme (o el nombre que se quiera poner al archivo de texto con la documentacion),  .md, y junto con ese archivo 2 carpeta (front y back):
- Front HTML; CSS; JS; Carpeta con imagenes
- Back: base de datos; codigo de python 

##### RECOMENDACION: 
a medida que vayamos trabajando, ir haciendo los commit o push al repositorio

##### FORMATO:
Requerimientos funcionales: lo que tiene que hacer
- Pantalla principal con todas las cotizaciones ACTUALES
- Grafica con la evolucion de una moneda (a elegir) con una tabla (tiempo a definir)
- En la pantalla que se este viendo indicar si los datos estan actualizados o no. Puede ser un texto, fecha y hora, icono... etc. Mostrar si los datos son de la api o en forma local en la base de datos que hicimos (api interna)
- Tiene que haber una opcion para mandar los datos que estamos viendo por mail. Mediante  un boton donde ingresamos el mail y apretamos enviar. Con JS vamos a hacer que se envie por mail lo que quiera el usuaria (lo que este en la pantalla: una cotizacion, una tabla, etc)
- Para cambiar de pantalla tiene que haber un menu, (puede estar arriba izq derecha, flotante, etc) en el mismo se debe poder identificar en qué pagina estoy parado, si estoy en la home tiene que tener un color diferente, o algo... Si estoy en cotizacion historica resaltar esta parte y la home vuelve a la normalidad. 
- En todas las paginas al pie: nombre de los integrantes, de la materia, de la carrera, y de la utn. Hacer referencia que los datos consultados son buscados en la API externa 
##### Requerimientos no funcionales del sitio web:
- Debe ser responsivo
- No debe tener usuario ni contraseñas
- Cada vez que haga algo el sitio web debe durar menos de 0.5s 
(se mide cuando agreguemos JS)


