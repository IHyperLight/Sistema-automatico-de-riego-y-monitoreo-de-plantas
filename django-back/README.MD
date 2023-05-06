# Ambientación del back Django

## Instalación del recurso del restframework librerias
```bash
pip install djangorestframework
```
## Instalación de corsheaders
```bash
pip install django-cors-headers
```

## Agregar la libreria a INSTALLED_APPS en settings
```bash
'rest_framework',
```

## Instalación de todo lo que se utiliza
```bash
pip install -r requirements.txt
```

## Crear usuario: plantita   passwd: proyectito
```bash
python manage.py createsuperuser
```

## Pasos a seguir
1.Crear usuario
2.Consumir Login (POST  url/django/login)
3.Obtener Token
4.Agregar token a Headers (Authorization/Token token)
5.Realizar las peticiones deseadas (GET, POST, etc)
