var $chatWindow = $('#messages');
var accessManager;
var messagingClient;
var cityChannel;
var username;
var userLocation;
var city;

// Helper function to print info messages to the chat window
function print(infoMessage, asHtml) {
    var $msg = $('<div class="info">');
    if (asHtml) {
        $msg.html(infoMessage);
    } else {
        $msg.text(infoMessage);
    }
    $chatWindow.append($msg);
}

// Helper function to print chat message to the chat window
function printMessage(fromUser, message) {
    var $user = $('<span class="username">').text(fromUser + ': ');
    if (fromUser === username) {
        $user.addClass('me');
    }
    var $message = $('<span class="message">').text(message);
    var $container = $('<div class="message-container">');
    $container.append($user).append($message);
    $chatWindow.append($container);
}

// creates the map based on user's browser location 
function drawMap(position) {
  document.getElementById('lat').value = position.coords.latitude;
  document.getElementById('long').value = position.coords.longitude;
  var mapCanvas = document.getElementById('map');
  var latLng = new google.maps.LatLng(document.getElementById('lat').value, document.getElementById('long').value);

  var mapOptions = {
    center: latLng,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(mapCanvas, mapOptions);
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: 'Your location'
  });
}


function mapAndChat(position) {
  drawMap(position);
  chatBasedOnCity();
}


function chatBasedOnCity() {
  var latitude = $('#lat').val();
  var longitude = $('#long').val();
  $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true', {}, function(locationData) {
    userLocation = locationData.results[0]["formatted_address"];
    username = userLocation.replace(/\s/g, '_');
    city = locationData.results[0].address_components[3].long_name;
    createChat();
  });
}


function createChat() {
  $.getJSON('/token', {identity: username, device: 'browser'}, function(data) {
    print('It looks like you are near: ' 
        + '<span class="me"><strong>' + userLocation + '</strong></span>', true);

    accessManager = new Twilio.AccessManager(data.token);
    messagingClient = new Twilio.IPMessaging.Client(accessManager);

    var promise = messagingClient.getChannelByUniqueName(city);
    promise.then(function(channel) {
        cityChannel = channel;
        if (!cityChannel) {
            // If channel does not exist then create it
            messagingClient.createChannel({
                uniqueName: city,
                friendlyName: city
            }).then(function(channel) {
                console.log('Created channel:');
                console.log(channel);
                cityChannel = channel;
                setupChannel();
            });
        } else {
            console.log('Found channel:');
            console.log(cityChannel);
            setupChannel();
        }
    });

  });

  function setupChannel() {
      // Join the general channel
      cityChannel.join().then(function(channel) {
          print('Joined channel "' + channel.uniqueName + '" as ' 
              + '<span class="me">' + username + '</span>.', true);
      });
      // Listen for new messages sent to the channel
      cityChannel.on('messageAdded', function(message) {
          printMessage(message.author, message.body);
      });
  }

  // Send a new message to the general channel
  var $input = $('#chat-input');
  $input.on('keydown', function(e) {
      if (e.keyCode == 13) {
          cityChannel.sendMessage($input.val())
          $input.val('');
      }
  });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(mapAndChat);
} else {
  alert('It appears that required browser geolocation is not enabled.');
}
