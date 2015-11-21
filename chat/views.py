from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render

from twilio.access_token import AccessToken, IpMessagingGrant


def main(request):
    return render(request, 'chat.html', {})


def token(request):
    device_id = 'abc'
    identity = 'matt'
    endpoint_id = "NeighborChat:{0}:{1}".format(device_id,identity)
    token = AccessToken(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_API_KEY,
                        settings.TWILIO_API_SECRET, 3600, identity)
    grant = IpMessagingGrant()
    grant.service_sid = settings.TWILIO_IPM_SERVICE_SID
    grant.endpoint_id = endpoint_id
    token.add_grant(grant)
    return HttpResponse(token.to_jwt())
