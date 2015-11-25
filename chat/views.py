import math

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from twilio.access_token import AccessToken, IpMessagingGrant


def main(request):
    return render(request, 'chat.html', {})


@csrf_exempt
def chat_message(request):
    return HttpResponse('200') #{'body': request.POST.get('body', '')})


def _send_chats(latitude, longitude):
    pass


def distance_on_unit_sphere(lat1, long1, lat2, long2):
    """
        Gratefully obtained from this great blog post:
        http://www.johndcook.com/blog/python_longitude_latitude/
    """
    # Convert latitude and longitude to
    # spherical coordinates in radians.
    degrees_to_radians = math.pi/180.0
    # phi = 90 - latitude
    phi1 = (90.0 - lat1)*degrees_to_radians
    phi2 = (90.0 - lat2)*degrees_to_radians
    # theta = longitude
    theta1 = long1*degrees_to_radians
    theta2 = long2*degrees_to_radians
    # Compute spherical distance from spherical coordinates.
    # For two locations in spherical coordinates
    # (1, theta, phi) and (1, theta', phi')
    # cosine( arc length ) =
    #   sin phi sin phi' cos(theta-theta') + cos phi cos phi'
    # distance = rho * arc length
    cos = (math.sin(phi1)*math.sin(phi2)*math.cos(theta1 - theta2) +
           math.cos(phi1)*math.cos(phi2))
    arc = math.acos( cos )
    # Remember to multiply arc by the radius of the earth
    # in your favorite set of units to get length.
    return arc


def token(request):
    device_id = request.GET.get('device', 'unknown')
    identity = request.GET.get('identity', 'guest')
    endpoint_id = "NeighborChat:{0}:{1}".format(device_id,identity)
    token = AccessToken(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_API_KEY,
                        settings.TWILIO_API_SECRET, identity)
    grant = IpMessagingGrant()
    grant.service_sid = settings.TWILIO_IPM_SERVICE_SID
    grant.endpoint_id = endpoint_id
    token.add_grant(grant)
    response = {'identity': identity, 'token': token.to_jwt()}
    return JsonResponse(response)
