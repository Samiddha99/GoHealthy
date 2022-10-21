
function currentDateTime()
{
    var dt = new Date();
    var hours = dt.getHours();
    var minutes = dt.getMinutes();
    var seconds = dt.getSeconds()
    var ampm = hours >= 12 ? 'PM' : 'AM'; //AM or PM
    hours = hours % 12; //convert in 12-hour format;
    hours = hours ? hours : 12; //display 0 as 12
    day = dt.toLocaleString('default', { day: 'numeric' });
    month = dt.toLocaleString('default', { month: 'short' });
    year = dt.toLocaleString('default', { year: 'numeric' });
    
    dt = `${(day <= 9) ? '0'+day : day} ${(month <= 9) ? '0'+month : month} ${(year <= 9) ? '0'+year : year}, ${(hours <= 9) ? '0'+hours : hours}:${(minutes <= 9) ? '0'+minutes : minutes}:${(seconds <= 9) ? '0'+seconds : seconds} ${ampm}`;
    return dt;
}
$(document).ready(function(){
    var liveCurrentTime = setInterval(function(){
        currentTime = currentDateTime();
        $("#current_time").html(`${currentTime}`);
    }, 1000);
});


var liveDataSource;
var liveData =  function() {
    var uri = `/events/live-data/`;
    // var lastLiveDataEventId = $("#event_id-live-data").val();
    // lastLiveDataEventId = lastLiveDataEventId.split(":")
    // lastLiveDataEventId = `${lastLiveDataEventId[0]}:${lastLiveDataEventId[1]-1}`
    liveDataSource = new ReconnectingEventSource(uri);
    liveDataSource.addEventListener('message', function (event) {
        var eventData = JSON.parse(event.data);

        if(eventData['hospital_changed'] == '1')
        {
            $('#totalHospitalCount').html(eventData['total_hospital']);
        }
        if(eventData['bloodBank_changed'] == '1')
        {
            $('#totalBloodBankCount').html(eventData['total_bloodBank']);
        }
        if(eventData['donor_changed'] == '1')
        {
            $('#totalDonorCount').html(eventData['total_donor']);
        }
        if(eventData['doctor_changed'] == '1')
        {
            $('#totalDoctorCount').html(eventData['total_doctor']);
        }
        if(eventData['beds_changed'] == '1')
        {
            $('#totalBedsCount').html(eventData['total_beds']);
        }
        if(eventData['availableBeds_changed'] == '1')
        {
            $('#totalAvailableBedsCount').html(eventData['total_availableBeds']);
        }
        if(eventData['usedBeds_changed'] == '1')
        {
            $('#totalUsedBedsCount').html(eventData['total_usedBeds']);
        }
        if(eventData['bloodDonationCamp_changed'] == '1')
        {
            $('#totalBloodDonationCampCount').html(eventData['total_bloodDonationCamp']);
        }
        if(eventData['bloodRequest_changed'] == '1')
        {
            $('#totalBloodRequestCount').html(eventData['total_bloodRequest']);
        }
        if(eventData['book_changed'] == '1')
        {
            $('#totalBookCount').html(eventData['total_book']);
        }
        if(eventData['admit_changed'] == '1')
        {
            $('#totalAdmitCount').html(eventData['total_admit']);
        }
        if(eventData['released_changed'] == '1')
        {
            $('#totalReleasedCount').html(eventData['total_released']);
        }
        if(eventData['referred_changed'] == '1')
        {
            $('#totalReferredCount').html(eventData['total_referred']);
        }
        if(eventData['died_changed'] == '1')
        {
            $('#totalDiedCount').html(eventData['total_died']);
        }
        if(eventData['bloodDonated_changed'] == '1')
        {
            $('#totaLBloodDonatedCount').html(eventData['total_bloodDonated']);
        }
        if(eventData['bloodCollected_changed'] == '1')
        {
            $('#totalBloodCollectedCount').html(eventData['total_bloodCollected']);
        }
        if(eventData['visitor_changed'] == '1')
        {
            updateTotalVisitor(eventData['total_visitor']);
        }
        $("#last_update").html(`${currentDateTime()}`);
    }, false);
}
$(document).ready(function(){
    liveData();
});


$(".input-graph").on('change', function(){
    data_district = $(this).attr('data-state_district');
    if(data_district != undefined){
        state = $(this).val();
        $(data_district).html(`<option label="Select District"></option>`);
        if(state != '' && state != "India"){
            $.ajax({
                url:"/get-district/",
                data:{
                    'state':state,
                },
                dataType: 'json',
                cache: false,
                success: function(response)
                {
                    for(var i in response.districts)
                    {
                        $(data_district).append(`<option value="${response.districts[i]}">${response.districts[i]}</option>`)
                    }
                },
            }); 
        }
    }

    data_blood_bank = $(this).attr('data-blood_bank');
    if(data_blood_bank != undefined){
        data_state = $(data_blood_bank).attr('data-state')
        data_district = $(data_blood_bank).attr('data-district')
        state = $(data_state).val();
        district = $(data_district).val();
        $(data_blood_bank).html(`<option label="Select Blood Bank"></option>`)
        if(state == "India" || state == ''){
            $(data_blood_bank).attr('data-placement', 'top');
            $(data_blood_bank).attr('data-toggle', 'tooltip');
            $(data_blood_bank).attr('tooltip', 'At first select a state');
        }
        else{
            $(data_blood_bank).removeAttr('data-placement');
            $(data_blood_bank).removeAttr('data-toggle');
            $(data_blood_bank).removeAttr('tooltip');
            $.ajax({
                url:"/get-blood-banks-by-state/",
                data:{
                    state: state,
                    district: district,
                },
                dataType: 'json',
                cache: false,
                success: function(response){
                    bloodBanks = response.bloodBanks;
                    for(i=0; i<bloodBanks.length; i++){
                        $(data_blood_bank).append(`<option value="${bloodBanks[i].id}">${bloodBanks[i].Name}</option>`)
                    }
                },
                error: function(){
    
                }
            });
        }
    }

    data_hospital = $(this).attr('data-hospital');
    if(data_hospital != undefined){
        data_state = $(data_hospital).attr('data-state')
        data_district = $(data_hospital).attr('data-district')
        state = $(data_state).val();
        district = $(data_district).val();
        $(data_hospital).html(`<option label="Select Hospital"></option>`)
        if(state == "India" || state == ''){
            $(data_hospital).attr('data-placement', 'top');
            $(data_hospital).attr('data-toggle', 'tooltip');
            $(data_hospital).attr('tooltip', 'At first select a state');
        }
        else{
            $(data_hospital).removeAttr('data-placement');
            $(data_hospital).removeAttr('data-toggle');
            $(data_hospital).removeAttr('tooltip');
            $.ajax({
                url:"/get-hospitals-by-state/",
                data:{
                    state: state,
                    district: district,
                },
                dataType: 'json',
                cache: false,
                success: function(response){
                    hospitals = response.hospitals;
                    for(i=0; i<hospitals.length; i++){
                        $(data_hospital).append(`<option value="${hospitals[i].id}">${hospitals[i].Name}</option>`)
                    }
                },
                error: function(){
    
                }
            });
        }
    }
});

$("select[name=x_axis]").on('change', function(){
    value = $(this).val();
    data_month = String($(this).attr("data-month"));
    data_year = String($(this).attr("data-year"));
    $(`#div_${data_month}`).hide();
    $(`#div_${data_year}`).hide();

    $(`#${data_year} option`).each(function () {
        if (this.defaultSelected) {
            this.selected = true;
            return false;
        }
    });
    $(`#${data_month} option`).each(function () {
        if (this.defaultSelected) {
            this.selected = true;
            return false;
        }
    });

    if(value == "day"){
        $(`#div_${data_month}`).show();
        $(`#div_${data_year}`).show();
    }
    else if(value == "month"){
        $(`#div_${data_year}`).show();
    }
});



function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "K", "M", "B", "T", "P", "E" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }
    return number;
}

var load_graph_asynchronously = true;
// Set graph saved filename.
anychart.exports.filename('Go-Healthy Statictics Graph');

