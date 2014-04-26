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
var selectedShape;
var drawingManager;

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
    drawingManager = new google.maps.drawing.DrawingManager({
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
    rectangleOptions: {
        strokeWeight: 1,
            editable: true
    }
  });
    
  // Hide DrawingControler when one shape is drawed    
  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
            var latLongBox = document.getElementById('latLongBox');
                              
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
              latLongBox.style.display = 'inline';    
            });
            setSelection(newShape); 
            latLongBox.style.display = 'inline';    
          }
  });  
    
  drawingManager.setMap(map);       
    
  /* Controllers: Add submit and clear button */
  var controlDiv = document.createElement('div');
  var homeControl = new ControlButtons(controlDiv, map); 
  controlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
    

  /* Controllers: Add submit and clear button */
  var latLongBox = document.createElement('div');
  latLongControl = new ControlLatLong(latLongBox, map); 
  latLongBox.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(latLongBox);
      
}

function handleNoGeolocation(map) {
        // Using Oackland by default
        var pos = new google.maps.LatLng(37.712569, -122.219743);                   
        map.fitBounds(extendOnePlace(pos));
}

function extendOnePlace(pos) {
        // used with fitbounds to get a x13 zoom 
        var sw = new google.maps.LatLng(pos.lat() - 0.02, pos.lng() - 0.10);
        var ne = new google.maps.LatLng(pos.lat() + 0.02, pos.lng() + 0.10);
        var bounds = new google.maps.LatLngBounds(sw);  
        bounds.extend(ne);
        return bounds;
}
 
function clearSelection() {
    // Selection is the polygon
    if (selectedShape) {
      selectedShape.setEditable(false);
      selectedShape = null;
    }
}

function setSelection(shape) {
    // Selection is the polygon
    clearSelection();
    selectedShape = shape;
    shape.setEditable(true);
}

function deleteSelectedShape() {
    if (selectedShape) {
      selectedShape.setMap(null);
    }

    latLongBox.style.display = 'none';
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
    drawingManager.setOptions({drawingControl: true});  
  }

      
function ControlButtons(containerControl, map) {
  /*
    CreateControlButton :: Creates buttons controls and gives them style.
  */
        
  // Set CSS styles for the DIV containing the control
  containerControl.style.padding = '16px';

  // Set CSS for the clear button
  var clearUI = document.createElement('div'); 
  clearUI.style.float = 'left';
  clearUI.style.width = '100px';
  clearUI.style.margin = '0 10px 0 0';
  clearUI.style.cursor = 'pointer';
  clearUI.style.textAlign = 'center';
  clearUI.title = '';
  clearUI.style.backgroundColor = 'white';
  clearUI.style.color = 'black';   
  containerControl.appendChild(clearUI);  
  // Set CSS for the submit button interior
  var clearText = document.createElement('div');
  clearText.style.fontFamily = 'Roboto,Arial,sans-serif';
  clearText.style.fontSize = '15px';
  clearText.style.padding = '10px 22px 10px 22px';
  clearText.innerHTML = 'Clear';
  clearUI.appendChild(clearText);
  // Setup the click event listeners 
  google.maps.event.addDomListener(clearUI, 'click', deleteSelectedShape);      
    
    
  // Set CSS for the submit button
  var submitUI = document.createElement('div');
  submitUI.style.float = 'left';
  submitUI.style.width = '100px';    
  submitUI.style.cursor = 'pointer';
  submitUI.style.textAlign = 'center';
  submitUI.title = '';
  submitUI.style.backgroundColor = '#1E90FF';
  submitUI.style.color = 'white';        
  submitUI.style.borderStyle = 'none';
  containerControl.appendChild(submitUI);  
  // Set CSS for the submit button interior
  var submitText = document.createElement('div');
  submitText.style.fontFamily = 'Roboto,Arial,sans-serif';
  submitText.style.fontSize = '15px';
  submitText.style.padding = '10px 22px 10px 22px';
  submitText.innerHTML = 'Submit';
  submitUI.appendChild(submitText);
  // Setup the click event listeners 
  google.maps.event.addDomListener(submitUI, 'click', function() {
                            var chicago = new google.maps.LatLng(41.850033, -87.6500523);  
                            map.setCenter(chicago)
                    }); 

  
}

function ControlLatLong(containerControl, map) { 
  /*
  Crates a div box with the polygon latitude and longitude
  */
  containerControl.innerHTML = '<b>HOLA HOLA HOLA</b>';
  containerControl.id = 'latLongBox';
  containerControl.style.display = 'none';      
      
}


google.maps.event.addDomListener(window, 'load', initialize);


