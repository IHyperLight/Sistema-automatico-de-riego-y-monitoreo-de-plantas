#Recursos rest_framework
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

#Recursos locales
from datos.models import datosModel
from datos.serializers import datosSerializer, datosTSerializer, datosHSerializer
from datos.serializers import datosH2Serializer

# Create your views here.
class datosView(APIView):
    def get(self, request, format=None):
        queryset = datosModel.objects.all()
        serializer = datosSerializer(queryset , many=True, context={'request':request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = datosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response( serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class datosViewDetail(APIView):  
    def get_object(self):
        try:
            return datosModel.objects.last()
        except datosModel.DoesNotExist:
            return 0

    def get(self, request, format=None):
        datos = self.get_object()
        if datos != 0:
            datos = datosSerializer(datos)
            return Response(datos.data, status=status.HTTP_200_OK)
        return Response("No hay datos", status=status.HTTP_400_BAD_REQUEST)

class datosTempView(APIView):
    def get(self, request, format=None):
        queryset = datosModel.objects.all()
        serializer = datosTSerializer(queryset , many=True, context={'request':request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class datosHumView(APIView):
    def get(self, request, format=None):
        queryset = datosModel.objects.all()
        serializer = datosHSerializer(queryset , many=True, context={'request':request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class datosHum2View(APIView):
    def get(self, request, format=None):
        queryset = datosModel.objects.all()
        serializer = datosH2Serializer(queryset , many=True, context={'request':request})
        return Response(serializer.data, status=status.HTTP_200_OK)


