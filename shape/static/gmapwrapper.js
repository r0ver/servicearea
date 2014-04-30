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
              updateLatLong();    
            });
            setSelection(newShape); 
            updateLatLong();
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
    
    google.maps.event.addListener(shape, 'bounds_changed', function() {
            updateLatLong(); }
  );    
    
}

function deleteSelectedShape() {
    if (selectedShape) {
      selectedShape.setMap(null);
    }

    latLongBox.style.display = 'none';
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
    drawingManager.setOptions({drawingControl: true});  
    selectedShape = null;
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
  
  // Setup the Submit button behavior 
  google.maps.event.addDomListener(submitUI, 'click', function() {
                            if (selectedShape) { 
                                // there's a polygon
                                 var shapeCoords = {};
                                 getSelectedPlaceCoord(shapeCoords);
                                 
                                 // I assume client running on same domain as server. 
                                 var url = '/api/shape/' ; 
                                
                                 // Building the json manually 
                                 var jsonToPost = '{"northeast_lat":' + shapeCoords.neLat + ',' +
                                                    '"northeast_lng":' + shapeCoords.neLong + ',' +
                                                    '"southwest_lat":' + shapeCoords.swLat + ',' +
                                                    '"southwest_lng":' + shapeCoords.swLong  + '}'; 
                                 function processResponse(responseText) {  window.open("defined-area.html","_self");
                                                                        } ;
                                  _SU3.postAjax(url, processResponse, jsonToPost);
                                 
                                 
                                
                            } else { 
                                //there isn't a polygon
                                alert("You must define an area");
                            } 
                    }); 
}

function ControlLatLong(box, map) { 
  /*
  Crates a div box with the polygon latitude and longitude
  */
  box.style.padding = '5px';
  box.style.margin = '6px';
  box.style.backgroundColor = 'white'
  box.style.border = '1px solid #b4b2ac'
  box.innerHTML = "Northwest: <span id='nwLatLong'>N</span> | Southeast: <span id='seLatLong'>N</span>";
  box.id = 'latLongBox';
  box.style.display = 'none';      
}


function updateLatLong() {
    var shapeCoords = {};
    getSelectedPlaceCoord(shapeCoords);
    
    var neLatLong = document.getElementById("nwLatLong");
    neLatLong.innerHTML = ' Lat ' + shapeCoords.neLat.toFixed(2) + ' Lng ' + shapeCoords.swLong.toFixed(2);
    
    var neLatLong = document.getElementById("seLatLong");
    neLatLong.innerHTML = ' Lat ' + shapeCoords.swLat.toFixed(2) + ' Lng ' + shapeCoords.neLong.toFixed(2);
    latLongBox.style.display = 'inline'; 
    
}

function getSelectedPlaceCoord (shapeCoords) {
    shapeCoords.neLat = selectedShape.getBounds().getNorthEast().lat();
    shapeCoords.neLong = selectedShape.getBounds().getNorthEast().lng();
    shapeCoords.swLat = selectedShape.getBounds().getSouthWest().lat();
    shapeCoords.swLong = selectedShape.getBounds().getSouthWest().lng();
    return shapeCoords;
}

google.maps.event.addDomListener(window, 'load', initialize);


