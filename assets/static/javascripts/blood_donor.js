
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
    loadDonors({lookingFor: lookingFor});
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


$("#filter").on('submit', function(event){
    event.preventDefault();
    page = 1;
    isFirstLoad = true;
    lookingFor = 'Filter';
    let item_sort_val = $(`.active[name='sort']`).attr('value')
    updateURI({lookingFor: lookingFor, sortValue:item_sort_val});
    loadDonors({lookingFor: lookingFor});
});
$(".item-sort").on('click', function(event){
    event.preventDefault();
    $(".item-sort").removeClass('active');
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
}
$("#filter").on('reset', resetVal);


var worker_load_donors = new Worker('/static/javascripts/blood_donors_worker.js');
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
        if(data["groups"] == true){
            groups = []
            $.each($('input[name="groups"]:checked'), function(){
                groups.push($(this).val());
            });
            data['groups'] = groups
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

function loadDonors({lookingFor='All', callbacks=undefined}={}){
    var targetURL = $("#filter").attr('action');
    $(".no-resuls-found").hide();
    $("#result_donors").html('');
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
        
        //group field is checkbox type, so we have to store all the groups in a array.
        splitDecode = decodedURI.split('","')
        groups = []
        for(i=0; i<splitDecode.length; i++){
            if(splitDecode[i].includes('groups')){
                groups.push(splitDecode[i].replace(/"/g, "").split(":")[1])
            }
        }
        data['groups'] = groups // update group array to group key of JSON data.
        $("#filter").jsonToForm(data); //fiil the form from the json data
        
        delete data['groups']
        data['groups[]'] = groups

        district = data['District'];
        loadDistrict();
        loadAddress();
        
        if('page' in data){
            page = data['page']
        }

        $(`[name='sort']`).removeClass('active');
        $(`[name='sort'][value='${data['sort']}']`).addClass('active');
    }
    catch(err){
        data = {}
    }
    data['action'] = "Donor_Search"
    data['isFirstLoad'] = isFirstLoad;
    $.get(targetURL, data, function(donorData){
        if(isFirstLoad){
            $("#id_result_total").html(donorData['total']);
        }
        
        if(donorData['total'] > 0){
            $("#div_pagination").show();
            $(".total-found").show();
        }
        else{
            $("#div_pagination").hide();
            $(".no-resuls-found").show();
            $(".total-found").hide();
        }
        if(donorData['count'] > 0){
            $("#text_filter").html(`Filter(${donorData['count']})`)
        }
        else{
            $("#text_filter").html('Filter')
        }
        $(".loading-image-background").css('display', 'none')
        document.body.style.overflowY = 'auto';
        sendData = {
            'donorData': donorData,
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
        }
        document.getElementById('result').scrollIntoView(true);
        if(isFirstLoad){
            total_page = Number(donorData['total_page'])
        }

        pagination = {
            'total_page': total_page,
            'current_page': page,
        }
        worker_update_pagination.postMessage(pagination); // Send data to worker.
        worker_load_donors.postMessage(sendData);

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
}, false)


worker_load_donors.addEventListener('message', function(e) {
    var data = e.data
    $(`#result_donors`).append(data['html']);
    document.getElementById("result_donors").scrollIntoView(true);
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
    page = Number(page)
    lookingFor = 'Filter';
    let item_sort_val = $(`.active[name='sort']`).attr('value')
    updateURI({lookingFor: lookingFor, sortValue:item_sort_val});
    loadDonors({lookingFor: lookingFor});
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
                const url = `/blood-donors/?${urlDecodedData}`
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                    resolve(data.donors)
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
    lisFirstLoad = true;
    page = 1
    updateURI()
    loadDonors({lookingFor: 'First Load'});
});

$(window).on("popstate", function () {
    isFirstLoad = true;
    loadDonors({lookingFor: 'First Load'});
});