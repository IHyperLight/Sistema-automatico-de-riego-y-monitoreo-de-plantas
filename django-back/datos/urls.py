from django.urls import path, re_path
from django.conf.urls import include

from datos.views import datosView, datosViewDetail, datosTempView, datosHumView
from datos.views import datosHum2View

urlpatterns = [
    re_path(r'^datos/lista$', datosView.as_view()),
    re_path(r'^datos/temperatura$', datosTempView.as_view()),
    re_path(r'^datos/humedad$', datosHumView.as_view()),
    re_path(r'^datos/humedad2$', datosHum2View.as_view()),
    re_path(r'^datos/actual$', datosViewDetail.as_view()),
]