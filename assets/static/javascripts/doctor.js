var page = 1;
var total_page = 0;
var isFirstLoad = true;
var district = null;

var latitude = 0;
var longitude = 0;
function nearBySearchSuccess(position) {
    latitude  = position.coords.latitude;
    longitude = position.coords.longitude;

    page = 1;
    isFirstLoad = true;
    lookingFor = 'Near Me';
    let item_sort_val = $(`.active[name='sort']`).attr('value')
    updateURI({lookingFor: lookingFor, sortValue:item_sort_val});
}
function nearBySearchError() {
    $(".loading-image-background").css('display', 'none')
    document.body.style.overflowY = 'auto';
    alert('Unable to retrieve your location. Check permissions on your browser. Allow the location permission');
}
function nearBySearch(){
    if(!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
    }
    else {
        $(".loading-image-background").css('display', 'block')
        document.body.style.overflowY = 'hidden';
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


$('input[name=search-by-select]').on('change', function(){
    selectSearchBy(reset=false)
});
 function selectSearchBy(reset=false){
    value = $("input[name=search-by-select]:checked").val();
    placeholder = $("input[name=search-by-select]:checked").attr('data-placeholder');
    if(reset){
        value = "Name";
        placeholder = "Name";
    }
    $("#search-by-field").attr('placeholder', `Search by ${placeholder}`);
    $("#search-by-field").attr('name', value);
    if(value == "Name"){
        $("#name-autocomplete").show();
    }
    else{
        $("#name-autocomplete").hide();
    }
}

$("#filter").on('submit', function(event){
    event.preventDefault();
    page = 1;
    isFirstLoad = true;
    lookingFor = 'Filter';
    let item_sort_val = $(`.active[name='sort']`).attr('value')
    updateURI({lookingFor: lookingFor, sortValue:item_sort_val});
    loadDoctors({lookingFor: lookingFor});
});
$(".item-sort").on('click', function(event){
    event.preventDefault();
    $(".item-sort").removeClass('active');
    $(this).addClass('active');
    $("#filter").submit()
});
$("#clear_filter").on('click', function(event){
    event.preventDefault();
    $("#filter").trigger("reset");
    page = 1
    lookingFor = 'All';
    let item_sort_val = $(`.active[name='sort']`).attr('value')
    updateURI({lookingFor: lookingFor, sortValue:item_sort_val});
    loadHospitals({lookingFor: lookingFor});
});
function resetVal()
{
    $("#District").html(`<option label="Select District"></option>`);
    $("#District").attr("data-toggle", "tooltip");
    $("#District").attr("data-placement", "top");
    $("#District").attr("title", "To Select District choose A State First");
    $('#district_options').html('');
    $('#sub_options').html('');
    $('#city_options').html('');
    selectSearchBy(reset=true);
}
$("#filter").on('reset', resetVal);


var worker_load_doctors = new Worker('/static/javascripts/doctors_worker.js');
var worker_update_pagination = new Worker('/static/javascripts/Update_Pagination/update-pagination.js');
var sendData;


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
        if(data["State"] == undefined){
            data["State"] = "" 
        }
        if(data["specialities"] == true){
            specialities = []
            $.each($('input[name="specialities"]:checked'), function(){            
                specialities.push($(this).val());
            });
            data['specialities'] = specialities
        }
        data['sort'] = sortValue
        data['page'] = page
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

function loadDoctors({lookingFor='All', callbacks=undefined}={}){
    var targetURL = $("#filter").attr('action');
    $(".no-resuls-found").hide();
    $("#result_doctors").html('');
    $(".loading-skeleton").css('display', 'block');
    $("#id_result_total").html('0');
    if(lookingFor != 'First Load'){
        $(".loading-image-background").css('display', 'block')
        document.body.style.overflowY = 'hidden';
        if(window.innerWidth <= 613){
            showOrHideFilter()
        }
    }
    var data = {}
    $("#filter").trigger('reset');
    try{
        var search = location.search.substring(1); //get the url

        decodedURI = `{"${decodeURIComponent(search).replace(/=/g,'":"').replace(/&/g, '","')}"}` //decode uri to conver it to JSON
        data = JSON.parse(decodedURI); //get data from decoded uri in JSON format
        
        //specialities field is checkbox type, so we have to store all the groups in a array.
        splitDecode = decodedURI.split('","')
        specialities = []
        for(i=0; i<splitDecode.length; i++){
            if(splitDecode[i].includes('specialities')){
                specialities.push(splitDecode[i].replace(/"/g, "").split(":")[1])
            }
        }
        data['specialities'] = specialities // update specialities array to specialities key of JSON data.
        $("#filter").jsonToForm(data); //fiil the form from the json data

        delete data['specialities[]']
        data['specialities[]'] = specialities

        district = data['District'];
        loadDistrict();
        loadAddress();

        if('page' in data){
            page = data['page']
        }
        $(`[name='sort']`).removeClass('active');
        $(`[name='sort'][value='${data['sort']}']`).addClass('active');
        selectSearchBy();

    }
    catch{
        data = {}
    }
    data['action'] = "Doctor_Search"
    data['isFirstLoad'] = isFirstLoad;
    $.get(targetURL, data, function(doctorData){
        if(isFirstLoad){
            $("#id_result_total").html(doctorData['total']);
        }
        
        if(doctorData['total'] > 0){
            $("#div_pagination").show();
            $(".total-found").show();
        }
        else{
            $("#div_pagination").hide();
            $(".no-resuls-found").show();
            $(".total-found").hide();
        }
        $("#id_result_total").html(doctorData['total']);
        if(doctorData['count'] > 0){
            $("#text_filter").html(`Filter(${doctorData['count']})`)
        }
        else{
            $("#text_filter").html('Filter')
        }
        $(".loading-image-background").css('display', 'none')
        document.body.style.overflowY = 'auto';
        sendData = {
            'doctorData': doctorData,
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
        }
        document.getElementById('result').scrollIntoView(true);
        if(isFirstLoad){
            total_page = Number(doctorData['total_page'])
        }

        pagination = {
            'total_page': total_page,
            'current_page': page,
        }
        
        worker_update_pagination.postMessage(pagination); // Send data to worker.
        worker_load_doctors.postMessage(sendData);

        if(callbacks != undefined){
            for(i in callbacks){
                fun = callbacks[i];
                fun();
            }
        }
    }).fail(function(){
        $(".loading-image-background").css('display', 'none');
        document.body.style.overflowY = 'auto';
        $("#div_pagination").hide();
    });
}


worker_update_pagination.addEventListener('message', function(e) {
    var data = e.data;
    $("#div_pagination").html(data)
}, false);


worker_load_doctors.addEventListener('message', function(e) {
    var data = e.data
    $(`#result_doctors`).append(data['html']);
    document.getElementById("result_doctors").scrollIntoView(true);
    if(data['noMoreData']){
        $(".loading-skeleton").css('display', 'none');
    }
}, false);  // show the data to UI, when worker send a data



$("#div_pagination").on('click', '.page-item', function(event){
    $(".page-item").removeClass('active');
    $(this).addClass('active');
    page = $(this).attr('data-value');
    if(page == 'previous'){
        page = page - 1
    }
    else if(page == 'next'){
        page = page + 1
    }
    page = Number(page);
    isFirstLoad = false;
    lookingFor = 'Filter';
    let item_sort_val = $(`.active[name='sort']`).attr('value')
    updateURI({lookingFor: lookingFor, sortValue:item_sort_val});
    loadDoctors({lookingFor: lookingFor});
});


$(".menu-btn").on('click', toggleCollapse);
function toggleCollapse()
{
    let collapseBtn = $(this).attr("data-collapseBtn");
    $(collapseBtn).toggleClass("fa-caret-circle-down");
    $(collapseBtn).toggleClass("fa-caret-circle-up");
}

$("#btnFilter").on("click", showOrHideFilter);
function showOrHideFilter()
{
    $('#filterBox').toggleClass("filterBox-default");
    $('#filterBox').toggleClass("filterBox-change");
}

$("input[name=State]").on('click', loadDistrict)
function loadDistrict()
{
    $("#District").html(`<option label="Select District"></option>`);
    state = $("input[name=State]:checked").val();
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


$("#Pin").on('keyup', loadAddress)
function loadAddress()
{
    document.getElementById('sub_options').innerHTML = "";
    document.getElementById('city_options').innerHTML = "";
    var pin = $("#Pin").val();
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

                $('#sub_options').html(sub);
                $('#city_options').html(city);
            },
        });
    }
}





var log = $("#display-username").text();
$("#result_doctors").on('click', ".star-zoom", addRating);
function addRating()
{
    if(log.length != 0)
    {
        var id = $(this).attr('data-id');
        var star = Number($(this).attr('data-rate'));
        var value = Number($(this).attr("data-value"));
        $.ajax({
            type:'POST',
            url: "/add-rating/",
            data:{
                'doctor': id,
                'star': value,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                if(response.status == 'success')
                {
                    $("#doctorRatings-"+id).html(response.ratings);
                    $("#doctorVotes-"+id).html(response.votes);
                    if(star == 1)
                    {
                        $(".star-zoom").removeClass('fas');
                        $(".star-zoom").addClass('far');
                        if(value == 0)
                        {
                            $("#star1"+id).attr({"data-original-title":"You Rated 0 Star"});
                            $("#star1"+id).tooltip('show');
                            $("#star1"+id).attr("data-value", "1");
                            $("#star1"+id).removeClass('fas');
                            $("#star1"+id).addClass('far');
                            $("#star1"+id).attr({"data-original-title":"Rate 1 Star"});
                        }
                        else
                        {
                            $("#star1"+id).attr({"data-original-title":"You Rated 1 Star"});
                            $("#star1"+id).tooltip('show');
                            $("#star1"+id).attr("data-value", "0");
                            $("#star1"+id).removeClass('far');
                            $("#star1"+id).addClass('fas');
                            $("#star1"+id).attr({"data-original-title":"Remove Rate"});
                        }
                    }
                    else if(star == 2)
                    {
                        $("#star2"+id).attr({"data-original-title":"You Rated 2 Star"});
                        $("#star2"+id).tooltip('show');
                        $("#star1"+id).attr("data-value", "1");
                        $("#star1"+id).removeClass('far');
                        $("#star1"+id).addClass('fas');
                        $("#star2"+id).removeClass('far');
                        $("#star2"+id).addClass('fas');
                        $("#star3"+id).removeClass('fas');
                        $("#star3"+id).addClass('far');
                        $("#star4"+id).removeClass('fas');
                        $("#star4"+id).addClass('far');
                        $("#star5"+id).removeClass('fas');
                        $("#star5"+id).addClass('far');
                        $("#star2"+id).attr({"data-original-title":"Rate 2 Star"});
                    }
                    else if(star == 3)
                    {
                        $("#star3"+id).attr({"data-original-title":"You Rated 3 Star"});
                        $("#star3"+id).tooltip('show');
                        $("#star1"+id).attr("data-value", "1");
                        $("#star1"+id).removeClass('far');
                        $("#star1"+id).addClass('fas');
                        $("#star2"+id).removeClass('far');
                        $("#star2"+id).addClass('fas');
                        $("#star3"+id).removeClass('far');
                        $("#star3"+id).addClass('fas');
                        $("#star4"+id).removeClass('fas');
                        $("#star4"+id).addClass('far');
                        $("#star5"+id).removeClass('fas');
                        $("#star5"+id).addClass('far');
                        $("#star3"+id).attr({"data-original-title":"Rate 3 Star"});
                    }
                    else if(star == 4)
                    {
                        $("#star4"+id).attr({"data-original-title":"You Rated 4 Star"});
                        $("#star4"+id).tooltip('show');
                        $("#star1"+id).attr("data-value", "1");
                        $("#star1"+id).removeClass('far');
                        $("#star1"+id).addClass('fas');
                        $("#star2"+id).removeClass('far');
                        $("#star2"+id).addClass('fas');
                        $("#star3"+id).removeClass('far');
                        $("#star3"+id).addClass('fas');
                        $("#star4"+id).removeClass('far');
                        $("#star4"+id).addClass('fas');
                        $("#star5"+id).removeClass('fas');
                        $("#star5"+id).addClass('far');
                        $("#star4"+id).attr({"data-original-title":"Rate 4 Star"});
                    }
                    else if(star == 5)
                    {
                        $("#star5"+id).attr({"data-original-title":"You Rated 5 Star"});
                        $("#star5"+id).tooltip('show');
                        $("#star1"+id).attr("data-value", "1");
                        $("#star1"+id).removeClass('far');
                        $("#star1"+id).addClass('fas');
                        $("#star2"+id).removeClass('far');
                        $("#star2"+id).addClass('fas');
                        $("#star3"+id).removeClass('far');
                        $("#star3"+id).addClass('fas');
                        $("#star4"+id).removeClass('far');
                        $("#star4"+id).addClass('fas');
                        $("#star5"+id).removeClass('far');
                        $("#star5"+id).addClass('fas');
                        $("#star5"+id).attr({"data-original-title":"Rate 5 Star"});
                    }
                }
            },
            error: function(response)
            {
            }
        });
    }
}


new Autocomplete('#autocomplete', {
    search: input => {
        let value = $("input[name=search-by-select]:checked").val();
        if(value == 'Name'){
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
                    const url = `/doctors/?${urlDecodedData}`
                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                        resolve(data.doctors)
                    })
                }
            });
        }
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
    loadDoctors({lookingFor: 'First Load'});
    selectSearchBy();
});

$(window).on("popstate", function () {
    isFirstLoad = true;
    loadDoctors({lookingFor: 'First Load'});
    selectSearchBy();
});










