from datetime import timezone
from pytz import timezone
from django.utils import timezone
from django.db import models

# Create your models here.
class datosModel(models.Model):
    nivelA = models.CharField(null=False, max_length=10)
    humedadS = models.CharField(null=False, max_length=10)
    temperatura = models.CharField(null=False, max_length=10)
    humedad = models.CharField(null=False, max_length=10)
    riego = models.CharField(null=False, max_length=10)
    fecha = models.DateTimeField(default=timezone.now)
    

