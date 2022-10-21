
var latitude = 0;
var longitude = 0;
function LiveLocationSuccess(position) {
    latitude  = position.coords.latitude;
    longitude = position.coords.longitude;
    updateDirectionBtn();
}
function LiveLocationError() {
    console.log('Unable to retrieve your location. Check permissions on your browser. Allow the location permission');
}
function startLiveLocation(){
    updateDirectionBtn();
    if(!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
    }
    else {
        var options = {
            enableHighAccuracy: true,
            maximumAge: 0
        };
        navigator.geolocation.watchPosition(LiveLocationSuccess, LiveLocationError, options);
    }
}
startLiveLocation();
navigator.permissions.query({name:'geolocation'}).then(function(result) {
    result.onchange = function() {
        if (result.state === 'granted') {
            startLiveLocation();
        }
        else if (result.state != 'granted'){
            alert("If you don't allow location, then you will not be able to do near by search");
        }
    }
});

function updateDirectionBtn(){
    var destLocation = $("#directionBtn").attr("data-dest");
    if((latitude == '' && longitude == '') || (latitude == undefined && longitude == undefined) || (latitude == null && longitude == null)){
        var href = `https://www.google.com/maps/@${destLocation}`;
    }
    else{
        var href = `https://www.google.com/maps/dir/${latitude},${longitude}/${destLocation}`;
    }
    $("#directionBtn").attr('href', href);
    return 0;
}


var liveBloodStatus =  function() {
    bankID = $("#blood_bank_id").val()
    var uri = `/events/live-blood-status/`;
    bedSource = new ReconnectingEventSource(uri);
    bedSource.addEventListener('message', function (e) {
        bloodData = JSON.parse(e.data)
        if(bloodData['blood_bank_id'] == bankID)
        {
            availabilityData = bloodData['Blood_Availability'];
            for(var key in availabilityData){
                $(`#${key}`).html(availabilityData[key]);
            }
            update = formatDateTime(bloodData['Last_Update']);
            $("#last_update").html(update);
        }
    }, false);
}

$(document).ready(function(){
    liveBloodStatus();
});