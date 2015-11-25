function initialize() {
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

function positionFound(position) {
  document.getElementById('lat').value = position.coords.latitude;
  document.getElementById('long').value = position.coords.longitude;
  initialize();
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(positionFound);
} else {
  alert('It appears that required geolocation is not enabled in your browser.');
}
