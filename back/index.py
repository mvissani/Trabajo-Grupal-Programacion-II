
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
        self.cotizaciones.append(cotizacion) #a este objeto (tipo), en el array cotizaciones agregale una"cotizacion" 
    def to_dict(self):
        return {
            "tipo": self.mostrar_tipo(),
            "moneda": self.mostrar_nombre(),
            "cotizaciones": [cotizacion.to_dict() for cotizacion in self.cotizaciones]
        }
    
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
    def to_dict(self):
        return {
            "actualizacion": self.mostrar_act(),
            "valor_compra": self.mostrar_compra(),
            "valor_venta": self.mostrar_venta()
        }