var chart_BloodDonatedandCollected;
function filename_bloodDonatedandCollected(){
    y = $("#donation_collection-y option:selected").html();
    state = $("#donation_collection-state").val();
    district = $("#donation_collection-district").val();
    x = $("#donation_collection-x").val();
    month = $("#donation_collection-x_month").val();
    year = $("#donation_collection-x_year").val();
    date = ''
    if(x == 'day'){
        date = `${month} ${year}`;
    }
    else if(x = 'month'){
        date = `${year}`;
    }
    if(state != 'India'){
        if(district != ''){
            state = `${state}, ${district}`
        }
        else{
            state = `${state}`
        }
    }
    file_name = `Graph-Blood_Donation_Collection-${date} - ${state} (${y})`;
    return file_name;
}
$("#donation_collection-png").on('click', function(){
    file_name = filename_bloodDonatedandCollected();
    chart_BloodDonatedandCollected.saveAsPng({quality:1, filename:file_name})
});
$("#donation_collection-svg").on('click', function(){
    file_name = filename_bloodDonatedandCollected();
    chart_BloodDonatedandCollected.saveAsSvg({filename:file_name})
});
$("#donation_collection-pdf").on('click', function(){
    file_name = filename_bloodDonatedandCollected();
    chart_BloodDonatedandCollected.saveAsPdf({paperSizeOrWidthOrOptions:"a4", filename:file_name});
});
$("#donation_collection-csv").on('click', function(){
    file_name = filename_bloodDonatedandCollected();
    csvSettings = {
        "rowsSeparator": "\n",
        "columnsSeparator": ",",
    }
    chart_BloodDonatedandCollected.saveAsCsv(chartDataExportMode="raw", csvSettings=csvSettings, filename=file_name);
});
$("#donation_collection-xlsx").on('click', function(){
    file_name = filename_bloodDonatedandCollected();
    chart_BloodDonatedandCollected.saveAsXlsx(chartDataExportMode="default", filename=file_name)
});
$("#donation_collection-xml").on('click', function(){
    file_name = filename_bloodDonatedandCollected();
    chart_BloodDonatedandCollected.saveAsXml(filename=file_name)
});
$("#donation_collection-json").on('click', function(){
    file_name = filename_bloodDonatedandCollected();
    chart_BloodDonatedandCollected.saveAsJson(filename=file_name)
});
$("#donation_collection-print").on('click', function(){
    chart_BloodDonatedandCollected.print(paperSizeOrWidth='A4', landscapeOrHeight=true)
});
function loadGraph_bloodDonatedandCollected({raw_data, chart_title, group_by, x_axis, x_label, y_axis, y_label, error=null, month='', year=''}={}) {
    // chart type
    chart_BloodDonatedandCollected = anychart.column();

    try{
        // enable animation and set animation duration to 2 sec
        chart_BloodDonatedandCollected.animation(true, 2000);

        // set the chart title
        var title = chart_BloodDonatedandCollected.title();
        title.enabled(true);
        title.useHtml(true);
        title.text(chart_title);
        title.padding(13, 0, 5, 0)
        //title.fontSize(12);

        // set the titles of the axes
        chart_BloodDonatedandCollected.xAxis().title(x_label);
        chart_BloodDonatedandCollected.yAxis().title(y_label);
        chart_BloodDonatedandCollected.xAxis().title().fontColor("gray");
        chart_BloodDonatedandCollected.yAxis().title().fontColor("gray");

        // set the orientation of the axis label
        chart_BloodDonatedandCollected.yAxis().orientation("left");
        chart_BloodDonatedandCollected.xAxis().orientation("bottom");

        // adjusting axes labels
        chart_BloodDonatedandCollected.yAxis().labels().fontSize(11);
        chart_BloodDonatedandCollected.yAxis().labels().rotation(-90);
        chart_BloodDonatedandCollected.yAxis().labels().padding(0,20,0,0);
        chart_BloodDonatedandCollected.xAxis().labels().fontSize(11);
        chart_BloodDonatedandCollected.xAxis().labels().rotation(-45);
        chart_BloodDonatedandCollected.xAxis().labels().padding(0,0,0,0);

        var credits = chart_BloodDonatedandCollected.credits();
        credits.enabled(false);

        // create a label
        var label = chart_BloodDonatedandCollected.label(1);
        label.padding(0, 0, 1.5, 8);
        label.position("left-bottom");
        label.anchor("left-bottom");
        label.hAlign("left");
        label.useHtml(true);
        label.text(`<p>* Blood donations or collections that have not been made in any blood banks, data regarding thats are not shown on the graph.</p>`);
        label.fontColor("gray");
        label.fontSize(11);
        label.offsetY(0);
        label.offsetX(0);
        label.width('100%');
        label.wordWrap('break-word');
        label.wordBreak('normal');
        // another way of setting everything with JSON
        label.background({
            "enabled": true,
            "fill": 'white'});

         // create a time label
         var label = chart_BloodDonatedandCollected.label(2);
         label.padding(5, 15, 0, 0);
         label.position("right-top");
         label.anchor("right-top");
         label.hAlign("center");
         label.useHtml(true);
         label.text(`<p>Last Fetch: ${currentDateTime()}</p>`);
         label.fontColor("gray");
         label.fontSize(12);
         label.offsetY(0);
         label.offsetX(0);
         // another way of setting everything with JSON
         label.background({
             "enabled": true,
             "fill": 'white'});

        // enable context menu
        chart_BloodDonatedandCollected.contextMenu(true);

        // Update context menu
        contextMenu = chart_BloodDonatedandCollected.contextMenu()
        contextMenu.itemsFormatter(function(items){
            // remove about and separator 
            delete items["full-screen-separator"];
            delete items["about"];
            delete items['save-chart-as']['subMenu']["save-chart-as-jpg"];

            // change text of "Save chart as..."
            items["print-chart"].text = "Print Graph";

            // modify item action
            items['save-chart-as']['subMenu']["save-chart-as-png"].action = function() {
                file_name = filename_bloodDonatedandCollected();
                chart_BloodDonatedandCollected.saveAsPng({quality:1, filename:file_name})
            };
            items['save-chart-as']['subMenu']["save-chart-as-svg"].action = function() {
                file_name = filename_bloodDonatedandCollected();
                chart_BloodDonatedandCollected.saveAsSvg({filename:file_name})
            };
            items['save-chart-as']['subMenu']["save-chart-as-pdf"].action = function() {
                file_name = filename_bloodDonatedandCollected();
                chart_BloodDonatedandCollected.saveAsPdf({paperSizeOrWidthOrOptions:"a4", filename:file_name});
            };
            items['save-data-as']['subMenu']["save-data-as-text"].action = function() {
                file_name = filename_bloodDonatedandCollected();
                csvSettings = {
                    "rowsSeparator": "\n",
                    "columnsSeparator": ",",
                }
                chart_BloodDonatedandCollected.saveAsCsv(chartDataExportMode="raw", csvSettings=csvSettings, filename=file_name);
            };
            items['save-data-as']['subMenu']["save-data-as-xlsx"].action = function() {
                file_name = filename_bloodDonatedandCollected();
                chart_BloodDonatedandCollected.saveAsXlsx(chartDataExportMode="default", filename=file_name)
            };
            
            // return modified array
            return items;
        });

        
        if(error != null){
            throw `Data Load Error`;
        }
        else if(raw_data.length <= 0){
            noDataLabel = chart_BloodDonatedandCollected.noData().label();
            noDataLabel.enabled(true);
            noDataLabel.text("No Data");
            noDataLabel.background().enabled(true);
            noDataLabel.background().fill("White 1");
            noDataLabel.background().stroke("2 gray");
            noDataLabel.padding(20);
            noDataLabel.fontSize(30);
            noDataLabel.fontColor("gray");
            noDataLabel.fontVariant("small-caps");
        }
        else{
            // create a data set
            var data = anychart.data.set(raw_data);

            // map the data
            //var seriesData_1 = data.mapAs({x: 0, value: 1, fill: 3, stroke: 5, label: 6}); //Name of the first columns (x) will be the 0th item of the array, and value will be the 1th item of the array
            //var seriesData_2 = data.mapAs({x: 0, value: 2, fill: 4, stroke: 5, label: 6}); //Name of the second columns (x) will be the 0th item of the array, and value will be the 2th item of the array
            
            // map data for the each series
            var seriesData_1 = data.mapAs({x: 0, value: 1});
            var seriesData_2 = data.mapAs({x: 0, value: 2});
            var seriesData_3 = data.mapAs({x: 0, value: 3});
            var seriesData_4 = data.mapAs({x: 0, value: 4});
            var seriesData_5 = data.mapAs({x: 0, value: 5});
            var seriesData_6 = data.mapAs({x: 0, value: 6});

            // set data
            var series_data_1 = chart_BloodDonatedandCollected.column(seriesData_1);
            var series_data_2 = chart_BloodDonatedandCollected.column(seriesData_2);
            var series_data_3 = chart_BloodDonatedandCollected.column(seriesData_3);
            var series_data_4 = chart_BloodDonatedandCollected.column(seriesData_4);
            var series_data_5 = chart_BloodDonatedandCollected.column(seriesData_5);
            var series_data_6 = chart_BloodDonatedandCollected.column(seriesData_6);
            
            //configure tooltip title
            if(x_axis == 'day'){
                tooltipTitle = `{%x}, ${month}, ${year}:`;
            }
            else if(x_axis == 'month'){
                tooltipTitle = `{%x}, ${year}:`;
            }
            else{
                tooltipTitle = `{%x}:`
            }
            chart_BloodDonatedandCollected.tooltip().titleFormat(tooltipTitle);

            if(group_by == "Gender"){
                series_data_1.name(`Blood donated by other gender donors`);
                series_data_2.name(`Blood donated by female donors`);
                series_data_3.name(`Blood donated by male donors`);
                series_data_4.name(`Blood collected for other gender patients`);
                series_data_5.name(`Blood collected for female patients`);
                series_data_6.name(`Blood collected for male patients`);
                // configure tooltip text for each stacks
                if(y_axis == 'Units'){
                    series_data_1.tooltip().format(`{%value} ${y_axis} blood ({%yPercentOfCategory}{decimalsCount:2}% of total donated blood) donated by other gender donors`);
                    series_data_2.tooltip().format(`{%value} ${y_axis} blood ({%yPercentOfCategory}{decimalsCount:2}% of total donated blood) donated by female donors`);
                    series_data_3.tooltip().format(`{%value} ${y_axis} blood ({%yPercentOfCategory}{decimalsCount:2}% of total donated blood) donated by male donors`);
                    series_data_4.tooltip().format(`{%value} ${y_axis} blood ({%yPercentOfCategory}{decimalsCount:2}% of total collected blood) collected for other gender patients`);
                    series_data_5.tooltip().format(`{%value} ${y_axis} blood ({%yPercentOfCategory}{decimalsCount:2}% of total collected blood) collected for female patients`);
                    series_data_6.tooltip().format(`{%value} ${y_axis} blood ({%yPercentOfCategory}{decimalsCount:2}% of total collected blood) collected for male patients`);
                }
                else if(y_axis == 'Persons'){
                    series_data_1.tooltip().format(`{%value} other gender blood donors ({%yPercentOfCategory}{decimalsCount:2}% of total donors) donated blood`);
                    series_data_2.tooltip().format(`{%value} female blood donors ({%yPercentOfCategory}{decimalsCount:2}% of total donors) donated blood`);
                    series_data_3.tooltip().format(`{%value} male blood donors ({%yPercentOfCategory}{decimalsCount:2}% of total donors) donated blood`);
                    series_data_4.tooltip().format(`Blood collected for {%value} other gender patients ({%yPercentOfCategory}{decimalsCount:2}% of total blood collection)`);
                    series_data_5.tooltip().format(`Blood collected for {%value} female patients ({%yPercentOfCategory}{decimalsCount:2}% of total blood collection)`);
                    series_data_6.tooltip().format(`Blood collected for {%value} male patients ({%yPercentOfCategory}{decimalsCount:2}% of total blood collection)`);
                }
            }
            else if(group_by == "Age"){
                series_data_1.name(`Blood donated by donors of age group greater than 45`);
                series_data_2.name(`Blood donated by donors of age group 31 - 45`);
                series_data_3.name(`Blood donated by donors of age group less than 31`);
                series_data_4.name(`Blood collected for patients of age group greater than 45`);
                series_data_5.name(`Blood collected for patients of age group 31 - 45`);
                series_data_6.name(`Blood collected for patients of age group less than 31`);
                // configure tooltip text for each stacks
                if(y_axis == 'Units'){
                    series_data_1.tooltip().format(`{%value} ${y_axis} blood ({%yPercentOfCategory}{decimalsCount:2}% of total donated blood) donated by donors of age group greater than 45 years`);
                    series_data_2.tooltip().format(`{%value} ${y_axis} blood ({%yPercentOfCategory}{decimalsCount:2}% of total donated blood) donated by donors of age group 31 - 45 years`);
                    series_data_3.tooltip().format(`{%value} ${y_axis} blood ({%yPercentOfCategory}{decimalsCount:2}% of total donated blood) donated by donors of age group less than 31 years`);
                    series_data_4.tooltip().format(`{%value} ${y_axis} blood ({%yPercentOfCategory}{decimalsCount:2}% of total collected blood) collected for patients of age group greater than 45 years`);
                    series_data_5.tooltip().format(`{%value} ${y_axis} blood ({%yPercentOfCategory}{decimalsCount:2}% of total collected blood) collected for patients of age group 31 - 45 years`);
                    series_data_6.tooltip().format(`{%value} ${y_axis} blood ({%yPercentOfCategory}{decimalsCount:2}% of total collected blood) collected for patients of age group less than 31 years`);
                }
                else if(y_axis == 'Persons'){
                    series_data_1.tooltip().format(`{%value} blood donors of age group greater than 45 years ({%yPercentOfCategory}{decimalsCount:2}% of total donors) donated blood in {%x}`);
                    series_data_2.tooltip().format(`{%value} blood donors of age group 31 - 45 years ({%yPercentOfCategory}{decimalsCount:2}% of total donors) donated blood in {%x}`);
                    series_data_3.tooltip().format(`{%value} blood donors of age group less than 31 years ({%yPercentOfCategory}{decimalsCount:2}% of total donors) donated blood in {%x}`);
                    series_data_4.tooltip().format(`{%value} patients of age group greater than 45 years ({%yPercentOfCategory}{decimalsCount:2}% of total blood collection) received blood in {%x}`);
                    series_data_5.tooltip().format(`{%value} patients of age group 31 - 45 years ({%yPercentOfCategory}{decimalsCount:2}% of total blood collection) received blood in {%x}`);
                    series_data_6.tooltip().format(`{%value} patients of age group less than 31 years ({%yPercentOfCategory}{decimalsCount:2}% of total blood collection) received blood in {%x}`);
                }
            }

            // color the columns
            series_data_1.fill("#ff9933");
            series_data_2.fill("#1a8cff");
            series_data_3.fill("#ff66d9");
            series_data_4.fill("#e6ac00");
            series_data_5.fill("#9933ff");
            series_data_6.fill("#ff5050");

            series_data_1.stroke("#ffffff");
            series_data_2.stroke("#ffffff");
            series_data_3.stroke("#ffffff");
            series_data_4.stroke("#ffffff");
            series_data_5.stroke("#ffffff");
            series_data_6.stroke("#ffffff");

            series_data_1.selected().hatchFill("diagonal", "#ddd", 1, 5);
            series_data_2.selected().hatchFill("diagonal", "#ddd", 1, 5);
            series_data_3.selected().hatchFill("diagonal", "#ddd", 1, 5);
            series_data_4.selected().hatchFill("diagonal", "#ddd", 1, 5);
            series_data_5.selected().hatchFill("diagonal", "#ddd", 1, 5);
            series_data_6.selected().hatchFill("diagonal", "#ddd", 1, 5);


            // create scales and set stacking modes
            yScale1 = anychart.scales.linear();
            yScale1.stackMode("value");
            yScale2 = anychart.scales.linear();
            yScale2.stackMode("value");

            // bind create column series to different scales
            // data stacks in column-1
            series_data_1.yScale(yScale1);
            series_data_2.yScale(yScale1);
            series_data_3.yScale(yScale1);
            // data stacks in column-2
            series_data_4.yScale(yScale2);
            series_data_5.yScale(yScale2);
            series_data_6.yScale(yScale2);

            // set the padding between columns
            chart_BloodDonatedandCollected.barsPadding(0);

            // set the padding between column groups
            chart_BloodDonatedandCollected.barGroupsPadding(0.8);

            // enable major grids
            chart_BloodDonatedandCollected.xGrid().enabled(true);
            chart_BloodDonatedandCollected.yGrid().enabled(true);
            // enable minor grids
            chart_BloodDonatedandCollected.xMinorGrid().enabled(true);
            chart_BloodDonatedandCollected.yMinorGrid().enabled(true);

            // numerize the y axis label (e.g. 1000 -> 1k)
            chart_BloodDonatedandCollected.yAxis().labels().format(function() {
                var value = this.value;
                stringLikeNumber =  abbrNum(value, 2);
                return stringLikeNumber;
            });

            // enable axis pointing
            chart_BloodDonatedandCollected.crosshair(true);

            var interactivity = chart_BloodDonatedandCollected.interactivity();       
            // multi-select enabling
            interactivity.selectionMode("multiSelect");

            // turn on X Scroller
            chart_BloodDonatedandCollected.xScroller(true);
            // enable X Scroller
            chart_BloodDonatedandCollected.xScroller().enabled(true);
            // turn on Y Scroller
            chart_BloodDonatedandCollected.yScroller(true);
            // disable Y Scroller
            chart_BloodDonatedandCollected.yScroller().enabled(true);

            // set the thumbs
            var xThumbs = chart_BloodDonatedandCollected.xScroller().thumbs();
            var yThumbs = chart_BloodDonatedandCollected.yScroller().thumbs();

            // adjusting the thumbs behavior and look
            xThumbs.autoHide(true);
            xThumbs.hovered().fill("#FFD700");
            yThumbs.autoHide(true);
            yThumbs.hovered().fill("#FFD700");

            // set the scrollbar height
            chart_BloodDonatedandCollected.xScroller().maxHeight(12);
            chart_BloodDonatedandCollected.yScroller().maxHeight(12);

            // turn the legend on
            var legend = chart_BloodDonatedandCollected.legend();
            legend.enabled(true);
            legend.align("right");
            legend.fontSize(11);

            // set the size of legend icons
            legend.iconSize(11);
            // set the spacing between legend items
            legend.itemsSpacing(8);
            // set the spacing between legend icons and text
            legend.iconTextSpacing(2);

            // configuration for individual series
            var legendItem1 = series_data_1.legendItem();
            var legendItem2 = series_data_2.legendItem();
            var legendItem3 = series_data_3.legendItem();
            var legendItem4 = series_data_4.legendItem();
            var legendItem5 = series_data_5.legendItem();
            var legendItem6 = series_data_6.legendItem();



            //var yScale1 = chart_BloodDonatedandCollected.yScale();
            chart_BloodDonatedandCollected.yAxis().scale(yScale1);

            // sync minimums and maximums of the scales
            globalMax = chart_BloodDonatedandCollected.getStat("yScalesMax");
            //globalMin = chart_BloodDonatedandCollected.getStat("yScalesMin");
            globalMin = 0
            // get all y scales
            var yScales = chart_BloodDonatedandCollected.getYScales();
            // set the same minimum and maximum
            for (var i = 0; i < yScales.length; i++) {
                yScales[i].minimum(globalMin);
                yScales[i].maximum(globalMax);
            } 
        }
    }
    catch(err){
        console.log(err)
        if(err != "Data Load Error"){
            error = `<strong style="font-size:21px">Error:</strong><br><p style="font-size:20px">Failed to load the graph!</p><br><p style="font-size:16px">Please reload the graph</p>`
        }
        errorLabel = chart_BloodDonatedandCollected.noData().label();
        errorLabel.enabled(true);
        errorLabel.useHtml(true);
        errorLabel.text(error);
        errorLabel.background().enabled(true);
        errorLabel.background().fill("#ff3333 0.8");
        errorLabel.background().stroke("0.4 gray");
        errorLabel.padding(5);
        errorLabel.fontColor("white");
        errorLabel.fontWeight('normal');
        errorLabel.wordWrap('break-word');
        errorLabel.wordBreak('normal');

        chart_BloodDonatedandCollected.xAxis().title("");
        chart_BloodDonatedandCollected.yAxis().title("");
    }
    finally{
        $("#donation_collection-graph").html('');
        // create a stage
        var stage = anychart.graphics.create("donation_collection-graph");
        chart_BloodDonatedandCollected.bounds()

        // set the container id
        chart_BloodDonatedandCollected.container(stage);
        // chart_BloodDonatedandCollected.container("donation_collection-graph");

        // initiate drawing the chart
        chart_BloodDonatedandCollected.draw(load_graph_asynchronously);
    }
}
anychart.onDocumentReady(getGraphData_bloodDonatedandCollected);
$("#donation_collection-reload").on('click', function(){
    $(this).addClass('fa-spin')
    getGraphData_bloodDonatedandCollected();
});
$(`.donation_collection-graph-input input, .donation_collection-graph-input select`).on('change', getGraphData_bloodDonatedandCollected);
function getGraphData_bloodDonatedandCollected(){
    h = 
    `<img src="${$("#graph_loader_img").val()}" style="width:100%; max-width:500px">`
    $("#donation_collection-graph").html(h);
    data = $(`.donation_collection-graph-input input, .donation_collection-graph-input select`).serializeToJSON({
        parseBooleans: false,
    });
    $.ajax({
        url:"/column-graph-blood-donation-collection-data/",
        data:data,
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            raw_data = response.donoationCollectionData;
            bloodBank = $("#donation_collection-blood_bank").val();
            if(bloodBank != ''){
                bloodBank = $("#donation_collection-blood_bank").text();
                b = `<br><h6 style="font-size:13.5px">${bloodBank}</h6>`;
            }
            else{
                b = ``;
            }
            state = $("#donation_collection-state").val();
            district = $("#donation_collection-district").val();
            if(state != "India"){
                s = `<br><h6 style="font-size:12px">State: ${state}</h6>`;
                if(district != ''){
                    s = `<br><h6 style="font-size:12px">State: ${state}. District: ${district}</h6>`;
                }
            }
            else{
                s = ``;
            }
            x_value = $("#donation_collection-x").val();
            month = $("#donation_collection-x_month").val();
            year = $("#donation_collection-x_year").val();
            d = ''
            if(x_value == 'day'){
                d = `<br><h6 style="font-size:11.5px">Month: ${month}, Year: ${year}</h6>`
            }
            else if(x_value == 'month'){
                d = `<br><h6 style="font-size:11px">Year: ${year}</h6>`
            }
            chart_title = `<h1 style="font-size:16px">Graph: Blood Donated in & Collected from Blood Banks</h1>${b}${s}${d}`;
            group_by = $("#donation_collection-group").val();
            x_axis = $("#donation_collection-x").val();
            x_label = $("#donation_collection-x option:selected").attr('data-label');
            y_axis = $("#donation_collection-y").val();
            y_label = "";
            if(y_axis == "Units"){
                y_label = "Amount of blood in Unit"
            }
            else if(y_axis == "Persons"){
                y_label = "Number of persons"
            }
            loadGraph_bloodDonatedandCollected({raw_data:raw_data, chart_title:chart_title, group_by:group_by, x_axis:x_axis, x_label:x_label, y_axis:y_axis, y_label:y_label, month:month, year:year})
            $("#donation_collection-reload").removeClass('fa-spin');
        },
        error: function(){
            chart_title = `<h1 style="font-size:16px">Graph: Blood Donated in & Collected from Blood Banks</h1>`;
            error = `<strong style="font-size:21px">Error:</strong><br><p style="font-size:20px">Failed to fatch data!</p><br><p style="font-size:16px">Please reload the graph</p>`
            loadGraph_bloodDonatedandCollected({chart_title:chart_title, error:error});
            $("#donation_collection-reload").removeClass('fa-spin');
        },
    }); 
}



