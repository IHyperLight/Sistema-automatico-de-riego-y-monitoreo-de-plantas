from django.urls import path, include, re_path
from django.contrib.auth.models import User
from django.contrib import admin
from rest_framework import routers, serializers, viewsets

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    re_path(r'^django/', include('datos.urls')),
    re_path(r'^django/', include('login.urls')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
