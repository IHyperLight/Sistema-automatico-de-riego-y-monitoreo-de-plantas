# Recursos Django
from django.urls import path, re_path
from django.conf.urls import include

# Recursos Views
from login.views import loginAuth

urlpatterns = [
    re_path(r'^login$', loginAuth.as_view()),
]