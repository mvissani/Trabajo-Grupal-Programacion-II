import requests

response = requests.get("https://dolarapi.com/v1/dolares")


if response.status_code == 200:
    data = response.json()

    print(f"-"*80)
    print(f"MONEDA: \tNOMBRE: \tCOMPRA: \tVENTA: \t")
    print(f"-"*80)

    for tipo_cambio in data:
        moneda = tipo_cambio.get("moneda")
        casa = tipo_cambio.get("casa")
        compra = tipo_cambio.get("compra")
        venta = tipo_cambio.get("venta")
        fecha_actualizacion = tipo_cambio.get("fechaActualizacion")
        print(f"{moneda:}\t\t{casa:.6}\t\t{compra}\t\t{venta}\t\n")

    print(f"-"*80)

else:
    print(f"Error: {response.status_code}")    

