import os
from twilio.rest.ip_messaging import TwilioIpMessagingClient


def set_webhook(webhook_params):
    IPM_SERVICE_SID = os.environ.get("TWILIO_IPM_SERVICE_SID")
    API_KEY = os.environ.get("TWILIO_API_KEY", None)
    API_SECRET = os.environ.get("TWILIO_API_SECRET", None)
    if not None in (IPM_SERVICE_SID, API_KEY, API_SECRET):
        client = TwilioIpMessagingClient(API_KEY, API_SECRET)
        service = client.services.update_instance(IPM_SERVICE_SID,
                                                   webhook_params)
        print("Webhook set properly: {}".format(service.webhooks))
    else:
        print("Please set TWILIO_API_KEY, TWILIO_API_SECRET and " +
              "IPM_SERVICE_SID credentials.")


if __name__ == "__main__":
    if os.environ.get("NGROK_URL", None) is None:
        print("Please set NGROK_URL environment variable.")
    else:
        webhook_params = {"Webhooks.OnMessageSend.Url":
                          os.environ.get("NGROK_URL", "") + "/chat/message",
                          "Webhooks.OnMessageSend.Method": "POST",
                          "Webhooks.OnMessageSend.Format": "XML"}
        set_webhook(webhook_params)
