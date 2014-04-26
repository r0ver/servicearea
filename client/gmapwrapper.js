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
    
    Drawing tools
    https://developers.google.com/maps/documentation/javascript/examples/drawing-tools
    
    Hiding tools after one polygon
    http://stackoverflow.com/questions/14166546/google-maps-drawing-manager-limit-to-1-polygon
    
    Adding Buttons
    https://developers.google.com/maps/documentation/javascript/examples/control-custom?csw=1
    
*/

var WHITEBUTTON = 0;
var BLUEBUTTON = 1;

function ControlButton(controlDiv, map, label, buttonStyle, buttonFunction) {
  /*
    CreateControlButton :: Creates buttons controls and gives the style.
  */
        
  // Set CSS styles for the DIV containing the control
  controlDiv.style.padding = '16px';

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = '';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '15px';
  controlText.style.padding = '10px 22px 10px 22px';
  controlText.innerHTML = label;
  controlUI.appendChild(controlText);

  if (buttonStyle) {
      controlUI.style.backgroundColor = '#1E90FF';
      controlUI.style.color = 'white';        
      controlUI.style.borderStyle = 'none';
  } else {
      controlUI.style.backgroundColor = 'white';
      controlUI.style.color = 'black';   
      controlUI.style.borderStyle = '1px';
      controlUI.style.borderColor = 'black';
  }
    
      
  // Setup the click event listeners 
  google.maps.event.addDomListener(controlUI, 'click', buttonFunction);
}

function initialize() {
  var markers = [];
    
  var mapOptions = {
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
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
     map.fitBounds(extendOnePlace(place.geometry.location));             
    }

  });
  // [END region_getplaces]

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);      
  });
    
  // Adding a DrawingManager
    var drawingManager = new google.maps.drawing.DrawingManager({
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.BOTTOM_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.RECTANGLE
      ]
    },
    markerOptions: {
      icon: 'images/beachflag.png'
    },
    circleOptions: {
      fillColor: '#ffff00',
      fillOpacity: 1,
      
      clickable: false,
      editable: true,
      zIndex: 1
    },
    rectangleOptions: {
        strokeWeight: 1,
            editable: true
    }
  });
    
  // Hide DrawingControler when one shape is drawed    
  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
            if (e.type != google.maps.drawing.OverlayType.MARKER) {
            // Switch back to non-drawing mode after drawing a shape.
            drawingManager.setDrawingMode(null);
            drawingManager.setOptions({drawingControl: false});    

            // Add an event listener that selects the newly-drawn shape when the user
            // mouses down on it.
            var newShape = e.overlay;
            newShape.type = e.type;
            google.maps.event.addListener(newShape, 'click', function() {
              setSelection(newShape);
            });
            setSelection(newShape);
            
          }
  });  
    
  drawingManager.setMap(map);       
    
  /* Add submit button */
  var controlDiv = document.createElement('div');
  var homeControl = new ControlButton(controlDiv, map, 'Submit', BLUEBUTTON, function() {
                            var chicago = new google.maps.LatLng(41.850033, -87.6500523);  
                            map.setCenter(chicago)
                    }); 
  controlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
    
}

function handleNoGeolocation(map) {
        // Using Ockland by default
        var pos = new google.maps.LatLng(37.712569, -122.219743);                   
        map.fitBounds(extendOnePlace(pos));
}

function extendOnePlace(pos) {
        var sw = new google.maps.LatLng(pos.lat() - 0.02, pos.lng() - 0.10);
        var ne = new google.maps.LatLng(pos.lat() + 0.02, pos.lng() + 0.10);
        var bounds = new google.maps.LatLngBounds(sw);  
        bounds.extend(ne);
        return bounds;
}

google.maps.event.addDomListener(window, 'load', initialize);


