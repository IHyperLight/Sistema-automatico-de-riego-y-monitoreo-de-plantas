from rest_framework import serializers

from datos.models import datosModel

class datosSerializer(serializers.ModelSerializer):
    class Meta:
        model = datosModel
        fields = ('__all__')

class datosTSerializer(serializers.ModelSerializer):
    class Meta:
        model = datosModel
        fields = ('temperatura',)

class datosHSerializer(serializers.ModelSerializer):
    class Meta:
        model = datosModel
        fields = ('humedadS',)

class datosH2Serializer(serializers.ModelSerializer):
    class Meta:
        model = datosModel
        fields = ('humedad',)