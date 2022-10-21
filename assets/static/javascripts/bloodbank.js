

var latitude = 0;
var longitude = 0;
var page = 1;
var sortValue = ''
var total_page = 0;
var isFirstLoad = true;
var district = null;
var isLast = true;
var isFetchedPageLastRecord = false;

navigator.permissions.query({name:'geolocation'}).then(function(result) {
    result.onchange = function() {
        if (result.state != 'granted'){
            alert("If you don't allow location, then you will not be able to do near by search");
        }
    }
});


var liveBloodStatus =  function() {
    var uri = `/events/live-blood-status/`;
    bedSource = new ReconnectingEventSource(uri);
    bedSource.addEventListener('message', function (e) {
        bloodData = JSON.parse(e.data)
        bankID = bloodData['blood_bank_id'];
        availabilityData = bloodData['Blood_Availability'];
        for(var key in availabilityData){
            $(`#${key}-${bankID}`).html(availabilityData[key]);
        }
        update = formatDateTime(bloodData['Last_Update']);
        $(`#last_update-${bankID}`).html(update);
    }, false);
}

$(document).ready(function(){
    liveBloodStatus();
});

function nearBySearchSuccess(position) {
    latitude  = position.coords.latitude;
    longitude = position.coords.longitude;

    isFirstLoad = true;
    page = 1
    lookingFor = 'Near Me';
    let item_sort_val = $(`input[name='sort']:checked`).val()
    updateURI({lookingFor:lookingFor, sortValue:item_sort_val});
    searchBloodBanks();
}
function nearBySearchError() {
    $(".loading-image-background").hide();
    console.log('Unable to retrieve your location. Check permissions on your browser. Allow the location permission');
}
function nearBySearch(){
    if(!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
    }
    else {
        $(".loading-image-background").show();
        var options = {
            enableHighAccuracy: true,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(nearBySearchSuccess, nearBySearchError, options);
    }
}

$("#locationbtn").on('click', function(event){
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
        if (result.state != 'granted') {
            alert("You can't do near by search, because you didn't allow location sharing");
        }
        else{
            nearBySearch();
        }
    });
    return 0;
});

navigator.permissions.query({name:'geolocation'}).then(function(result) {
    result.onchange = function() {
        if (result.state != 'granted'){
            alert("If you don't allow location, then you will not be able to do near by search");
        }
    }
});



$("#nav-close").on('click', closeSideFilter);
function closeSideFilter(){
    $('.sidenav').addClass('sidenav-default');
    $('.sidenav').removeClass('sidenav-active');
    document.body.style.overflowY = 'auto';
}

$(".btn-filter").on('click', openSideFilter);
function openSideFilter(){
    document.body.style.overflowY = 'hidden';
    $('.sidenav').removeClass('sidenav-default');
    $('.sidenav').addClass('sidenav-active');
}

$(".section-heading").on('click', function(){
    $(this).toggleClass('active');
    let elementId = $(this).attr('id');
    let target = $(this).attr('data-target');
    $(target).toggleClass('active');
    $(`#${elementId}-button`).toggleClass('fa-chevron-up');
    $(`#${elementId}-button`).toggleClass('fa-chevron-down');
});

$(".sort-btn").on('click', function(){
    $(".box-sort-backdrop").css('display', 'block');
    document.body.style.overflowY = 'hidden'
});

$(document).mouseup(function (e) {
    if ($(e.target).closest(".box-sort").length === 0) {
        $(".box-sort-backdrop").css('display', 'none');
        document.body.style.overflowY = 'auto'
    }
});


$("#filter").on('submit', function(e){
    e.preventDefault();
    $(".loading-image-background").show();
    isFirstLoad = true;
    page = 1
    lookingFor = 'Filter';
    let item_sort_val = $(`input[name='sort']:checked`).val()
    updateURI({lookingFor:lookingFor, sortValue:item_sort_val});
    searchBloodBanks();
});

