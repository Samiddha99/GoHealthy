
$('.search-field').on('focus', function(){
    $('.advance-search-box').css('display', 'block');
    
});

$(document).on('mouseup', function(e) 
{
    if(window.innerWidth < 700)
    {
        var container = $(".filter-form");
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length == 0) 
        {
            $('.advance-search-box').css('display', 'none');
        }
    }
});


$("#results").on('keyup', ".set-before", hourMinuteInput);
$("#results").on('change', ".set-before", hourMinuteInput);
function hourMinuteInput(){
    $(".set-before-error").html('');
    let max = $(this).attr('max');
    let maxDigitLength = max.length;
    let value = $(this).val();
    if(value.length > maxDigitLength || value.length < maxDigitLength){
        value = Number(value).toString().padStart(maxDigitLength, '0');
        $(this).val(value);
    }
    let min = $(this).attr('min').padStart(maxDigitLength, '0');

    if(Number(value) > Number(max)){
        $(this).val(max)
    }
    if(Number(value) < Number(min)){
        $(this).val(min)
    }
}
$("#results").on('change', ".set-before", hourMinuteInputValidation);
$("#results").on('keyup', ".set-before", hourMinuteInputValidation);
function hourMinuteInputValidation(){
    let id = $(this).attr('data-id');
    $(`#set-reminder-form-submit-${id}`).prop('disabled', false);
    let hh = Number($(`#set-before-hh-${id}`).val());
    let mm = Number($(`#set-before-mm-${id}`).val());
    if(hh <= 0 && mm <= 0){
        $(`#set-before-error-${id}`).html(`You can set reminder minimum 30 minute before`);
        $(`#set-reminder-form-submit-${id}`).prop('disabled', true);
    }
}

$("#results").on("show.bs.modal", ".setReminderModal", function(){
    $(".set-reminder-form").trigger('reset');
});
$("#results").on("hide.bs.modal", ".setReminderModal", function(){
    $(".set-reminder-form").trigger('reset');
});
$("#results").on('reset', ".set-reminder-form", function(event){
    $(".set-reminder-form").prop('disabled', false)
    $(".set-reminder-form-submit").prop('disabled', false);
    $(".set-reminder-form-submit-text").html('SET');
    $(`.set-before-error`).html("");
    $(`.set-before-success`).html("");
    $(".add-to-calender-button").css('visibility', 'hidden');
});

$("#results").on('submit', ".set-reminder-form", function(event){
    event.preventDefault();
    let id = $(this).attr('data-id');
    let theForm = new FormData(this)
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    $(this).prop('disabled', true);
    $(`#set-reminder-form-submit-text-${id}`).html(`<i class="fa-regular fa-loader fa-spin"></i>`);
    $(`#set-reminder-form-submit-${id}`).prop('disabled', true);
    $(`#set-before-error-${id}`).html("");
    $(`#set-before-success-${id}`).html("");
    $.ajax(
        {
            type:'POST',
            url: "/set-blood-donation-camp-reminder/",
            data: theForm,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            success:function(response)
            {
                $(".set-reminder-form").prop('disabled', false);
                $(".set-reminder-form-submit-text").html("SET");
                $(".set-reminder-form-submit").prop('disabled', false);
                if(response.error == '0'){
                    $(`#alarm_reminder-${id}`).html(response.send_before_minute)
                    $(`.add-to-calender-button-${id}`).css('visibility', 'visible');
                    $(`#set-before-success-${id}`).html(response.message);
                }
                else if(response.error == '1'){
                    $(`#set-before-error-${id}`).html(response.message)
                }
                else{
                    $(`#set-before-error-${id}`).html("Error occurred. Try again!");
                }
            },
            error:function(response)
            {
                $(".set-reminder-form").prop('disabled', false);
                $(".set-reminder-form-submit-text").html("SET");
                $(".set-reminder-form-submit").prop('disabled', false);
                $(`#set-before-error-${id}`).html("Error occurred. Try again!");
            },
        });
});


var page = 1;
var total_page = 0;
var isFirstLoad = true;
var district = null;
var isLast = true;
var isFetchedPageLastRecord = false;