var chart_BloodRequestedAndDonated;
function filename_bloodRequestedAndDonated(){
    y = $("#blood_request_donation-y option:selected").html();
    state = $("#blood_request_donation-state").val();
    district = $("#blood_request_donation-district").val();
    x = $("#blood_request_donation-x").val();
    month = $("#blood_request_donation-x_month").val();
    year = $("#blood_request_donation-x_year").val();
    date = ''
    if(x == 'day'){
        date = `${month} ${year}`;
    }
    else if(x = 'month'){
        date = `${year}`;
    }
    if(state != 'India'){
        if(district != ''){
            state = `${state}, ${district}`
        }
        else{
            state = `${state}`
        }
    }
    file_name = `Graph-Blood_Request-${date} - ${state} (${y})`;
    return file_name;
}
$("#blood_request_donation-png").on('click', function(){
    file_name = filename_bloodRequestedAndDonated();
    chart_BloodRequestedAndDonated.saveAsPng({quality:1, filename:file_name})
});
$("#blood_request_donation-svg").on('click', function(){
    file_name = filename_bloodRequestedAndDonated();
    chart_BloodRequestedAndDonated.saveAsSvg({filename:file_name})
});
$("#blood_request_donation-pdf").on('click', function(){
    file_name = filename_bloodRequestedAndDonated();
    chart_BloodRequestedAndDonated.saveAsPdf({paperSizeOrWidthOrOptions:"a4", filename:file_name});
});
$("#blood_request_donation-csv").on('click', function(){
    file_name = filename_bloodRequestedAndDonated();
    csvSettings = {
        "rowsSeparator": "\n",
        "columnsSeparator": ",",
    }
    chart_BloodRequestedAndDonated.saveAsCsv(chartDataExportMode="raw", csvSettings=csvSettings, filename=file_name);
});
$("#blood_request_donation-xlsx").on('click', function(){
    file_name = filename_bloodRequestedAndDonated();
    chart_BloodRequestedAndDonated.saveAsXlsx(chartDataExportMode="default", filename=file_name)
});
$("#blood_request_donation-xml").on('click', function(){
    file_name = filename_bloodRequestedAndDonated();
    chart_BloodRequestedAndDonated.saveAsXml(filename=file_name)
});
$("#blood_request_donation-json").on('click', function(){
    file_name = filename_bloodRequestedAndDonated();
    chart_BloodRequestedAndDonated.saveAsJson(filename=file_name)
});
$("#blood_request_donation-print").on('click', function(){
    chart_BloodRequestedAndDonated.print(paperSizeOrWidth='A4', landscapeOrHeight=true)
});
function loadGraph_bloodRequestedAndDonated({raw_data, chart_title, group_by, x_axis, x_label, y_axis, y_label, error=null, day='', month='', year=''}={}) {
    // chart type
    chart_BloodRequestedAndDonated = anychart.column();

    try{
        // enable animation and set animation duration to 2 sec
        chart_BloodRequestedAndDonated.animation(true, 2000);

        // set the chart title
        var title = chart_BloodRequestedAndDonated.title();
        title.enabled(true);
        title.useHtml(true);
        title.text(chart_title);
        title.padding(13, 0, 5, 0)
        //title.fontSize(12);

        // set the titles of the axes
        chart_BloodRequestedAndDonated.xAxis().title(x_label);
        chart_BloodRequestedAndDonated.yAxis().title(y_label);
        chart_BloodRequestedAndDonated.xAxis().title().fontColor("gray");
        chart_BloodRequestedAndDonated.yAxis().title().fontColor("gray");

        // set the orientation of the axis label
        chart_BloodRequestedAndDonated.yAxis().orientation("left");
        chart_BloodRequestedAndDonated.xAxis().orientation("bottom");

        // adjusting axes labels
        chart_BloodRequestedAndDonated.yAxis().labels().fontSize(11);
        chart_BloodRequestedAndDonated.yAxis().labels().rotation(-90);
        chart_BloodRequestedAndDonated.yAxis().labels().padding(0,20,0,0);
        chart_BloodRequestedAndDonated.xAxis().labels().fontSize(11);
        chart_BloodRequestedAndDonated.xAxis().labels().rotation(-45);
        chart_BloodRequestedAndDonated.xAxis().labels().padding(0,0,0,0);

        // create a label
        var label = chart_BloodRequestedAndDonated.label(1);
        label.padding(0, 0, 1.5, 8);
        label.position("left-bottom");
        label.anchor("left-bottom");
        label.hAlign("left");
        label.useHtml(true);
        label.text(`<p>* This graph shows the data by analysing the blood requests that users sent through the web portal.</p>`);
        label.fontColor("gray");
        label.fontSize(11);
        label.offsetY(0);
        label.offsetX(0);
        label.width('100%');
        label.wordWrap('break-word');
        label.wordBreak('normal');
        // another way of setting everything with JSON
        label.background({
            "enabled": true,
            "fill": 'white'});

         // create a time label
         var label = chart_BloodRequestedAndDonated.label(2);
         label.padding(5, 15, 0, 0);
         label.position("right-top");
         label.anchor("right-top");
         label.hAlign("center");
         label.useHtml(true);
         label.text(`<p>Last Fetch: ${currentDateTime()}</p>`);
         label.fontColor("gray");
         label.fontSize(12);
         label.offsetY(0);
         label.offsetX(0);
         // another way of setting everything with JSON
         label.background({
             "enabled": true,
             "fill": 'white'});

        // enable context menu
        chart_BloodDonatedandCollected.contextMenu(true);

        // Update context menu
        contextMenu = chart_BloodRequestedAndDonated.contextMenu()
        contextMenu.itemsFormatter(function(items){
            // remove about and separator 
            delete items["full-screen-separator"];
            delete items["about"];
            delete items['save-chart-as']['subMenu']["save-chart-as-jpg"];

            // change text of "Save chart as..."
            items["print-chart"].text = "Print Graph";

            // modify item action
            items['save-chart-as']['subMenu']["save-chart-as-png"].action = function() {
                file_name = filename_bloodRequestedAndDonated();
                chart_BloodRequestedAndDonated.saveAsPng({quality:1, filename:file_name})
            };
            items['save-chart-as']['subMenu']["save-chart-as-svg"].action = function() {
                file_name = filename_bloodRequestedAndDonated();
                chart_BloodRequestedAndDonated.saveAsSvg({filename:file_name})
            };
            items['save-chart-as']['subMenu']["save-chart-as-pdf"].action = function() {
                file_name = filename_bloodRequestedAndDonated();
                chart_BloodRequestedAndDonated.saveAsPdf({paperSizeOrWidthOrOptions:"a4", filename:file_name});
            };
            items['save-data-as']['subMenu']["save-data-as-text"].action = function() {
                file_name = filename_bloodRequestedAndDonated();
                csvSettings = {
                    "rowsSeparator": "\n",
                    "columnsSeparator": ",",
                }
                chart_BloodRequestedAndDonated.saveAsCsv(chartDataExportMode="raw", csvSettings=csvSettings, filename=file_name);
            };
            items['save-data-as']['subMenu']["save-data-as-xlsx"].action = function() {
                file_name = filename_bloodRequestedAndDonated();
                chart_BloodRequestedAndDonated.saveAsXlsx(chartDataExportMode="default", filename=file_name)
            };
            
            // return modified array
            return items;
        });
        
        if(error != null){
            throw "Data Load Error"
        }
        else if(raw_data.length <= 0){
            noDataLabel = chart_BloodRequestedAndDonated.noData().label();
            noDataLabel.enabled(true);
            noDataLabel.text("No Data");
            noDataLabel.background().enabled(true);
            noDataLabel.background().fill("White 1");
            noDataLabel.background().stroke("2 gray");
            noDataLabel.padding(20);
            noDataLabel.fontSize(30);
            noDataLabel.fontColor("gray");
            noDataLabel.fontVariant("small-caps");

        }
        else{
            // create a data set
            var data = anychart.data.set(raw_data);
            console.log(data)
            
            // map data for the each series
            var seriesData_1 = data.mapAs({x: 0, value: 1});
            var seriesData_2 = data.mapAs({x: 0, value: 2});

            // set data
            var series_data_1 = chart_BloodRequestedAndDonated.column(seriesData_1);
            var series_data_2 = chart_BloodRequestedAndDonated.column(seriesData_2);

            // set title for the columns
            series_data_1.name(`Blood Requested`);
            series_data_2.name(`Blood Donated (${y_axis})`);

            //configure tooltip title
            if(x_axis == 'day'){
                tooltipTitle = `{%x}, ${month}, ${year}:`;
            }
            else if(x_axis == 'month'){
                tooltipTitle = `{%x}, ${year}:`;
            }
            else{
                tooltipTitle = `{%x}:`
            }
            chart_BloodRequestedAndDonated.tooltip().titleFormat(tooltipTitle);

            //configure tooltip text
            chart_BloodRequestedAndDonated.tooltip().format(`{%seriesName} in {%x}: {%value} ${y_axis}`);
            

            // color the columns
            series_data_1.fill("#f97924");
            series_data_2.fill("#ffd942");

            series_data_1.stroke("#ffffff");
            series_data_2.stroke("#ffffff");

            // don't want to show the blood donation data at the time, so hide the column and legend for this data at now
            series_data_2.enabled(true) // hide the series2
            series_data_2.legendItem().enabled(true); // hide the legend of the series2

            // set the padding between columns
            chart_BloodRequestedAndDonated.barsPadding(0);

            // set the padding between column groups
            chart_BloodRequestedAndDonated.barGroupsPadding(0.8);

            // enable major grids
            chart_BloodRequestedAndDonated.xGrid().enabled(true);
            chart_BloodRequestedAndDonated.yGrid().enabled(true);
            // enable minor grids
            chart_BloodRequestedAndDonated.xMinorGrid().enabled(true);
            chart_BloodRequestedAndDonated.yMinorGrid().enabled(true);

            // numerize the y axis label (e.g. 1000 -> 1k)
            chart_BloodRequestedAndDonated.yAxis().labels().format(function() {
                var value = this.value;
                stringLikeNumber =  abbrNum(value, 2);
                return stringLikeNumber;
            });

            // enable axis pointing
            chart_BloodRequestedAndDonated.crosshair(true);

            var interactivity = chart_BloodRequestedAndDonated.interactivity();       
            // multi-select enabling
            interactivity.selectionMode("multiSelect");

            // turn on X Scroller
            chart_BloodRequestedAndDonated.xScroller(true);
            // enable X Scroller
            chart_BloodRequestedAndDonated.xScroller().enabled(true);
            // turn on Y Scroller
            chart_BloodRequestedAndDonated.yScroller(true);
            // disable Y Scroller
            chart_BloodRequestedAndDonated.yScroller().enabled(false);

            // set the thumbs
            var xThumbs = chart_BloodRequestedAndDonated.xScroller().thumbs();

            // adjusting the thumbs behavior and look
            xThumbs.autoHide(true);
            xThumbs.hovered().fill("#FFD700");

            // set the scrollbar height
            chart_BloodRequestedAndDonated.xScroller().maxHeight(12);

            // turn the legend on
            var legend = chart_BloodRequestedAndDonated.legend();
            legend.enabled(true);
            legend.align("right");
            legend.fontSize(11);

            // set the size of legend icons
            legend.iconSize(11);
            // set the spacing between legend items
            legend.itemsSpacing(8);
            // set the spacing between legend icons and text
            legend.iconTextSpacing(2);

            // sync minimums and maximums of the scales
            globalMax = chart_BloodRequestedAndDonated.getStat("yScalesMax");
            //globalMin = chart_BloodRequestedAndDonated.getStat("yScalesMin");
            globalMin = 0
            // get all y scales
            var yScales = chart_BloodRequestedAndDonated.getYScales();
            // set the same minimum and maximum
            for (var i = 0; i < yScales.length; i++) {
                yScales[i].minimum(globalMin);
                yScales[i].maximum(globalMax);
            } 
        }
    }
    catch(err){
        console.log(err)
        if(err != "Data Load Error"){
            error = `<strong style="font-size:21px">Error:</strong><br><p style="font-size:20px">Failed to load the graph!</p><br><p style="font-size:16px">Please reload the graph</p>`
        }
        errorLabel = chart_BloodRequestedAndDonated.noData().label();
        errorLabel.enabled(true);
        errorLabel.useHtml(true);
        errorLabel.text(error);
        errorLabel.background().enabled(true);
        errorLabel.background().fill("#ff3333 0.8");
        errorLabel.background().stroke("0.4 gray");
        errorLabel.padding(5);
        errorLabel.fontColor("white");
        errorLabel.fontWeight('normal');
        errorLabel.wordWrap('break-word');
        errorLabel.wordBreak('normal');

        chart_BloodRequestedAndDonated.xAxis().title("");
        chart_BloodRequestedAndDonated.yAxis().title("");
    }
    finally{
        // set the container id
        $("#blood_request_donation-graph").html('');
        chart_BloodRequestedAndDonated.container("blood_request_donation-graph");

        // initiate drawing the chart
        chart_BloodRequestedAndDonated.draw(load_graph_asynchronously);
    }
}
anychart.onDocumentReady(getGraphData_bloodRequestedAndDonated);
$("#blood_request_donation-reload").on('click', function(){
    $(this).addClass('fa-spin')
    getGraphData_bloodRequestedAndDonated();
});
$(`.blood_request_donation-graph-input input, .blood_request_donation-graph-input select`).on('change', getGraphData_bloodRequestedAndDonated);
function getGraphData_bloodRequestedAndDonated(){
    h = 
    `<img src="${$("#graph_loader_img").val()}" style="width:100%; max-width:500px">`
    $("#blood_request_donation-graph").html(h);
    data = $(`.blood_request_donation-graph-input input, .blood_request_donation-graph-input select`).serializeToJSON({
        parseBooleans: false,
    });
    $.ajax({
        url:"/column-graph-blood-request-donation-data/",
        data:data,
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            raw_data = response.donoationAndRequestData;
            hospital = $("#blood_request_donation-hospital").val();
            if(hospital != ''){
                hospital = $("#blood_request_donation-hospital").text();
                h = `<br><h6 style="font-size:13.5px">${hospital}</h6>`;
            }
            else{
                h = ``;
            }
            state = $("#blood_request_donation-state").val();
            district = $("#blood_request_donation-district").val();
            if(state != "India"){
                s = `<br><h6 style="font-size:12px">State: ${state}</h6>`;
                if(district != ''){
                    s = `<br><h6 style="font-size:12px">State: ${state}. District: ${district}</h6>`;
                }
            }
            else{
                s = ``;
            }
            x_value = $("#blood_request_donation-x").val();
            month = $("#blood_request_donation-x_month").val();
            year = $("#blood_request_donation-x_year").val();
            d = ''
            if(x_value == 'day'){
                d = `<br><h6 style="font-size:11.5px">Month: ${month}, Year: ${year}</h6>`
            }
            else if(x_value == 'month'){
                d = `<br><h6 style="font-size:11px">Year: ${year}</h6>`
            }
            chart_title = `<h1 style="font-size:16px">Graph: Blood Requested & Blood Donated in Blood Bank</h1>${h}${s}${d}`;
            x_axis = $("#blood_request_donation-x").val();
            x_label = $("#blood_request_donation-x option:selected").attr('data-label');
            y_axis = $("#blood_request_donation-y").val();
            y_label = "";
            group_by = $("#blood_request_donation-group").val();
            
            if(y_axis == "Units"){
                y_label = "Amount of blood in Unit"
            }
            else if(y_axis == "Persons"){
                y_label = "Number of persons"
            }
            loadGraph_bloodRequestedAndDonated({raw_data:raw_data, chart_title:chart_title, group_by:group_by, x_axis:x_axis, x_label:x_label, y_axis:y_axis, y_label:y_label, month:month, year:year})
            $("#blood_request_donation-reload").removeClass('fa-spin');
        },
        error: function(){
            chart_title = `<h1 style="font-size:16px">Graph: Blood Requested & Blood Donated in Blood Bank</h1>`;
            error = `<strong style="font-size:21px">Error:</strong><br><p style="font-size:20px">Failed to fatch data!</p><br><p style="font-size:16px">Please reload the graph</p>`
            loadGraph_bloodRequestedAndDonated({chart_title:chart_title, error:error});
            $("#blood_request_donation-reload").removeClass('fa-spin');
        },
    }); 
}



