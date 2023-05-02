var distance;
var varInterval;
var source;
var district = null;

var page = 1;

var log = $("#display-username").text();
var userType = String($('#UserType').val()).replace(/\[/g, "").replace(/\]/g, "").replace(/'/g, "").split(", ");
var generalUserTypes = String($('#generalUserTypes').val()).replace(/\[/g, "").replace(/\]/g, "").replace(/'/g, "").split(", ");
var specialUserTypes = String($('#specialUserTypes').val()).replace(/\[/g, "").replace(/\]/g, "").replace(/'/g, "").split(", ");
var bedSource;

var timer_running = 0;
timer = function (targetTime)
{
    // Update the count down every 1 second
    varInterval = setInterval(function(){
        var next = new Date(targetTime);
        var now = new Date();
        distance = next - now;
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        $(".book").html("<i class='fad fa-bed-alt'></i> " + hours + "h " + minutes + "m " + seconds + "s ");

        // If the count down is finished
        if (distance <= 0)
        {
            $(".book").html("<i class='fad fa-bed-alt'></i> Book Bed");
            clearInterval(varInterval);
        }
    }, 1000);
}

startTimer = function()
{
    const isSpecialUser = userType.some(r=> specialUserTypes.includes(r))
    if(!isSpecialUser)
    {
        var uri = `/events/now-book/`;
        var lastNowBookEventId = $("#event_id-nowBook").val();
        lastNowBookEventId = lastNowBookEventId.split(":")
        lastNowBookEventId = `${lastNowBookEventId[0]}:${lastNowBookEventId[1]-1}`
        source = new ReconnectingEventSource(uri, {lastEventId: lastNowBookEventId});
        source.addEventListener('message', function (event) {
            var ev = JSON.parse(event.data)
            if(ev['message'] == '1')
            {
                clearInterval(varInterval);
                $(".no-bed").html("<i class='fad fa-bed-alt'></i> No Bed");
                $(".book").html("<i class='fad fa-bed-alt'></i> Book Bed");
            }
            else if(ev['message'] == '0')
            {
                var nextTime = ev['nextTime'];
                timer(nextTime);
                
            }
        }, false);

    }
}
if(log.length != 0)
{
    $(document).ready(function () {
        startTimer();
    });
}


var latitude = 0;
var longitude = 0;
function LiveLocationSuccess(position) {
    latitude  = position.coords.latitude;
    longitude = position.coords.longitude;
    updateDirectionButton({id:'', updateAll:true});
}
function LiveLocationError() {
    console.log('Unable to retrieve your location. Check permissions on your browser. Allow the location permission');
}
function startLiveLocation(){
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
        if (result.state == 'granted') {
            startLiveLocation();
        }
        else if (result.state != 'granted'){
            alert("If you don't allow location, then you will not be able to do near by search");
        }
    }
});



function nearBySearch(){
    page = 1
    lookingFor = 'Near Me';
    let item_sort_val = $(`.active[name='sort']`).attr('value')
    updateURI({lookingFor: lookingFor, sortValue:item_sort_val});
    loadHospitals({lookingFor: lookingFor});
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


$("#filter").on('submit', function(event){
    event.preventDefault();
    page = 1
    lookingFor = 'Filter';
    let item_sort_val = $(`.active[name='sort']`).attr('value')
    updateURI({lookingFor: lookingFor, sortValue:item_sort_val});
    loadHospitals({lookingFor: lookingFor});
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
    $("#district_options").html();
    $("#city_options").html();
    $("#sub_options").html();
    $("#wardWith").html("<option label='Select Requirement'></option>");
    $("#wardWith").attr("data-toggle", "tooltip");
    $("#wardWith").attr("data-placement", "top");
    $("#wardWith").attr("title", "Select Ward First");
    $("#District").html(`<option label="Select District"></option>`);
    $("#District").attr("data-toggle", "tooltip");
    $("#District").attr("data-placement", "top");
    $("#District").attr("title", "To Select District choose A State First");
    document.getElementById('Bed_Availability').checked = false;
    document.getElementById('Antivenom_Availability').checked = false;
}
$("#filter").on('reset', resetVal);

$("#Bed_Availability").on('change', function(){
    if(this.checked){
        $("#ward").val('')
        $("#ward").trigger('change')
    }
})
$("#ward").on('change', function(){
    if(this.value != ''){
        document.getElementById('Bed_Availability').checked = false;
    }
})

var worker_load_hospitas = new Worker('/static/javascripts/hospitals_worker.js');
var worker_update_pagination = new Worker('/static/javascripts/Update_Pagination/update-pagination.js');

var sendData;

function updateURI({lookingFor='first load', sortValue=''}={}){
    if(sortValue == null || sortValue == undefined){
        sortValue = ''
    }
    data = {}
    console.log(sortValue)
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

        if(data["Bed_Availability"] == true){
            Bed_Availability = []
            $.each($('input[name="Bed_Availability"]:checked'), function(){            
                Bed_Availability.push($(this).val());
            });
            data['Bed_Availability'] = Bed_Availability
        }
        if(data["Antivenom_Availability"] == true){
            Antivenom_Availability = []
            $.each($('input[name="Antivenom_Availability"]:checked'), function(){            
                Antivenom_Availability.push($(this).val());
            });
            data['Antivenom_Availability'] = Antivenom_Availability
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

var department = '';
function loadHospitals({lookingFor='All', callbacks=undefined}={}){
    $(".no-resuls-found").hide();
    var targetURL = $("#filter").attr('action');
    $("#result_hospitals").html('');
    $(".loading-skeleton").css('display', 'block');
    $("#id_result_total").html('0')
    var data = {}
    if(lookingFor != 'First Load'){
        $(".loading-image-background").css('display', 'block')
        document.body.style.overflowY = 'hidden';
        showOrHideFilter()
    }
    $("#filter").trigger('reset');
    try{
        var search = location.search.substring(1); //get the url

        decodedURI = `{"${decodeURIComponent(search).replace(/=/g,'":"').replace(/&/g, '","')}"}` //decode uri to conver it to JSON
        data = JSON.parse(decodedURI); //get data from uri in JSON format 

        data['Bed_Availability'] = data['Bed_Availability[]']
        delete data['Bed_Availability[]']
        data['Antivenom_Availability'] = data['Antivenom_Availability[]']
        delete data['Antivenom_Availability[]']

        $("#filter").jsonToForm(data); //fiil the url from the json data
        $("#Name").val(data['Name']);
        $("#hospitalOwnership").val(data['hospitalOwnership']);

        district = data['District'];
        loadDistrict();
        loadAddress();
        addWardWith();
    }
    catch{
        data = {}
    }
    if('page' in data){
        page = data['page']
    }
    $(`[name='sort']`).removeClass('active');
    $(`[name='sort'][value='${data['sort']}']`).addClass('active');
    department = data['department']

    data['action'] = 'Hospital_Search'; //add new key value
    $.get(targetURL, data, function(hospitalData){
        $("#id_result_total").html(hospitalData['total']);
        if(hospitalData['count'] > 0){
            $("#text_filter").html(`Filter(${hospitalData['count']})`)
        }
        else{
            $("#text_filter").html('Filter')
        }
        if(hospitalData['total'] > 0){
            $("#div_pagination").show();
        }
        else{
            $("#div_pagination").hide();
            $(".no-resuls-found").show();
        }
        $(".loading-image-background").css('display', 'none')
        document.body.style.overflowY = 'auto';
        console.log(hospitalData)
        sendData = {
            'hospitalData': hospitalData,
            'department': department,
        }
        document.getElementById("result_hospitals").scrollIntoView(true);
        worker_update_pagination.postMessage(sendData['hospitalData']['pagination']); // Send data to worker.
        worker_load_hospitas.postMessage(sendData);

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


worker_load_hospitas.addEventListener('message', function(e) {
    var data = e.data
    $(`#result_hospitals`).append(data['html']);
    if(data['noMoreData']){
        $(".loading-skeleton").css('display', 'none');
    }
    else{
        updateBedData(data['hospital']);
        updateOxygenData(data['hospital']);
        updateDirectionButton({id:data['hospital'].id});
    }
}, false);  // show the data to UI, when worker send a data


$("#div_pagination").on('click', '.page-item', function(event){
    $(".page-item").removeClass('active');
    $(this).addClass('active');
    let page = $(this).attr('data-value');
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
    loadHospitals({lookingFor: lookingFor});
});


function updateDirectionButton({id, updateAll=false}={}){
    if(updateAll){
        $(".btn-direction").each(function(index, element){
            var destLocation = $(element).attr("data-dest");
            if((latitude == '' && longitude == '') || (latitude == undefined && longitude == undefined) || (latitude == null && longitude == null)){
                var href = `https://www.google.com/maps/@${destLocation}`;
            }
            else{
                var href = `https://www.google.com/maps/dir/${latitude},${longitude}/${destLocation}`;
            }
            $(element).attr('href', href);
        });
    }
    else{
        var destLocation = $(`#direction-${id}`).attr("data-dest");
        if((latitude == '' && longitude == '') || (latitude == undefined && longitude == undefined) || (latitude == null && longitude == null)){
            var href = `https://www.google.com/maps/@${destLocation}`;
        }
        else{
            var href = `https://www.google.com/maps/dir/${latitude},${longitude}/${destLocation}`;
        }
        $(`#direction-${id}`).attr('href', href);
    }
}


function updateOxygenData(Data){
    function writedata(oxygenRemain){
        var remain = Number(oxygenRemain["Oxygen_Remaining_Time"])
        if(remain > 43200*6){
            remain = "Enough"
        }
        else if(remain > 43200){
            remain = `${parseFloat((remain / 43200).toFixed(2))} Months`;
        }
        else if(remain > 1440){
            remain = `${parseFloat((remain / 1440).toFixed(2))} Days`;
        }
        else if(remain < 30){
            remain = `No Oxygen`
        }
        else if(remain < 60){
            remain = `${parseFloat(remain).toFixed(2)} Minutes`
        }
        else{
            remain = `${parseInt(remain / 60)} Hr ${parseInt(remain % 60)} Min`
        }
        $("#oxygenRemain"+oxygenRemain['id']).html(remain);
    }
    var oxygenData = null
    if(Array.isArray(Data)){
        for(var i=0; i < Data.length; i++){
            oxygenData =  Data[i];
            writedata(oxygenData);
        }
    }
    else if(typeof(Data) == "object"){
        oxygenData =  Data
        writedata(oxygenData);
    }
}
function updateBedData(Data){
    function writeData(allDeptbedsData){
        var bedData = allDeptbedsData['Departments'][department]
        var lastUpdate = formatDateTime(bedData["last_update"]);
        var key = bedData["id"]
        $("#lastUpdate-"+key).html(lastUpdate);

        // Female O2
        if(bedData["total_female_O2_available"] > 0)
        {
            $('#text-female-O2'+key).css('color', 'green');
            $('#text-female-O2'+key).css('font-weight', 'bold');
        }
        else
        {
            $('#text-female-O2'+key).css('color', 'red');
            $('#text-female-O2'+key).css('font-weight', 'normal');
        }
        $('#female-O2'+key).html(`${bedData["total_female_O2_available"]} / ${bedData["total_female_O2"]}`);

        // Female Non-O2
        if(bedData["total_female_NonO2_available"] > 0)
        {
            $('#text-female-NoO2'+key).css('color', 'green');
            $('#text-female-NoO2'+key).css('font-weight', 'bold');
        }
        else
        {
            $('#text-female-NoO2'+key).css('color', 'red');
            $('#text-female-NoO2'+key).css('font-weight', 'normal');
        }
        $('#female-NoO2'+key).html(`${bedData["total_female_NonO2_available"]} / ${bedData["total_female_NonO2"]}`);

        // Male O2
        if(bedData["total_male_O2_available"] > 0)
        {
            $('#text-male-O2'+key).css('color', 'green');
            $('#text-male-O2'+key).css('font-weight', 'bold');
        }
        else
        {
            $('#text-male-O2'+key).css('color', 'red');
            $('#text-male-O2'+key).css('font-weight', 'normal');
        }
        $('#male-O2'+key).html(`${bedData["total_male_O2_available"]} / ${bedData["total_male_O2"]}`);

        // Male Non-O2
        if(bedData["total_male_NonO2_available"] > 0)
        {
            $('#text-male-NoO2'+key).css('color', 'green');
            $('#text-male-NoO2'+key).css('font-weight', 'bold');
        }
        else
        {
            $('#text-male-NoO2'+key).css('color', 'red');
            $('#text-male-NoO2'+key).css('font-weight', 'normal');
        }
        $('#male-NoO2'+key).html(`${bedData["total_male_NonO2_available"]} / ${bedData["total_male_NonO2"]}`);

        // Child O2
        if(bedData["total_child_O2_available"] > 0)
        {
            $('#text-child-O2'+key).css('color', 'green');
            $('#text-child-O2'+key).css('font-weight', 'bold');
        }
        else
        {
            $('#text-child-O2'+key).css('color', 'red');
            $('#text-child-O2'+key).css('font-weight', 'normal');
        }
        $('#child-O2'+key).html(`${bedData["total_child_O2_available"]} / ${bedData["total_child_O2"]}`);

        // Child Non-O2
        if(bedData["total_child_NonO2_available"] > 0)
        {
            $('#text-child-NoO2'+key).css('color', 'green');
            $('#text-child-NoO2'+key).css('font-weight', 'bold');
        }
        else
        {
            $('#text-child-NoO2'+key).css('color', 'red');
            $('#text-child-NoO2'+key).css('font-weight', 'normal');
        }
        $('#child-NoO2'+key).html(`${bedData["total_child_NonO2_available"]} / ${bedData["total_child_NonO2"]}`);

        // ICU Ventilator
        if(bedData["total_icu_Venti_available"] > 0)
        {
            $('#text-icu-Ventilator'+key).css('color', 'green');
            $('#text-icu-Ventilator'+key).css('font-weight', 'bold');
        }
        else
        {
            $('#text-icu-Ventilator'+key).css('color', 'red');
            $('#text-icu-Ventilator'+key).css('font-weight', 'normal');
        }
        $('#icu-Ventilator'+key).html(`${bedData["total_icu_Venti_available"]} / ${bedData["total_icu_Venti"]}`);

        // ICU non-Ventilator
        if(bedData["total_icu_NonVenti_available"] > 0)
        {
            $('#text-icu-NoVentilator'+key).css('color', 'green');
            $('#text-icu-NoVentilator'+key).css('font-weight', 'bold');
        }
        else
        {
            $('#text-icu-NoVentilator'+key).css('color', 'red');
            $('#text-icu-NoVentilator'+key).css('font-weight', 'normal');
        }
        $('#icu-NoVentilator'+key).html(`${bedData["total_icu_NonVenti_available"]} / ${bedData["total_icu_NonVenti"]}`);

        // PICU Ventilator
        if(bedData["total_picu_Venti_available"] > 0)
        {
            $('#text-picu-Ventilator'+key).css('color', 'green');
            $('#text-picu-Ventilator'+key).css('font-weight', 'bold');
        }
        else
        {
            $('#text-picu-Ventilator'+key).css('color', 'red');
            $('#text-picu-Ventilator'+key).css('font-weight', 'normal');
        }
        $('#picu-Ventilator'+key).html(`${bedData["total_picu_Venti_available"]} / ${bedData["total_picu_Venti"]}`);

        // PICU Non-Ventilator
        if(bedData["total_picu_NonVenti_available"] > 0)
        {
            $('#text-picu-NoVentilator'+key).css('color', 'green');
            $('#text-picu-NoVentilator'+key).css('font-weight', 'bold');
        }
        else
        {
            $('#text-picu-NoVentilator'+key).css('color', 'red');
            $('#text-picu-NoVentilator'+key).css('font-weight', 'normal');
        }
        $('#picu-NoVentilator'+key).html(`${bedData["total_picu_NonVenti_available"]} / ${bedData["total_picu_NonVenti"]}`);

        // NICU Ventilator
        if(bedData["total_nicu_Venti_available"] > 0)
        {
            $('#text-nicu-Ventilator'+key).css('color', 'green');
            $('#text-nicu-Ventilator'+key).css('font-weight', 'bold');
        }
        else
        {
            $('#text-nicu-Ventilator'+key).css('color', 'red');
            $('#text-nicu-Ventilator'+key).css('font-weight', 'normal');
        }
        $('#nicu-Ventilator'+key).html(`${bedData["total_nicu_Venti_available"]} / ${bedData["total_nicu_Venti"]}`);

        // NICU Non-Ventilator
        if(bedData["total_nicu_NonVenti_available"] > 0)
        {
            $('#text-nicu-NoVentilator'+key).css('color', 'green');
            $('#text-nicu-NoVentilator'+key).css('font-weight', 'bold');
        }
        else
        {
            $('#text-nicu-NoVentilator'+key).css('color', 'red');
            $('#text-nicu-NoVentilator'+key).css('font-weight', 'normal');
        }
        $('#nicu-NoVentilator'+key).html(`${bedData["total_nicu_NonVenti_available"]} / ${bedData["total_nicu_NonVenti"]}`);

        if(bedData["total_available"] <= 0)
        {
            $('#bedBookBtn'+key).addClass('disabled');
            $("#bedBookBtn"+key).removeClass("book");
            $("#bedBookBtn"+key).addClass("no-bed");
            $('#bedBookBtn'+key).html("<i class='fad fa-bed-alt'></i> No Bed");
        }
        else
        {
            $('#bedBookBtn'+key).removeClass('disabled');
            $("#bedBookBtn"+key).removeClass("no-bed");
            $("#bedBookBtn"+key).addClass("book");
            if(typeof(varInterval) != undefined){
                $('#bedBookBtn'+key).html("<i class='fad fa-bed-alt'></i> Book Bed")
            }
        }
        
    }
    var bedData = null
    if(Array.isArray(Data)){
        for(var i=0; i < Data.length; i++){
            bedData =  Data[i]
            writeData(bedData)
        }
    }
    else if(typeof(Data) == "object"){
        bedData =  Data
        writeData(bedData)
    }
}


var liveBedData =  function() {

    var uri = `/events/live-bed/`;
    bedSource = new ReconnectingEventSource(uri);
    bedSource.addEventListener('message', function (e) {
        bedData = JSON.parse(e.data)
        if(bedData['OxygenUpdate'] == '1')
        {
            updateOxygenData(bedData)
        }
        else
        {
            updateBedData(bedData)
        }
    }, false);
}

$(document).ready(function(){
    liveBedData();
});


function showTooltipBook()
{
    if(log.length == 0)
    {
        var ele = $('.book');
        ele.attr("data-toggle", "tooltip");
        ele.attr("data-placement", "top");
        ele.attr("data-original-title", "Login Required");
    }
}
showTooltipBook();




function addWardWith()
{
    let ward = $('#ward').val();
    var select = document.getElementById('wardWith');
    select.innerHTML = "<option label='Select Requirement'></option>";
    $("#wardWith").removeAttr("data-toggle");
    $("#wardWith").removeAttr("data-placement");
    $("#wardWith").removeAttr("title");
    if(ward == 'ICU' || ward == 'PICU' || ward == 'NICU')
    {
        let option1 = "<option value='With Ventilator'>With Ventilator</option>";
        let option2 = "<option value='Non-Ventilator'>Non-Ventilator</option>";
        let option3 = "<option value='Both'>Both</option>";
        select.innerHTML += option1 + option2 + option3;
    }
    else if(ward == 'Female Ward' || ward == 'Male Ward' || ward == 'Child Ward')
    {
        let option1 = "<option value='With Oxygen'>With Oxygen</option>";
        let option2 = "<option value='Non-Oxygen'>Non-Oxygen</option>";
        let option3 = "<option value='Both'>Both</option>";
        select.innerHTML += option1 + option2 + option3;
    }
    else if(ward == 'All Wards')
    {
        let option1 = "<option value='With Oxygen'>With Oxygen</option>";
        let option2 = "<option value='Non-Oxygen'>Non-Oxygen</option>";
        let option3 = "<option value='With Ventilator'>With Ventilator</option>";
        let option4 = "<option value='Non-Ventilator'>Non-Ventilator</option>";
        select.innerHTML += option1 + option2 + option3 + option4;
    }
    else
    {
        $("#wardWith").attr("data-toggle", "tooltip");
        $("#wardWith").attr("data-placement", "top");
        $("#wardWith").attr("title", "Select Ward First");
    }
    return true;
}
$('#ward').on('change', addWardWith)



var speed = 1000;
function ruleShow_1()
{
    $('#rule1').removeClass('rule-none');
    $('#rule1').addClass('rule-block');
    document.getElementById('rule1').style.visibility = 'visible';
}
function ruleHide_1()
{
    $('#rule1').removeClass('rule-block');
    $('#rule1').addClass('rule-none');
    document.getElementById('rule1').style.visibility = 'hidden';
}

function ruleShow_2()
{
    $('#rule2').removeClass('rule-none');
    $('#rule2').addClass('rule-block');
    document.getElementById('rule2').style.visibility = 'visible';
}
function ruleHide_2()
{
    $('#rule2').removeClass('rule-block');
    $('#rule2').addClass('rule-none');
    document.getElementById('rule2').style.visibility = 'hidden';
}

function ruleShow_3()
{
    $('#rule3').removeClass('rule-none');
    $('#rule3').addClass('rule-block');
    document.getElementById('rule3').style.visibility = 'visible';
}
function ruleHide_3()
{
    $('#rule3').removeClass('rule-block');
    $('#rule3').addClass('rule-none');
    document.getElementById('rule3').style.visibility = 'hidden';
}

function Animation()
{
    var nextShowRule1 = setTimeout(function(){
        ruleShow_1();
    },1000);

    var nextShowRule2 = setTimeout(function(){
        ruleShow_2();
    },2000);

    var nextShowRule3 = setTimeout(function(){
        ruleShow_3();
    },3000);

    var zoomIn1 = setTimeout(function(){
        document.getElementById('rule1').style.transform = "scale(1.05)";
    },4000);

    var zoomIn2 = setTimeout(function(){
        document.getElementById('rule1').style.transform = "scale(1)";
        document.getElementById('rule2').style.transform = "scale(1.05)";
    },4900);

    var zoomIn3 = setTimeout(function(){
        document.getElementById('rule2').style.transform = "scale(1)";
        document.getElementById('rule3').style.transform = "scale(1.05)";
    },5800);

    var zoomOut3 = setTimeout(function(){
        document.getElementById('rule3').style.transform = "scale(1)";
    },6700);

    var nextHideRule3 = setTimeout(function(){
        ruleHide_3()
    },15000);

    var nextHideRule2 = setTimeout(function(){
        ruleHide_2()
    },16000);

    var nextHideRule1 = setTimeout(function(){
        ruleHide_1()
    },17000);
}
function startAnimation()
{
    Animation();
    var startRuleAnimation = setInterval(function(){
        Animation();
    },17500);
    return true;
}
$(document).ready(startAnimation)

function showOrHideFilter()
{
    $("#filter-area").toggleClass("filter-box-hide");
    $("#filter-area").toggleClass("filter-box-show");
}
$("#btnFilter").on('click', showOrHideFilter)



function loadDistrict()
{
    $("#District").html(`<option label="Select District"></option>`);
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
$("#State").on('change', loadDistrict);


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

                document.getElementById('sub_options').innerHTML = sub;
                document.getElementById('city_options').innerHTML = city;            
            },
        });
    }
}
$("#Pin").on('change', loadAddress);


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
                const url = `/hospitals/?${urlDecodedData}`
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                    resolve(data.hospitals)
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
    page = 1
    updateURI()
    loadHospitals({lookingFor: 'First Load'});
});

$(window).on("popstate", function () {
    loadHospitals({lookingFor: 'First Load'});
});