$('input[name="Sort"]').on('change', function(event){
    sortValue = $(this).val()
    $(".box-sort-backdrop").css('display', 'none');
    $("#filter").submit();
});

$('#filter-clear').on('click', function(){
    sortValue = ''
    $("#filter").trigger('reset');
    $(".loading-image-background").show();
    $('.sidenav').addClass('sidenav-default');
    $('.sidenav').removeClass('sidenav-active');
    isFirstLoad = true;
    page = 1
    lookingFor = 'All';
    let item_sort_val = $(`input[name='sort']:checked`).val()
    updateURI({lookingFor: lookingFor, sortValue:item_sort_val});
    searchBloodBanks();
});

function resetVal(){
    $('#District').html(`<option label="Select District"></option>`);
    $('#Subdivision').html('');
    $('#City').html('');
    $("#District").attr("data-toggle", "tooltip");
    $("#District").attr("data-placement", "top");
    $("#District").attr("title", "To Select District choose A State First");
}
$("#filter").on('reset', resetVal);

var worker_load_blood_banks = new Worker('/static/javascripts/blood_banks_worker.js');

function updateURI({lookingFor='first load', sortValue=''}={}){
    if(sortValue == null || sortValue == undefined){
        sortValue = ''
    }
    data = {}
    var targetURL = $("#filter").attr('action');
    if(lookingFor == 'All'){
        data = $(`[form='filter']`).serializeToJSON({
            parseBooleans: false,
        }); //get form data in json format
        data['sort'] = sortValue
        targetURL += '?' + $.param(data); //form data to uri
    }
    else if(lookingFor == 'Filter' || lookingFor == "Near Me"){
        data = $(`[form='filter']`).serializeToJSON({
            parseBooleans: false,
        }); //get form data in json format

        if(lookingFor == 'Near Me'){
            data['latitude'] = latitude
            data['longitude'] = longitude
            data['City'] = '';
            data['District'] = '';
            data['Pin'] = '';
            data['State'] = '';
            data['Subdivision'] = '';
        }
        else if(data['City'] != '' || data['District'] != '' || data['Pin'] != '' || data['State'] != '' || data['Subdivision'] != ''){
            data['latitude'] = ''
            data['longitude'] = ''
        }
        else if(data['latitude'] != '' && data['longitude'] != ''){
            data['City'] = '';
            data['District'] = '';
            data['Pin'] = '';
            data['State'] = '';
            data['Subdivision'] = '';
        }
        else{
            data['latitude'] = ''
            data['longitude'] = ''
        }

        if(data["Groups"] == true){
            groups = []
            $.each($('input[name="Groups"]:checked'), function(){
                groups.push($(this).val());
            });
            data['Groups'] = groups
        }
        data['Sort'] = sortValue
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

function searchBloodBanks(){
    $(".no-resuls-found").hide();
    $(".loading-skeleton").show();
    isLast = true;
    isFetchedPageLastRecord = false
    
    var targetURL = $("#filter").attr('action');
    $("#filter").trigger('reset');
    if(window.innerWidth <= 614){
        closeSideFilter()
    }
    try{
        var search = location.search.substring(1); //get the url
        decodedURI = `{"${decodeURIComponent(search).replace(/=/g,'":"').replace(/&/g, '","')}"}`
        data = JSON.parse(decodedURI); //get data from uri in JSON format
        
        //group field is checkbox type, so we have to store all the groups in a array.
        splitDecode = decodedURI.split('","')
        groups = []
        for(i=0; i<splitDecode.length; i++){
            if(splitDecode[i].includes('Groups')){
                groups.push(splitDecode[i].replace(/"/g, "").split(":")[1])
            }
        }
        data['Groups'] = groups // update group array to group key of JSON data.
        $("#filter").jsonToForm(data); //fiil the form from the json data
        
        delete data['Groups[]']
        data['Groups[]'] = groups

        
        $(`[name='Sort'][value='${data['Sort']}']`).prop('checked', true);

        district = data['District'];

        loadDistrict()
        loadAddress();
    }
    catch(err){
        data = {}
    }


    data['action'] = 'filter'
    data['page'] = page
    data['isFirstLoad'] = isFirstLoad;


    if(page == 1){
        $("#results").html("");
    }
    if(isFirstLoad){
        
    }
    $.get(targetURL, data, function(bloodBankData){
        $("#total-results-no").html(bloodBankData.total);
        if(bloodBankData.total == 0){
            $(".loading-skeleton").hide();
            if(isFirstLoad){
                $(".no-resuls-found").show();
            }
        }
        else{
            total_page = bloodBankData['total_page'];
            if(page == 1){
                document.getElementById('div-results').scrollIntoView(true);
            }
            data = {
                'bloodBank': bloodBankData.bloodBanks,
            }
            worker_load_blood_banks.postMessage(data);

            isLast = bloodBankData['isLast'];
        }
        $(".loading-image-background").hide();
        document.body.style.overflowY = 'auto';
    });
}

worker_load_blood_banks.addEventListener('message', function(e) {
    var data = e.data;
    isFetchedPageLastRecord = data['isLastRecord']
    $("#results").append(data['html']);
    $(`#last_update-${data['Bank_Id']}`).html(formatDateTime(data['last_update']));
    if(isFetchedPageLastRecord){
        $(".loading-skeleton").hide();
    }
}, false);


$(window).on('scroll', function() {
    if ($(window).scrollTop() + 80 >= $('.div-results').offset().top + $('.div-results').outerHeight() - window.innerHeight) {
        if(((!isLast) && isFetchedPageLastRecord)){
            isFetchedPageLastRecord = false;
            page += 1;
            searchBloodBanks();
        }
    }
});


function loadDistrict()
{
    $('#District').html(`<option label="Select District"></option>`);
    state = $('#State').val();
    var options = '';
    if(state != 'All States & Union Territories' && state != '' && state != undefined){
        $("#District").removeAttr("data-toggle");
        $("#District").removeAttr("data-placement");
        $("#District").removeAttr("title");
        $.ajax({
            url:"/get-district/",
            data:{
                'state':state,
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                var dc = Number(response.districtcount);
                for(i=0; i<dc; i++) 
                {
                    options += `<option value="${response.districts[i]}">${response.districts[i]}</option>`;
                }
                $("#District").append(options);
                
                if(district != null){
                    $("#District").val(district);
                }
                district = null;
            },
        });
    }
    else{
        $("#District").attr("data-toggle", "tooltip");
        $("#District").attr("data-placement", "top");
        $("#District").attr("title", "To Select District choose A State First");
    }
}

$('#State').on('change', loadDistrict);


function loadAddress()
{
    document.getElementById('Subdivision').innerHTML = "";
    document.getElementById('City').innerHTML = "";
    var pin = $('#Pin').val();
    if(pin.length == 6)
    {
        var sub = "";
        var city = "";
        $.ajax(
        {
            url: "/get-address/",
            data:{
                'pin':pin,
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                sub = '<option value="' + response.division + '" />';
                city = '<option value="' + response.city + '" />';
    
                $('#Subdivision').html(sub);
                $('#City').html(city);            
            },
        });
    }
}
$('#Pin').on('keyup', loadAddress);

new Autocomplete('#autocomplete', {
    search: input => {
        return new Promise(resolve => {
            if (input.length < 1) {
                return resolve([])
            }
            else{
                data = {
                    'action': 'Name_Search',
                    'Name': input,
                }
                urlDecodedData = $.param(data)
                const url = `/blood-banks/?${urlDecodedData}`
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                    resolve(data.results)
                })
            }
        });
    },
    renderResult: (result, props) => {
        renderedHtml = `
        <li ${props}>
            ${result.Name}
        </li>
        `
        return renderedHtml;
    },
    getResultValue: result => result.Name,
});

$(document).ready(function(){
    isFirstLoad = true;
    page = 1
    updateURI()
    searchBloodBanks();
});

$(window).on("popstate", function () {
    isFirstLoad = true;
    searchBloodBanks();
});
