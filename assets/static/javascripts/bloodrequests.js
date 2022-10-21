
var page = 1;

$("#filter").on('submit', function(e){
    e.preventDefault();
    $("#btn_search").html('Searching');
    page = 1
    lookingFor = 'Filter';
    updateURI({lookingFor: lookingFor});
    var f = function(){
        $("#btn_search").html('Search');
    }
    searchBloodRequests({callbacks: [f,]});
});

var worker_load_blood_requests = new Worker('/static/javascripts/blood_requests_worker.js');

function updateURI({lookingFor='first load'}={}){
    var targetURL = $("#filter").attr('action');
    if(lookingFor == 'All'){
        data = $(`[form='filter']`).serializeToJSON({
            parseBooleans: false,
        }); //get form data in json format
        targetURL += '?' + $.param(data); //form data to uri
    }
    if(lookingFor == 'Filter'){
        data = $(`[form='filter']`).serializeToJSON({
            parseBooleans: false,
        }); //get form data in json format
        targetURL += '?' + $.param(data); //form data to uri
    }
    else{
        let current_url = window.location.href
        let current_url_splited = current_url.split("?")
        if(current_url_splited.length <= 1){
            // no query parameter in uri
            data = $(`[form='filter']`).serializeToJSON({
                parseBooleans: false,
            }); //get form data in json format
            targetURL += '?' + $.param(data); //form data to uri
        }
        else{
            targetURL += "?" + current_url_splited[1]
        }
    }
    history.pushState({page: 2}, document.title, targetURL); //update url
}

function searchBloodRequests({callbacks=undefined}={}){
    $("#show-results").show();
    $(".no-resuls-found").hide();
    var targetURL = $("#filter").attr('action');
    if(page == 1){
        $(".loader-div").show();
    }
    $("#filter").trigger('reset');
    try{
        var search = location.search.substring(1); //get the url
        data = JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}'); //get data from uri in JSON format
        $("#filter").jsonToForm(data); //fiil the form from the json data
    }
    catch{
        data = {}
    }

    data['action'] = 'filter'
    data['page'] = page

    $.get(targetURL, data, function(requestData){
        $(".loader-div").hide();
        if(requestData.noResults){
            if(page == 1){
                $(".no-resuls-found").show();
                $("#show-results").hide();
            }
            $("#seeMoreBtn").hide();
        }
        else{
            $(".no-resuls-found").hide();
            worker_load_blood_requests.postMessage(requestData.bloodRequests);
            
            if(requestData['isLast']){
                $("#seeMoreBtn").hide();
            }
            else{
                $("#seeMoreBtn").show();
            }
        }
        if(callbacks != undefined){
            for(i in callbacks){
                fun = callbacks[i];
                fun();
            }
        }
    });
}


worker_load_blood_requests.addEventListener('message', function(e) {
    var data = e.data;
    $("#results").append(data['html']);
    $(`#requested_at-${data['id']}`).html(formatDateTime(data['Requested_at']));
}, false);

$("#seeMoreBtn").on('click', function(){
    page += 1;
    $(this).prop('disabled', true);
    var moreButton = document.getElementById("seeMoreBtn")
    dotMovingAnimation(moreButton, 5)
    var f = function(){
        dotMovingAnimation(moreButton, 0);
        $(this).html('See More');
        $(this).prop('disabled', false);
    }
    searchBloodRequests({callbacks: [f,]});
});

$("#gpsBtn").on('click', detectLocation);
function detectLocation() {

    function success(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;

        $.ajax(
        {
            url: "/get-city/",
            data:{
                'latitude':latitude,
                'longitude':longitude,
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                document.getElementById('gpsBtn').innerHTML = "<i class='fas fa-map-marker-alt'></i>"
                if(response.success == "1")
                {
                    $('#city').val(response.city);
                }
            },
            error: function(response)
            {
                document.getElementById('gpsBtn').innerHTML = "<i class='fas fa-map-marker-alt'></i>";
            }
        });

    }

    function error() {
        alert('Unable to retrieve your location. Check permissions on your browser. Allow the location permission');
    }

    if(!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
    }
    else {
        document.getElementById('gpsBtn').innerHTML = "<i class='fas fa-spinner-third fa-spin'></i>"
        var options = {
            enableHighAccuracy: true,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(success, error, options);
    }

}

$(document).ready(function(){
    page = 1
    updateURI()
    searchBloodRequests();
});

$(window).on("popstate", function () {
    page = 1
    searchBloodRequests();
});