$("#filter").on('submit', function(e){
    e.preventDefault();
    var filter_searchBtn = document.getElementById("filter_search")
    dotMovingAnimation(filter_searchBtn, 4)
    isFirstLoad = true;
    page = 1
    lookingFor = 'Filter';
    updateURI({lookingFor: lookingFor});
    var f = function(){
        dotMovingAnimation(filter_searchBtn, 0);
        $("#filter_search").html('SEARCH');
    }
    searchBloodDonationCamps({callbacks: [f,]});
});

$('#filter-clear').on('click', function(){
    $("#filter").trigger('reset');
    var filter_clearBtn = document.getElementById("filter-clear");
    dotMovingAnimation(filter_clearBtn, 3);
    isFirstLoad = true;
    page = 1
    lookingFor = 'All';
    updateURI({lookingFor: lookingFor});
    var f = function(){
        dotMovingAnimation(filter_clearBtn, 0);
        $("#filter-clear").html('Clear');
    }
    searchBloodDonationCamps({callbacks: [f,]});
});

function resetVal(){
    $('#District').html(`<option label="Select District"></option>`);
    $('#sub_options').html('');
    $('#city_options').html('');
    $("#District").attr("data-toggle", "tooltip");
    $("#District").attr("data-placement", "top");
    $("#District").attr("title", "To Select District choose A State First");
}
$("#filter").on('reset', resetVal);


var worker_donation_camp_banks = new Worker('/static/javascripts/blood_donation_camps_worker.js');

function updateURI({lookingFor='first load'}={}){
    var targetURL = $("#filter").attr('action');
    if(lookingFor == 'All'){
        data = $(`[form='filter']`).serializeToJSON({
            parseBooleans: false,
        }); //get form data in json format
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

function searchBloodDonationCamps({callbacks=undefined}={}){
    $(".no-resuls-found").hide();
    $(".loading-skeleton").show();
    isLast = true;
    isFetchedPageLastRecord = false
    
    var targetURL = $("#filter").attr('action');
    $("#filter").trigger('reset');
    $('.search-field').trigger('mouseup')
    try{
        var search = location.search.substring(1); //get the url
        data = JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}'); //get data from uri in JSON format
        $("#filter").jsonToForm(data); //fiil the form from the json data
        district = data['District'];
        loadDistrict()
        loadAddress();
    }

    catch{
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
    $("#total-results").css("visibility", 'hidden');
    $.get(targetURL, data, function(donationCampData){
        $("#total-results-no").html(donationCampData.total);
        $("#total-results").css("visibility", 'visible');
        $(".loading-skeleton").hide();
        if(donationCampData.total == 0){
            if(isFirstLoad){
                $(".no-resuls-found").show();
            }
        }
        else{
            total_page = donationCampData['total_page'];
            if(page == 1){
                document.getElementById('div-results').scrollIntoView(true);
            }
            data = {
                'donationCamps': donationCampData.donationCamps,
            }
            worker_donation_camp_banks.postMessage(data);

            isLast = donationCampData['isLast'];
        }
        if(callbacks != undefined){
            for(i in callbacks){
                fun = callbacks[i];
                fun();
            }
        }
    });
}

worker_donation_camp_banks.addEventListener('message', function(e) {
    var data = e.data;
    isFetchedPageLastRecord = data['isLastRecord']
    $("#results").append(data['html']);
    if(isFetchedPageLastRecord){
        $(".loading-skeleton").hide();
        loadingMore = false;
    }
}, false);


$(window).on('scroll', function() {
    if ($(window).scrollTop() + 80 >= $('.div-results').offset().top + $('.div-results').outerHeight() - window.innerHeight) {
        if(((!isLast) && isFetchedPageLastRecord)){
            isFetchedPageLastRecord = false;
            page += 1;
            searchBloodDonationCamps();
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
    document.getElementById('sub_options').innerHTML = "";
    document.getElementById('city_options').innerHTML = "";
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
    
                $('#sub_options').html(sub);
                $('#city_options').html(city);            
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
                const url = `/blood-donation-camps/?${urlDecodedData}`
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
            ${result.Organizer}
        </li>
        `
        return renderedHtml;
    },
    getResultValue: result => result.Organizer,
});

$(document).ready(function(){
    isFirstLoad = true;
    page = 1
    updateURI()
    searchBloodDonationCamps();
});

$(window).on("popstate", function () {
    isFirstLoad = true;
    searchBloodDonationCamps();
});
