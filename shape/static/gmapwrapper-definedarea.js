function initialize() {

  function processResponse(responseText) { 
  
      shapeJson = JSON.parse(responseText);

      centerLat = shapeJson.southwest_lat + (Math.sqrt(Math.pow(shapeJson.southwest_lat - shapeJson.northeast_lat, 2))/2);
      centerLng = shapeJson.southwest_lng + (Math.sqrt(Math.pow(shapeJson.northeast_lng - shapeJson.southwest_lng, 2))/2); 


      var mapOptions = {
        center: new google.maps.LatLng(centerLat, centerLng),
        // center: new google.maps.LatLng(0, 0),
        zoom: 13,
      };

      var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

      
      google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
    });

    function placeMarker(location) {
        
        var greenIcon = 'greenflag.png'
        var redIcon = 'redflag.png'
        
        if ( ((shapeJson.northeast_lat > location.lat()) && (location.lat()  > shapeJson.southwest_lat)) && 
             ((shapeJson.northeast_lng > location.lng()) && (location.lng()  > shapeJson.southwest_lng)) ){
            iconFile = greenIcon;
        } else {
            iconFile = redIcon;
        }
        
        var marker = new google.maps.Marker({
            position: location, 
            map: map,
            icon: iconFile
    });}
  };
    
  var myUrl = getCookie('servicearea');
  _SU3.ajax(myUrl, processResponse);  
    
  
}

function getCookie(cname)
{
var name = cname + "=";
var ca = document.cookie.split(';');
for(var i=0; i<ca.length; i++) 
  {
  var c = ca[i].trim();
  if (c.indexOf(name)==0) return c.substring(name.length+1 ,c.length-1);
  }
return "";
}

google.maps.event.addDomListener(window, 'load', initialize);
