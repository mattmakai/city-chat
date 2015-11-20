function initialize() {
  var mapCanvas = document.getElementById('map');
  var latLng = new google.maps.LatLng(document.getElementById('latitude').value, document.getElementById('longitude').value);
  var mapOptions = {
    center: latLng,
  zoom: 16,
  mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(mapCanvas, mapOptions);
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: 'Neighbor chat!'
  });
}


function successFunction(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  document.getElementById('latitude').value = lat;
  document.getElementById('longitude').value = lon;

  console.log('Your latitude is :' + lat + ' and longitude is ' + lon);
  initialize();
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(successFunction);
} else {
  alert('It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.');
}


