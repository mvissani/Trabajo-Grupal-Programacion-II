import requests
import json                                        

def send_email(template_id, template_params):
    data = {
        'service_id': 'service_gmail_1',
        'template_id': template_id,
        'user_id': 'EoLKxlYYQCCZ-ON8B',
        'accessToken': 'Vr6oa4uS5z0yruinaxQXh',
        'template_params': template_params
    }
    
    # {
    #         'from_name': 'James',
    #         'to_email': 'Seba',
    #         'cotizaciones': 'Este es el mensaje'
    #     }

    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    try:
        response = requests.post(
            'https://api.emailjs.com/api/v1.0/email/send',
            data=json.dumps(data),
            headers=headers
        )
        response.raise_for_status()
        print('Your mail is sent!')
    except requests.exceptions.RequestException as error:
        print(f'Oops... {error}')
        if error.response is not None:
            print(error.response.text)
