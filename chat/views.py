from django.shortcuts import render
from django.conf import settings


def main(request):
    return render(request, 'chat.html', {})


def token(request):
    device_id = 'abc'
    return 'ok'
