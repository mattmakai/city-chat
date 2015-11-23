function initialize() {
  var mapCanvas = document.getElementById('map');
  var latLng = new google.maps.LatLng(document.getElementById('latitude').value, 
                                      document.getElementById('longitude').value);
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
  var chatRadius = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: latLng,
      radius: 250
    });
}


function successFunction(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  document.getElementById('latitude').innerHTML = lat;
  document.getElementById('longitude').innerHTML = lon;
  initialize();
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(successFunction);
} else {
  alert('It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.');
}

