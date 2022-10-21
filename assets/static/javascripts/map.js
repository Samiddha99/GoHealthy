//map.js

var defaultLocationSet = false
var setLatitude = 22.653463711731405;
var setLongitude = 79.46649351295551;


//Set up some of our variables.
var map; //Will contain map object.
var marker = false; ////Has the user plotted their location marker? 
        
//Function called to initialize / create the map.
//This is called when the page has loaded.
function initMap() {

    //The center location of our map.
    var centerOfMap = new google.maps.LatLng(setLatitude, setLongitude);

    //Map options.
    var options = {
        center: centerOfMap, //Set center.
        zoom: 15, //The zoom value.
        mapTypeId: "roadmap",
        mapTypeControl: true,
    };
    //Create the map object.
    map = new google.maps.Map(document.getElementById('map'), options);

	//Create the marker.
	marker = new google.maps.Marker({
		position: centerOfMap,
		map: map,
		draggable: true //make it draggable
	});

    //Listen for drag events!
    google.maps.event.addListener(marker, 'dragend', function(event){
        getLatLngFromMarkerLocation();
    });

    //Listen for any clicks on the map.
    google.maps.event.addListener(map, 'click', function(event) {                
        //Get the location that the user clicked.
        var clickedLocation = event.latLng;
        marker.setPosition(clickedLocation);

        //Get the marker's location.
        getLatLngFromMarkerLocation();
    });


    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });
  
    let markers = [];
  
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }
  
      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
  
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
  
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }
  
        const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
  
        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
}
        
//This function will get the marker's current location and then add the lat/long
//values to our textfields so that we can save the location.
function getLatLngFromMarkerLocation(){
    //Get location.
    var currentLocation = marker.getPosition();
    //Add lat and lng values to a field that we can save.
    document.getElementById('selectedLatitude').value = currentLocation.lat(); //latitude
    document.getElementById('selectedLongitude').value = currentLocation.lng(); //longitude
	setLatitude = currentLocation.lat();
	setLongitude = currentLocation.lng();
}


getLatitude = $("#selectedLatitude").val();
getLongitude = $("#selectedLongitude").val();

function detectLocationSuccess(position) {
    setLatitude  = position.coords.latitude;
    setLongitude = position.coords.longitude;
	defaultLocationSet = true
    initMap();
}
function detectLocationError() {
    console.log("Current location fatch failed!")
	defaultLocationSet = false
	initMap()
}

function loadMap(){
	if((getLatitude == undefined || getLatitude == null || getLatitude == '') && (getLongitude == undefined || getLongitude == null || getLongitude == '')){
	//get the user's current location
		if(navigator.geolocation) { // if browser support then get user location
			var options = {
				enableHighAccuracy: true,
				maximumAge: 0
			};
			navigator.geolocation.getCurrentPosition(detectLocationSuccess, detectLocationError, options);
		} 
		else{
			defaultLocationSet = false
			initMap()
		}
	}
	else{
		setLatitude = getLatitude;
		setLongitude = getLongitude;
		defaultLocationSet = true
		initMap()
	}
}

$(document).ready(loadMap)

$(".mapMarkerModal").on('shown.bs.modal', function(){
	if(defaultLocationSet){
		$("#selectedLatitude").val(setLatitude);
		$("#selectedLongitude").val(setLongitude);
	}
})