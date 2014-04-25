/*
    Following:

    Places search box
    https://developers.google.com/maps/documentation/javascript/examples/places-searchbox?hl=FR

    Map Geolocation
    https://developers.google.com/maps/documentation/javascript/examples/map-geolocation
    
    MapTypes
    https://developers.google.com/maps/documentation/javascript/maptypes
    
    Geolocation
    http://diveintohtml5.info/geolocation.html    
    
*/

function initialize() {
  var markers = [];
    
  var mapOptions = {
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);    

  // Try HTML5 geolocation    
  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) { 
                            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                            map.setCenter(pos) 
      }, function() { handleNoGeolocation(map) } )
    } else {
          handleNoGeolocation(map);
 }

   
  // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });
  // [END region_getplaces]

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
}

function show_map(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  // let's show a map or do something interesting!
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content,
    zoom: 13
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

function handleNoGeolocation(map) {
        var pos = new google.maps.LatLng(37.712569, -122.219743);      
        var sw = new google.maps.LatLng(pos.lat() - 0.02, pos.lng() - 0.10);
        var ne = new google.maps.LatLng(pos.lat() + 0.02, pos.lng() + 0.10);
        var bounds = new google.maps.LatLngBounds(sw);  
        bounds.extend(ne);
        map.fitBounds(bounds);
}

google.maps.event.addDomListener(window, 'load', initialize);