var chart_BloodDonationCamps;
function filename_BloodDonationCamps(){
    y = $("#no_of_blood_donation_camps-y option:selected").html();
    state = $("#no_of_blood_donation_camps-state").val();
    district = $("#no_of_blood_donation_camps-district").val();
    x = $("#no_of_blood_donation_camps-x").val();
    month = $("#no_of_blood_donation_camps-x_month").val();
    year = $("#no_of_blood_donation_camps-x_year").val();
    date = ''
    if(x == 'day'){
        date = `${month} ${year}`;
    }
    else if(x = 'month'){
        date = `${year}`;
    }
    if(state != 'India'){
        if(district != ''){
            state = `${state}, ${district}`
        }
        else{
            state = `${state}`
        }
    }
    file_name = `Graph-Blood_Donation_Camps-${date} - ${state} (${y})`;
    return file_name;
}
$("#no_of_blood_donation_camps-png").on('click', function(){
    file_name = filename_BloodDonationCamps();
    chart_BloodDonationCamps.saveAsPng({quality:1, filename:file_name})
});
$("#no_of_blood_donation_camps-svg").on('click', function(){
    file_name = filename_BloodDonationCamps();
    chart_BloodDonationCamps.saveAsSvg({filename:file_name})
});
$("#no_of_blood_donation_camps-pdf").on('click', function(){
    file_name = filename_BloodDonationCamps();
    chart_BloodDonationCamps.saveAsPdf({paperSizeOrWidthOrOptions:"a4", filename:file_name});
});
$("#no_of_blood_donation_camps-csv").on('click', function(){
    file_name = filename_BloodDonationCamps();
    csvSettings = {
        "rowsSeparator": "\n",
        "columnsSeparator": ",",
    }
    chart_BloodDonationCamps.saveAsCsv(chartDataExportMode="raw", csvSettings=csvSettings, filename=file_name);
});
$("#no_of_blood_donation_camps-xlsx").on('click', function(){
    file_name = filename_BloodDonationCamps();
    chart_BloodDonationCamps.saveAsXlsx(chartDataExportMode="default", filename=file_name)
});
$("#no_of_blood_donation_camps-xml").on('click', function(){
    file_name = filename_BloodDonationCamps();
    chart_BloodDonationCamps.saveAsXml(filename=file_name)
});
$("#no_of_blood_donation_camps-json").on('click', function(){
    file_name = filename_BloodDonationCamps();
    chart_BloodDonationCamps.saveAsJson(filename=file_name)
});
$("#no_of_blood_donation_camps-print").on('click', function(){
    chart_BloodDonationCamps.print(paperSizeOrWidth='A4', landscapeOrHeight=true)
});
function loadGraph_bloodDonationCamps({raw_data, chart_title, group_by, x_axis, x_label, y_axis, y_label, error=null, day='', month='', year=''}={}) {
    // chart type
    chart_BloodDonationCamps = anychart.column();

    try{
        // enable animation and set animation duration to 2 sec
        chart_BloodDonationCamps.animation(true, 2000);

        // set the chart title
        var title = chart_BloodDonationCamps.title();
        title.enabled(true);
        title.useHtml(true);
        title.text(chart_title);
        title.padding(13, 0, 5, 0)
        //title.fontSize(12);

        // set the titles of the axes
        chart_BloodDonationCamps.xAxis().title(x_label);
        chart_BloodDonationCamps.yAxis().title(y_label);
        chart_BloodDonationCamps.xAxis().title().fontColor("gray");
        chart_BloodDonationCamps.yAxis().title().fontColor("gray");

        // set the orientation of the axis label
        chart_BloodDonationCamps.yAxis().orientation("left");
        chart_BloodDonationCamps.xAxis().orientation("bottom");

        // adjusting axes labels
        chart_BloodDonationCamps.yAxis().labels().fontSize(11);
        chart_BloodDonationCamps.yAxis().labels().rotation(-90);
        chart_BloodDonationCamps.yAxis().labels().padding(0,20,0,0);
        chart_BloodDonationCamps.xAxis().labels().fontSize(11);
        chart_BloodDonationCamps.xAxis().labels().rotation(-45);
        chart_BloodDonationCamps.xAxis().labels().padding(0,0,0,0);

        // create a label
        var label = chart_BloodDonationCamps.label(1);
        label.padding(0, 0, 1.5, 8);
        label.position("left-bottom");
        label.anchor("left-bottom");
        label.hAlign("left");
        label.useHtml(true);
        label.text(`<p>* This graph shows the data by analysing the registered blood donation camps.</p>`);
        label.fontColor("gray");
        label.fontSize(11);
        label.offsetY(0);
        label.offsetX(0);
        label.width('100%');
        label.wordWrap('break-word');
        label.wordBreak('normal');
        // another way of setting everything with JSON
        label.background({
            "enabled": true,
            "fill": 'white'});

         // create a time label
         var label = chart_BloodDonationCamps.label(2);
         label.padding(5, 15, 0, 0);
         label.position("right-top");
         label.anchor("right-top");
         label.hAlign("center");
         label.useHtml(true);
         label.text(`<p>Last Fetch: ${currentDateTime()}</p>`);
         label.fontColor("gray");
         label.fontSize(12);
         label.offsetY(0);
         label.offsetX(0);
         // another way of setting everything with JSON
         label.background({
             "enabled": true,
             "fill": 'white'});

        // enable context menu
        chart_BloodDonatedandCollected.contextMenu(true);

        // Update context menu
        contextMenu = chart_BloodDonationCamps.contextMenu()
        contextMenu.itemsFormatter(function(items){
            // remove about and separator 
            delete items["full-screen-separator"];
            delete items["about"];
            delete items['save-chart-as']['subMenu']["save-chart-as-jpg"];

            // change text of "Save chart as..."
            items["print-chart"].text = "Print Graph";

            // modify item action
            items['save-chart-as']['subMenu']["save-chart-as-png"].action = function() {
                file_name = filename_bloodRequestedAndDonated();
                chart_BloodDonationCamps.saveAsPng({quality:1, filename:file_name})
            };
            items['save-chart-as']['subMenu']["save-chart-as-svg"].action = function() {
                file_name = filename_bloodRequestedAndDonated();
                chart_BloodDonationCamps.saveAsSvg({filename:file_name})
            };
            items['save-chart-as']['subMenu']["save-chart-as-pdf"].action = function() {
                file_name = filename_bloodRequestedAndDonated();
                chart_BloodDonationCamps.saveAsPdf({paperSizeOrWidthOrOptions:"a4", filename:file_name});
            };
            items['save-data-as']['subMenu']["save-data-as-text"].action = function() {
                file_name = filename_bloodRequestedAndDonated();
                csvSettings = {
                    "rowsSeparator": "\n",
                    "columnsSeparator": ",",
                }
                chart_BloodDonationCamps.saveAsCsv(chartDataExportMode="raw", csvSettings=csvSettings, filename=file_name);
            };
            items['save-data-as']['subMenu']["save-data-as-xlsx"].action = function() {
                file_name = filename_bloodRequestedAndDonated();
                chart_BloodDonationCamps.saveAsXlsx(chartDataExportMode="default", filename=file_name)
            };
            
            // return modified array
            return items;
        });
        
        if(error != null){
            throw "Data Load Error"
        }
        else if(raw_data.length <= 0){
            noDataLabel = chart_BloodDonationCamps.noData().label();
            noDataLabel.enabled(true);
            noDataLabel.text("No Data");
            noDataLabel.background().enabled(true);
            noDataLabel.background().fill("White 1");
            noDataLabel.background().stroke("2 gray");
            noDataLabel.padding(20);
            noDataLabel.fontSize(30);
            noDataLabel.fontColor("gray");
            noDataLabel.fontVariant("small-caps");

        }
        else{
            // create a data set
            var data = anychart.data.set(raw_data);
            
            // map data for the each series
            var seriesData_1 = data.mapAs({x: 0, value: 1});

            // set data
            var series_data_1 = chart_BloodDonationCamps.column(seriesData_1);

            // set title for the columns
            series_data_1.name(`No. of Blood Donation Camps`);

            //configure tooltip title
            if(x_axis == 'day'){
                tooltipTitle = `{%x}, ${month}, ${year}:`;
            }
            else if(x_axis == 'month'){
                tooltipTitle = `{%x}, ${year}:`;
            }
            else{
                tooltipTitle = `{%x}:`
            }
            chart_BloodDonationCamps.tooltip().titleFormat(tooltipTitle);

            //configure tooltip text
            chart_BloodDonationCamps.tooltip().format(`{%seriesName} in {%x}: {%value}`);
            

            // color the columns
            series_data_1.fill("#df54f8");
            series_data_1.stroke("#ffffff");


            // set the padding between columns
            chart_BloodDonationCamps.barsPadding(0);

            // set the padding between column groups
            chart_BloodDonationCamps.barGroupsPadding(0.8);

            // enable major grids
            chart_BloodDonationCamps.xGrid().enabled(true);
            chart_BloodDonationCamps.yGrid().enabled(true);
            // enable minor grids
            chart_BloodDonationCamps.xMinorGrid().enabled(true);
            chart_BloodDonationCamps.yMinorGrid().enabled(true);

            // numerize the y axis label (e.g. 1000 -> 1k)
            chart_BloodDonationCamps.yAxis().labels().format(function() {
                var value = this.value;
                stringLikeNumber =  abbrNum(value, 2);
                return stringLikeNumber;
            });

            // enable axis pointing
            chart_BloodDonationCamps.crosshair(true);

            var interactivity = chart_BloodDonationCamps.interactivity();       
            // multi-select enabling
            interactivity.selectionMode("multiSelect");

            // turn on X Scroller
            chart_BloodDonationCamps.xScroller(true);
            // enable X Scroller
            chart_BloodDonationCamps.xScroller().enabled(true);
            // turn on Y Scroller
            chart_BloodDonationCamps.yScroller(true);
            // disable Y Scroller
            chart_BloodDonationCamps.yScroller().enabled(false);

            // set the thumbs
            var xThumbs = chart_BloodDonationCamps.xScroller().thumbs();

            // adjusting the thumbs behavior and look
            xThumbs.autoHide(true);
            xThumbs.hovered().fill("#FFD700");

            // set the scrollbar height
            chart_BloodDonationCamps.xScroller().maxHeight(12);

            // turn the legend on
            var legend = chart_BloodDonationCamps.legend();
            legend.enabled(true);
            legend.align("right");
            legend.fontSize(11);

            // set the size of legend icons
            legend.iconSize(11);
            // set the spacing between legend items
            legend.itemsSpacing(8);
            // set the spacing between legend icons and text
            legend.iconTextSpacing(2);

            // sync minimums and maximums of the scales
            globalMax = chart_BloodDonationCamps.getStat("yScalesMax");
            //globalMin = chart_BloodDonationCamps.getStat("yScalesMin");
            globalMin = 0
            // get all y scales
            var yScales = chart_BloodDonationCamps.getYScales();
            // set the same minimum and maximum
            for (var i = 0; i < yScales.length; i++) {
                yScales[i].minimum(globalMin);
                yScales[i].maximum(globalMax);
            } 
        }
    }
    catch(err){
        console.log(err)
        if(err != "Data Load Error"){
            error = `<strong style="font-size:21px">Error:</strong><br><p style="font-size:20px">Failed to load the graph!</p><br><p style="font-size:16px">Please reload the graph</p>`
        }
        errorLabel = chart_BloodDonationCamps.noData().label();
        errorLabel.enabled(true);
        errorLabel.useHtml(true);
        errorLabel.text(error);
        errorLabel.background().enabled(true);
        errorLabel.background().fill("#ff3333 0.8");
        errorLabel.background().stroke("0.4 gray");
        errorLabel.padding(5);
        errorLabel.fontColor("white");
        errorLabel.fontWeight('normal');
        errorLabel.wordWrap('break-word');
        errorLabel.wordBreak('normal');

        chart_BloodDonationCamps.xAxis().title("");
        chart_BloodDonationCamps.yAxis().title("");
    }
    finally{
        // set the container id
        $("#no_of_blood_donation_camps-graph").html('');
        chart_BloodDonationCamps.container("no_of_blood_donation_camps-graph");

        // initiate drawing the chart
        chart_BloodDonationCamps.draw(load_graph_asynchronously);
    }
}
anychart.onDocumentReady(getGraphData_bloodDonationCamps);
$("#no_of_blood_donation_camps-reload").on('click', function(){
    $(this).addClass('fa-spin')
    getGraphData_bloodDonationCamps();
});
$(`.no_of_blood_donation_camps-graph-input input, .no_of_blood_donation_camps-graph-input select`).on('change', getGraphData_bloodDonationCamps);
function getGraphData_bloodDonationCamps(){
    h = 
    `<img src="${$("#graph_loader_img").val()}" style="width:100%; max-width:500px">`
    $("#no_of_blood_donation_camps-graph").html(h);
    data = $(`.no_of_blood_donation_camps-graph-input input, .no_of_blood_donation_camps-graph-input select`).serializeToJSON({
        parseBooleans: false,
    });
    $.ajax({
        url:"/column-graph-blood-donation-camp-data/",
        data:data,
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            raw_data = response.donoationCampData;
            state = $("#no_of_blood_donation_camps-state").val();
            district = $("#no_of_blood_donation_camps-district").val();
            if(state != "India"){
                s = `<br><h6 style="font-size:12px">State: ${state}</h6>`;
                if(district != ''){
                    s = `<br><h6 style="font-size:12px">State: ${state}. District: ${district}</h6>`;
                }
            }
            else{
                s = ``;
            }
            x_value = $("#no_of_blood_donation_camps-x").val();
            month = $("#no_of_blood_donation_camps-x_month").val();
            year = $("#no_of_blood_donation_camps-x_year").val();
            d = ''
            if(x_value == 'day'){
                d = `<br><h6 style="font-size:11.5px">Month: ${month}, Year: ${year}</h6>`
            }
            else if(x_value == 'month'){
                d = `<br><h6 style="font-size:11px">Year: ${year}</h6>`
            }
            chart_title = `<h1 style="font-size:16px">Graph: Blood Donation Camps</h1>${s}${d}`;
            x_axis = $("#no_of_blood_donation_camps-x").val();
            x_label = $("#no_of_blood_donation_camps-x option:selected").attr('data-label');
            y_axis = $("#no_of_blood_donation_camps-y").val();
            y_label = "";
            group_by = $("#no_of_blood_donation_camps-group").val();
            
            y_label = "Number of blood donation camps"
            
            loadGraph_bloodDonationCamps({raw_data:raw_data, chart_title:chart_title, group_by:group_by, x_axis:x_axis, x_label:x_label, y_axis:y_axis, y_label:y_label, month:month, year:year})
            $("#no_of_blood_donation_camps-reload").removeClass('fa-spin');
        },
        error: function(){
            chart_title = `<h1 style="font-size:16px">Graph: Blood Donation Camps</h1>`;
            error = `<strong style="font-size:21px">Error:</strong><br><p style="font-size:20px">Failed to fatch data!</p><br><p style="font-size:16px">Please reload the graph</p>`
            loadGraph_bloodDonationCamps({chart_title:chart_title, error:error});
            $("#no_of_blood_donation_camps-reload").removeClass('fa-spin');
        },
    }); 
}
