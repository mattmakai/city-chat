from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'chat/message$', views.chat_message, name="chat_message"),
    url(r'token$', views.token, name="token"),
    url(r'$', views.main, name="main"),
]
