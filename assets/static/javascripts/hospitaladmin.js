

var otpSendToEmail = undefined;
var emailOtpSent = false;
var interval1;
var currentOTPTimer1 = 0;
function timer1(t1)
{
    interval1 = setInterval(function(){
        if(t1 <= 0)
        {
            document.getElementById("email-otp-send-btn").disabled = false;
            document.getElementById("email-otp-send-btn").innerHTML = "Resend OTP";
            clearInterval(interval1);
            return 0;
        }
        else if(t1 > 0)
        {
            document.getElementById("email-otp-send-btn").disabled = true;
            document.getElementById("email-otp-send-btn").innerHTML = `Resend OTP in ${t1}s`
            t1 = t1 - 1;
            currentOTPTimer1 = t1;
        }
    }, 1000);
    return 0;
}
var otpSendToMobile = undefined;
var mobileOtpSent = false;
var interval2;
var currentOTPTimer2 = 0;
function timer2(t2)
{
    interval2 = setInterval(function(){
        if(t2 <= 0)
        {
            document.getElementById("mobile-otp-send-btn").disabled = false;
            document.getElementById("mobile-otp-send-btn").innerHTML = "Resend OTP";
            clearInterval(interval2);
            return 0;
        }
        else if(t2 > 0)
        {
            document.getElementById("mobile-otp-send-btn").disabled = true;
            document.getElementById("mobile-otp-send-btn").innerHTML = `Resend OTP in ${t2}s`
            t2 = t2 - 1;
            currentOTPTimer2 = t2;
        }
    }, 1000);
    return 0;
}

function loadOxygenGauge(O2InMinute=0){
    O2InDay = parseFloat((O2InMinute / 1440).toFixed(2)); // minute to day
    // create data set on our data
    var dataSet = anychart.data.set([O2InDay]);

    if(O2InMinute > 525600){ //more than 365 days
        remainText = `<span style="font-size:18px; color:#06ee00">${parseFloat((O2InMinute / 525600).toFixed(2))}</span><span style="font-size:14px; color:#06ee00"> Years</span>`;
    }
    else if(O2InMinute > 43200){ //more than 30 days
        remainText = `<span style="font-size:18px; color:#06ee00">${parseFloat((O2InMinute / 43200).toFixed(2))}</span><span style="font-size:14px; color:#06ee00"> Months</span>`;
    }
    else if(O2InMinute > 1440){ //More than 1 day
        remainText = `<span style="font-size:18px; color: #ffb800">${O2InDay}</span><span style="font-size:14px; color: #ffb800"> Days</span>`
    }
    else if(O2InMinute < 30){ //Less than 30 minutes
        remainText = `<span style="font-size:13px; color: #ff0300"> No Oxygen</span>`
    }
    else if(O2InMinute < 60){ //Less than 60 minutes 
        remainText = `<span style="font-size:18px; color: #ff5d00;">${parseFloat(O2InMinute).toFixed(2)}</span><span style="font-size:14px; color:#ff5d00;"> Minutes</span>`
    }
    else{ //More than 60 minutes
        remainText = `<span style="font-size:18px; color:#ff5d00">${parseInt(O2InMinute / 60)}</span><span style="font-size:14px; color:#ff5d00">Hr </span><span style="font-size:18px; color:#ff5d00">${parseInt(O2InMinute % 60)}</span><span style="font-size:14px; color:#ff5d00">Min</span>`
    }
    
    // set the gauge type
    var gauge = anychart.gauges.circular();

    // gauge settings
    // gauge.title('Oxygen Availability\nIn Days');
    // gauge.title().fontSize(20).hAlign('center').padding(0, 0, 20, 0);
    gauge.data(dataSet);
    gauge.padding(0);
    gauge.margin(0)
    gauge.startAngle(270);
    gauge.sweepAngle(180);
    gauge.fill(["white", "black"], .5, .5, null, 1, 0.5, 0.9);
    gauge.stroke('2 #B9B9B9')
   
	// axis settings
    var axis = gauge.axis()
    .radius(95)
    .width(0);

	// scale settings
    axis.scale()
    .minimum(0)
    .maximum(60)
    .ticks({interval: 5})
    .minorTicks({interval: 1});

	// ticks settings
    axis.ticks()
    .type("trapezium")
    .fill("white")
    .length(9);

	// minor ticks settings
    axis.minorTicks()
    .enabled(true)
    .fill("white")
    .length(1.5);

    // labels settings
    axis.labels()
    .fontSize("13px")
    .fontColor("white");



    // needle
    gauge.needle(0)
    .enabled(true)
    .startRadius("-5%")
    .endRadius("80%")
    .fill("black")
    .middleRadius(0)
    .startWidth("0.1%")
    .endWidth("0.1%")
    .middleWidth("5%");


    // gap
    gauge.cap()
    .radius("1%")
    .enabled(true)
    .fill('black')
    .stroke(null);

    // gauge label
    gauge.label()
    .text(`<span style="color: white">Oxygen Availability</span><br>
            <span style="color: white; font-size: 14px; margin-top:-5px">In Days</span>`)
    .useHtml(true)
    .fontColor("white")
    .anchor("center") // set the position of the label
    .adjustFontSize(true)
    .hAlign("center")
    .offsetY("45%")
    .offsetX("50%")
    .height("15%")
    .width("55%")
    .zIndex(10);

    labelValue = gauge.label(1);
    labelValue
    .text(remainText)
    .useHtml(true)
    .fontSize("23%")
    .anchor('center')
    .adjustFontSize(true)
    .vAlign('center')
    .hAlign('center')
    .offsetY('30%')
    .offsetX('70%')
    .zIndex(10)
    .padding(4, 8)
    .background({
        fill: '#fff',
        stroke: { thickness: 1, color: '#E0F0FD' }
    });

    // range
    gauge.range({
        from: 0,
        to: 120,
        fill: {keys: ["red", "orange", "yellow", "#33ff33"]},
        position: "inside",
        radius: 100,
        endSize: "3%",
        startSize:"3%",
        zIndex: 10,
      
    });
  
    // range
    gauge.range(1)
    .radius(70)
    .from(0).to(60)
    .fill("#e1e2e2")
    .endSize("13%");

    // draw the chart
    $("#oxygen-gauge-container").html("");
    gauge.container("oxygen-gauge-container").draw();
}
anychart.onDocumentReady(loadOxygenGauge);


    //   var chart = JSC.chart('oxygen-gauge-container', {
    //     debug: true,
    //     title_position: 'center',
    //     toolbar_visible: false,
    //     defaultSeries: { type: 'gauge', },
    //     legend: { position: 'inside top', boxVisible: false, visible: true, },
        
    //     yAxis: [
            
    //       {
    //           formatString: 'days',
    //         scale: { range: [0, 80], interval: 5 },
    //         line_color: '#5E72AA',
    //         defaultTick: {
    //           line_color: '#0A6AAA',
    //           label: { style: { fontSize: '10px' } }
    //         },
    //         markers: [
    //         {
    //           value: [0, 10],
    //           color: '#FF0000',
    //           label_text: 'Very Low Oxygen Level'
    //         },
    //         {
    //           value: [10.1, 30],
    //           color: '#DBC114',
    //           label_text: 'Fill oxygen quicly'
    //         },
    //         {
    //           value: [60, 80],
    //           color: '#31A607',
    //           label_text: 'Enough Oxygen'
    //         }
    //       ]
    //       }
    //     ],
    //     defaultTooltip_enabled: true,
    //     series: [
    //       {
    //           color: 'blue',
    //         mouseTracking_enabled: true,
    //         id: 's1',
    //         shape: {
    //             label_text: 'Oxygen Availability in Days',
    //             fill: ['#a0f1ff', 'white', 45],
    //             outline: {color: '#6CC09B', width: 2,},
    //             padding: 0.2,
    //             innerPadding: 0.3,
    //         },
    //         angle: { sweep: 180, start: 180 },
    //         points: [
    //             { 
    //                 id: 'oxygen_value',
    //                 legendEntry_visible: false, 
    //                 y: 35,
    //                 marker_length: 0.8,
    //                 color: 'blue'
    //             }
    //         ]
    //       },
    //     ]
    //   });
    //   //chart.redraaw();


function liveDateTime()
{
    var today = new Date();
    var hourNow = today.getHours();
    var minuteNow = today.getMinutes();
    var secondNow = today.getSeconds();
    var ampmNow = hourNow >= 12 ? 'PM' : 'AM'; //AM or PM

    hourNow = hourNow % 12; //convert in 12-hour format;
    hourNow = hourNow ? hourNow : 12; //display 0 as 12

    var dayNow = today.toLocaleString('default', { day: 'numeric' });
    var monthNow = today.toLocaleString('default', { month: 'long' });
    var yearNow = today.toLocaleString('default', { year: 'numeric' });

    var todayTime = `${(hourNow <= 9) ? '0'+hourNow : hourNow}:${(minuteNow <= 9) ? '0'+minuteNow : minuteNow}:${(secondNow <= 9) ? '0'+secondNow : secondNow} ${ampmNow}`
    var todayDate = `${(dayNow <= 9) ? '0'+dayNow : dayNow}-${(monthNow <= 9) ? '0'+monthNow : monthNow}-${(yearNow <= 9) ? '0'+yearNow : yearNow}`
    $("#today-time").html(todayTime)
    $("#today-date").html(todayDate)
}
$(document).ready(function(){
    setInterval(liveDateTime, 1000);
})



$(".sidenav-list").on('click', function(){
    $(".site-content").fadeOut(0);
    $(".site-content").css('display', '')
    $(".site-content").removeClass('active');
    var target = $(this).attr('data-target');
    $(target).fadeIn(2000);
    $(target).css('display', '')
    $(target).addClass('active');
});

$("#edit-gear").on('click', function(){
    $(".sidenav-list").removeClass('active');
    $(".site-content").removeClass('active');
    $("#site-content-edit").addClass('active');
});

$(".sidenav-close").on('click', closeSideNav);
$(".close-sidenav").on('click', closeSideNav);
function closeSideNav(){
    $(".main-content").css('margin-left', '0px');
    $(".sidenav").css('transform', 'translateX(-100%)');
}
$(".sidenav-open").on('click', function(){
    $(".main-content").css('margin-left', '300px');
    $(".sidenav").css('transform', 'translateX(0)');
});

var deviceWidth = screen.width;
if(deviceWidth <= 500){
    $(".sidenav-list").on('click', function(){
        closeSideNav()
    });
    $("#edit-gear").on('click', function(){
        closeSideNav()
    });
    $(document).ready(closeSideNav);
}


$(".section-heading").on('click', function(event){
    $(".sidenav-item-list").removeClass('active');
    $(".section-heading").removeClass('active');
    $(this).addClass('active');
    var target = $(this).attr('data-target');
    var display = $(target).css('display');
    display = (display == 'block' ? 'none' : 'block')
    $(".section-content").css('display', 'none')
    $(target).css('display', display);
    $('.btn-collapse').removeClass('fa-caret-square-up');
    $('.btn-collapse').addClass('fa-caret-square-down');
    if(display == 'block'){
        $(this).find('.btn-collapse').toggleClass('fa-caret-square-up');
        $(this).find('.btn-collapse').toggleClass('fa-caret-square-down');
    }  
});


$(".sidenav-item-list").on('click', function(event){
    $(".sidenav-item-list").removeClass('active');
    $(this).addClass('active');
    $(".section-content").css('display', 'none');
    $(".section-heading").removeClass('active');
    $(".section-content-list").removeClass('active');
    $('.btn-collapse').removeClass('fa-caret-square-up');
    $('.btn-collapse').addClass('fa-caret-square-down');
});
$(".section-content-list").on('click', function(event){
    $(".section-content-list").removeClass('active');
    $(this).addClass('active')
});


var liveOxygen =  function() {

    var hospitalId = $('#id_hospital').val();
    var uri = `/events/live-bed/`;
    var lastOxygenEventId = $("#last-oxygen-strean-id").val();
    lastOxygenEventId = lastOxygenEventId.split(":")
    lastOxygenEventId = `${lastOxygenEventId[0]}:${lastOxygenEventId[1]-1}`
    
    var es = new ReconnectingEventSource(uri, {lastEventId: lastOxygenEventId});
    es.addEventListener('message', function (event) {
        let receivedData = JSON.parse(event.data)
        if(receivedData['OxygenUpdate']== '1' &&  receivedData['Unique_Id'] == hospitalId){
            let remain = Number(receivedData['Oxygen_Remaining_Time'])
            loadOxygenGauge(remain);
        }
    }, false);

    es.onerror = function () {
        console.log('*** connection lost, reconnecting...');
    };

    es.addEventListener('stream-reset', function () {
        console.log('*** client too far behind, please refresh');
    }, false);

    return true;
}

$(document).ready(function(){
    liveOxygen();
});

$(".bed-info-filter-input").on('change', refreshBedData)
$("#bed-info-filter-clear").on('click', function(){
    $(".bed-info-filter-input").val('')
    refreshBedData()
})
$("#bed-refresh-btn").on('click', function(){
    $("#bed-refresh-btn").prop('disabled', true);
    $("#bed-refresh").addClass('fa-spin');
    refreshBedData(); 
});
$("[data-target='#site-content-bed-data']").on('click', function(){
    refreshBedData();
});
function refreshBedData()
{
    $('.bed-data-front').hide();
    $('.bed-data-front-loading').show();
    $('.bed-data-front-loading').html('<i class="fad fa-spinner fa-3x fa-spin"></i>');
    $('.table-bed-data').html('');
    data = $(`[form='bed-info-filter-form']`).serializeToJSON({
        parseBooleans: false,
    }); //get form data in json format
    $.ajax({
        type: 'GET',
        url: "/get-beds-info/",
        data:data,
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            var elementId;
            var ward;
            var wardType;
            var requirement;
            var requirementValue;
            var wardList = response.wardList
            var floorList = response.floor_list
            var departmentList = response.department_list
            var roomList = response.room_list
            var unitList = response.unit_list
            var buildingList = response.building_list
            var remain = response.oxygen_remain
            globalOxygenRemain = remain
            if(response.all_available_beds.length > 0){
                for(i=0; i<response.all_available_beds.length; i++)
                {
                    available_beds = response.all_available_beds[i]
                    requirementOptionsToAdd = `<option label="Select Support"></option>`;
                    ward = available_beds['Ward']
                    if(available_beds['Support'] == 'With Oxygen')
                    {
                        requirement = 'O2';

                        requirementOptionsToAdd += 
                        `<option value="With Oxygen" selected>With Oxygen</option>
                        <option value="Non-Oxygen">Non-Oxygen</option>`
                    }
                    else if(available_beds['Support'] == 'Non-Oxygen')
                    {
                        requirement = 'NonO2';

                        requirementOptionsToAdd += 
                        `<option value="With Oxygen">With Oxygen</option>
                        <option value="Non-Oxygen" selected>Non-Oxygen</option>`
                    }
                    else if(available_beds['Support'] == 'With Ventilator')
                    {
                        requirement = 'Ventilator';
                        requirementOptionsToAdd += 
                        `<option value="With Ventilator" selected>With Ventilator</option>
                        <option value="Non-Ventilator">Non-Ventilator</option>`
                    }
                    else if(available_beds['Support'] == 'Non-Ventilator')
                    {
                        requirement = 'NonVentilator';
                        requirementOptionsToAdd += 
                        `<option value="With Ventilator">With Ventilator</option>
                        <option value="Non-Ventilator" selected>Non-Ventilator</option>`
                    }
                    var floorOptionsToAdd = `<option label="Select Floor"></option>`
                    for(j of floorList)
                    {
                        if(j[0] == available_beds['Floor'])
                        {
                            floorOptionsToAdd += `<option value="${j[0]}" selected>${j[0]}</option>`
                        }
                        else
                        {
                            floorOptionsToAdd += `<option value="${j[0]}">${j[0]}</option>`
                        }
                    }
                    var wardOptionsToAdd = `<option label="Select Ward"></option>`
                    for(j of wardList)
                    {
                        if(j[0] == available_beds['Ward'])
                        {
                            wardOptionsToAdd += `<option value="${j[0]}" selected>${j[0]}</option>`
                        }
                        else
                        {
                            wardOptionsToAdd += `<option value="${j[0]}">${j[0]}</option>`
                        }
                    }
                    var departmentOptionsToAdd = `<option label="Select Department"></option>`
                    for(j of departmentList)
                    {
                        if(j == available_beds['Department__department'])
                        {
                            departmentOptionsToAdd += `<option value="${j}" selected>${j}</option>`
                        }
                        else
                        {
                            departmentOptionsToAdd += `<option value="${j}">${j}</option>`
                        }
                    }
                    var roomOptionsToAdd = `<option label="Select Room"></option>`
                    for(j of roomList)
                    {
                        if(j == available_beds['Room__Room'])
                        {
                            roomOptionsToAdd += `<option value="${j}" selected>${j}</option>`
                        }
                        else
                        {
                            roomOptionsToAdd += `<option value="${j}">${j}</option>`
                        }
                    }
                    var unitOptionsToAdd = `<option label="Select Unit"></option>`
                    for(j of unitList)
                    {
                        if(j == available_beds['Unit__Unit'])
                        {
                            unitOptionsToAdd += `<option value="${j}" selected>${j}</option>`
                        }
                        else
                        {
                            unitOptionsToAdd += `<option value="${j}">${j}</option>`
                        }
                    }
                    var buildingOptionsToAdd = `<option label="Select Building"></option>`
                    for(j of buildingList)
                    {
                        if(j == available_beds['Building__Building'])
                        {
                            buildingOptionsToAdd += `<option value="${j}" selected>${j}</option>`
                        }
                        else
                        {
                            buildingOptionsToAdd += `<option value="${j}">${j}</option>`
                        }
                    }
                    ward = ward.split(' ')[0]
                    elementId = ward+"-"+requirement+"-"+available_beds['Availability']
                    var ele = document.getElementById(elementId);

                    var html = 
                        `<tr>
                            <td scope="row" class="left-column-sticky"><i class="far fa-edit text-primary btn-bed-edit" data-open="false" id="bedEditBtn${available_beds.id}" data-id="${available_beds.id}"></i></td>
                            <td id="Department${available_beds.id}">
                                <span class="text-group-${available_beds.id}">${available_beds.Department__department}</span>
                                <select name="department" class="input-group-${available_beds.id}" id="edit_bed_input-department-${available_beds.id}" style="display:none" required>
                                    ${departmentOptionsToAdd}
                                </select>
                                <div class="text-danger edit-bed-required"></div>
                            </td>
                            <td id="BedNo${available_beds.id}">
                                <span class="text-group-${available_beds.id}">${available_beds.Bed_No}</span>
                                <input name="bedNo" class="input-group-${available_beds.id}" id="edit_bed_input-bedNo-${available_beds.id}" value="${available_beds.Bed_No}" style="display:none" required>
                                <div class="text-danger edit-bed-required"></div>
                            </td>
                            <td id="Room${available_beds.id}">
                                <span class="text-group-${available_beds.id}">${displayNotNullData(available_beds.Room__Room)}</span>
                                <select name="room" class="input-group-${available_beds.id}" id="edit_bed_input-room-${available_beds.id}" style="display:none">
                                    ${roomOptionsToAdd}
                                </select>
                            </td>
                            <td id="Unit${available_beds.id}">
                                <span class="text-group-${available_beds.id}">${displayNotNullData(available_beds.Unit__Unit)}</span>
                                <select name="unit" class="input-group-${available_beds.id}" id="edit_bed_input-unit-${available_beds.id}" style="display:none">
                                    ${unitOptionsToAdd}
                                </select>
                            </td>
                            <td id="Building${available_beds.id}">
                                <span class="text-group-${available_beds.id}">${displayNotNullData(available_beds.Building__Building)}</span>
                                <select name="building" class="input-group-${available_beds.id}" id="edit_bed_input-building-${available_beds.id}" style="display:none">
                                    ${buildingOptionsToAdd}
                                </select>
                            </td>
                            <td id="Floor${available_beds.id}">
                                <span class="text-group-${available_beds.id}">${available_beds.Floor}</span>
                                <select name="floor" class="input-group-${available_beds.id}" id="edit_bed_input-floor-${available_beds.id}" style="display:none" required>
                                    ${floorOptionsToAdd}
                                </select>
                                <div class="text-danger edit-bed-required"></div>
                            </td>
                            <td id="Ward${available_beds.id}">
                                <span class="text-group-${available_beds.id}">${available_beds.Ward}</span>
                                <select name="ward" class="input-group-${available_beds.id}" id="edit_bed_input-ward-${available_beds.id}" data-requirement="#edit_bed_input-support-${available_beds.id}" style="display:none" required>
                                    ${wardOptionsToAdd}
                                </select>
                                <div class="text-danger edit-bed-required"></div>
                            </td>
                            <td id="Support${available_beds.id}">
                                <span class="text-group-${available_beds.id}">${available_beds.Support}</span>
                                <select name="support" class="input-group-${available_beds.id}" id="edit_bed_input-support-${available_beds.id}" style="display:none" required>
                                    ${requirementOptionsToAdd}
                                </select>
                                <div class="text-danger edit-bed-required"></div>
                            </td>
                        </tr>`
                    
                    $(`#${elementId}`).append(html)
                }
            }
            if(response.all_used_beds.length > 0){
                for(i=0; i<response.all_used_beds.length; i++)
                {
                    used_beds = response.all_used_beds[i]
                    requirementOptionsToAdd = `<option label="Select Support"></option>`;
                    ward = used_beds['Ward']
                    if(used_beds['Support'] == 'With Oxygen')
                    {
                        requirement = 'O2';

                        requirementOptionsToAdd += 
                        `<option value="With Oxygen" selected>With Oxygen</option>
                        <option value="Non-Oxygen">Non-Oxygen</option>`
                    }
                    else if(used_beds['Support'] == 'Non-Oxygen')
                    {
                        requirement = 'NonO2';

                        requirementOptionsToAdd += 
                        `<option value="With Oxygen">With Oxygen</option>
                        <option value="Non-Oxygen" selected>Non-Oxygen</option>`
                    }
                    else if(used_beds['Support'] == 'With Ventilator')
                    {
                        requirement = 'Ventilator';
                        requirementOptionsToAdd += 
                        `<option value="With Ventilator" selected>With Ventilator</option>
                        <option value="Non-Ventilator">Non-Ventilator</option>`
                    }
                    else if(used_beds['Support'] == 'Non-Ventilator')
                    {
                        requirement = 'NonVentilator';
                        requirementOptionsToAdd += 
                        `<option value="With Ventilator">With Ventilator</option>
                        <option value="Non-Ventilator" selected>Non-Ventilator</option>`
                    }
                    var floorOptionsToAdd = `<option label="Select Floor"></option>`
                    for(j of floorList)
                    {
                        if(j[0] == used_beds['Floor'])
                        {
                            floorOptionsToAdd += `<option value="${j[0]}" selected>${j[0]}</option>`
                        }
                        else
                        {
                            floorOptionsToAdd += `<option value="${j[0]}">${j[0]}</option>`
                        }
                    }
                    var wardOptionsToAdd = `<option label="Select Ward"></option>`
                    for(j of wardList)
                    {
                        if(j[0] == used_beds['Ward'])
                        {
                            wardOptionsToAdd += `<option value="${j[0]}" selected>${j[0]}</option>`
                        }
                        else
                        {
                            wardOptionsToAdd += `<option value="${j[0]}">${j[0]}</option>`
                        }
                    }
                    var departmentOptionsToAdd = `<option label="Select Department"></option>`
                    for(j of departmentList)
                    {
                        if(j == used_beds['Department__department'])
                        {
                            departmentOptionsToAdd += `<option value="${j}" selected>${j}</option>`
                        }
                        else
                        {
                            departmentOptionsToAdd += `<option value="${j}">${j}</option>`
                        }
                    }
                    var roomOptionsToAdd = `<option label="Select Room"></option>`
                    for(j of roomList)
                    {
                        if(j == used_beds['Room__Room'])
                        {
                            roomOptionsToAdd += `<option value="${j}" selected>${j}</option>`
                        }
                        else
                        {
                            roomOptionsToAdd += `<option value="${j}">${j}</option>`
                        }
                    }
                    var unitOptionsToAdd = `<option label="Select Unit"></option>`
                    for(j of unitList)
                    {
                        if(j == used_beds['Unit__Unit'])
                        {
                            unitOptionsToAdd += `<option value="${j}" selected>${j}</option>`
                        }
                        else
                        {
                            unitOptionsToAdd += `<option value="${j}">${j}</option>`
                        }
                    }
                    var buildingOptionsToAdd = `<option label="Select Building"></option>`
                    for(j of buildingList)
                    {
                        if(j == used_beds['Building__Building'])
                        {
                            buildingOptionsToAdd += `<option value="${j}" selected>${j}</option>`
                        }
                        else
                        {
                            buildingOptionsToAdd += `<option value="${j}">${j}</option>`
                        }
                    }
                    ward = ward.split(' ')[0]
                    elementId = ward+"-"+requirement+"-"+used_beds['Availability']
                    var ele = document.getElementById(elementId);

                    var html = 
                        `<tr>
                            <td scope="row" class="left-column-sticky"><i class="far fa-edit text-primary btn-bed-edit" data-open="false" id="bedEditBtn${used_beds.id}" data-id="${used_beds.id}"></i></td>
                            <td>${displayNotNullData(used_beds.Department__department)}</td>
                            <td id="BedNo${used_beds.id}">
                                <span class="text-group-${used_beds.id}">${displayNotNullData(used_beds.Bed_No)}</span>
                                <input name="bedNo" class="input-group-${used_beds.id}" id="edit_bed_input-bedNo-${used_beds.id}" value="${displayNotNullData(used_beds.Bed_No)}" style="display:none" required>
                                <div class="text-danger edit-bed-required"></div>
                            </td>
                            <td>${displayNotNullData(used_beds.Room__Room)}</td>
                            <td>${displayNotNullData(used_beds.Unit__Unit)}</td>
                            <td>${displayNotNullData(used_beds.Building__Building)}</td>
                            <td>${displayNotNullData(used_beds.Floor)}</td>
                            <td>${displayNotNullData(used_beds.Ward)}</td>
                            <td>${displayNotNullData(used_beds.Support)}</td>
                            <td>${displayNotNullData(used_beds['bed_patientData__Booking_ID'])}</td>
                            <td>${displayNotNullData(used_beds['bed_patientData__Patient_Name'])}</td>
                            <td>${displayNotNullData(used_beds['bed_patientData__Gender'])}</td>
                            <td>${displayNotNullData(used_beds['bed_patientData__Age'])}</td>
                            <td>${displayNotNullData(used_beds['bed_patientData__Mobile'])}</td>
                            <td>${displayNotNullData(used_beds['bed_patientData__Alternative_Mobile'])}</td>
                            <td>${displayNotNullData(used_beds['bed_patientData__Email'])}</td>
                            <td>${displayNotNullData(used_beds['bed_patientData__Subdivision'])}</td>
                            <td>${displayNotNullData(used_beds['bed_patientData__State'])}</td>
                            <td>${displayNotNullData(used_beds['bed_patientData__District'])}</td>
                            <td>${displayNotNullData(used_beds['bed_patientData__Pin'])}</td>
                            <td>${formatDateTime(used_beds['bed_patientData__Admit_Time'])}</td>
                        </tr>`
                    
                    $(`#${elementId}`).append(html)
                }
            }

            if(response.all_booked_beds.length > 0){
                for(i=0; i<response.all_booked_beds.length; i++)
                {
                    booked_beds = response.all_booked_beds[i]
                    wardOptionsToAdd = `<option label="Select Ward"></option>`;
                    requirementOptionsToAdd = `<option label="Select Support"></option>`;
                    ward = booked_beds['Ward']
                    if(booked_beds['Support'] == 'With Oxygen')
                    {
                        requirement = 'O2';

                        requirementOptionsToAdd += 
                        `<option value="With Oxygen" selected>With Oxygen</option>
                        <option value="Non-Oxygen">Non-Oxygen</option>`
                    }
                    else if(booked_beds['Support'] == 'Non-Oxygen')
                    {
                        requirement = 'NonO2';

                        requirementOptionsToAdd += 
                        `<option value="With Oxygen">With Oxygen</option>
                        <option value="Non-Oxygen" selected>Non-Oxygen</option>`
                    }
                    else if(booked_beds['Support'] == 'With Ventilator')
                    {
                        requirement = 'Ventilator';
                        requirementOptionsToAdd += 
                        `<option value="With Ventilator" selected>With Ventilator</option>
                        <option value="Non-Ventilator">Non-Ventilator</option>`
                    }
                    else if(booked_beds['Support'] == 'Non-Ventilator')
                    {
                        requirement = 'NonVentilator';
                        requirementOptionsToAdd += 
                        `<option value="With Ventilator">With Ventilator</option>
                        <option value="Non-Ventilator" selected>Non-Ventilator</option>`
                    }
                    var floorOptionsToAdd = `<option label="Select Floor"></option>`
                    for(j of floorList)
                    {
                        if(j[0] == booked_beds['Floor'])
                        {
                            floorOptionsToAdd += `<option value="${j[0]}" selected>${j[0]}</option>`
                        }
                        else
                        {
                            floorOptionsToAdd += `<option value="${j[0]}">${j[0]}</option>`
                        }
                    }
                    var wardOptionsToAdd = `<option label="Select Ward"></option>`
                    for(j of wardList)
                    {
                        if(j[0] == booked_beds['Ward'])
                        {
                            wardOptionsToAdd += `<option value="${j[0]}" selected>${j[0]}</option>`
                        }
                        else
                        {
                            wardOptionsToAdd += `<option value="${j[0]}">${j[0]}</option>`
                        }
                    }
                    var departmentOptionsToAdd = `<option label="Select Department"></option>`
                    for(j of departmentList)
                    {
                        if(j == booked_beds['Department__department'])
                        {
                            departmentOptionsToAdd += `<option value="${j}" selected>${j}</option>`
                        }
                        else
                        {
                            departmentOptionsToAdd += `<option value="${j}">${j}</option>`
                        }
                    }
                    var roomOptionsToAdd = `<option label="Select Room"></option>`
                    for(j of roomList)
                    {
                        if(j == booked_beds['Room__Room'])
                        {
                            roomOptionsToAdd += `<option value="${j}" selected>${j}</option>`
                        }
                        else
                        {
                            roomOptionsToAdd += `<option value="${j}">${j}</option>`
                        }
                    }
                    var unitOptionsToAdd = `<option label="Select Unit"></option>`
                    for(j of unitList)
                    {
                        if(j == booked_beds['Unit__Unit'])
                        {
                            unitOptionsToAdd += `<option value="${j}" selected>${j}</option>`
                        }
                        else
                        {
                            unitOptionsToAdd += `<option value="${j}">${j}</option>`
                        }
                    }
                    var buildingOptionsToAdd = `<option label="Select Building"></option>`
                    for(j of buildingList)
                    {
                        if(j == booked_beds['Building__Building'])
                        {
                            buildingOptionsToAdd += `<option value="${j}" selected>${j}</option>`
                        }
                        else
                        {
                            buildingOptionsToAdd += `<option value="${j}">${j}</option>`
                        }
                    }
                    ward = ward.split(' ')[0]
                    elementId = ward+"-"+requirement+"-"+booked_beds['Availability']
                    var ele = document.getElementById(elementId);

                    var html = 
                        `<tr>
                            <td scope="row" class="left-column-sticky"><i class="far fa-edit text-primary btn-bed-edit" data-open="false" id="bedEditBtn${booked_beds.id}" data-id="${booked_beds.id}"></i></td>
                            <td>${displayNotNullData(booked_beds.Department__department)}</td>
                            <td id="BedNo${booked_beds.id}">
                                <span class="text-group-${booked_beds.id}">${displayNotNullData(booked_beds.Bed_No)}</span>
                                <input name="bedNo" class="input-group-${booked_beds.id}" id="edit_bed_input-bedNo-${booked_beds.id}" value="${displayNotNullData(booked_beds.Bed_No)}" style="display:none" required>
                                <div class="text-danger edit-bed-required"></div>
                            </td>
                            <td>${displayNotNullData(booked_beds.Room__Room)}</td>
                            <td>${displayNotNullData(booked_beds.Unit__Unit)}</td>
                            <td>${displayNotNullData(booked_beds.Building__Building)}</td>
                            <td>${displayNotNullData(booked_beds.Floor)}</td>
                            <td>${displayNotNullData(booked_beds.Ward)}</td>
                            <td>${displayNotNullData(booked_beds.Support)}</td>
                            <td>${displayNotNullData(booked_beds['bed_patientData__Patient_Name'])}</td>
                            <td>${displayNotNullData(booked_beds['bed_patientData__Gender'])}</td>
                            <td>${displayNotNullData(booked_beds['bed_patientData__Age'])}</td>
                            <td>${displayNotNullData(booked_beds['bed_patientData__Mobile'])}</td>
                            <td>${displayNotNullData(used_beds['bed_patientData__Alternative_Mobile'])}</td>
                            <td>${displayNotNullData(booked_beds['bed_patientData__Email'])}</td>
                            <td>${displayNotNullData(used_beds['bed_patientData__Subdivision'])}</td>
                            <td>${displayNotNullData(booked_beds['bed_patientData__State'])}</td>
                            <td>${displayNotNullData(booked_beds['bed_patientData__District'])}</td>
                            <td>${displayNotNullData(booked_beds['bed_patientData__Pin'])}</td>
                            <td>${formatDateTime(booked_beds['bed_patientData__Booking_Time'])}</td>
                            <td>${formatDateTime(booked_beds['bed_patientData__Expire_Time'])}</td>
                        </tr>`
                    
                    $(`#${elementId}`).append(html)
                }
            }
            
            $( ".table-bed-data" ).each(function(index) {
                let inside =  $(this).html();
                if(inside == ''){
                    html = `<tr> 
                                <td colspan='100%' align='center' style='text-align:center'><h4 class='text-muted'>No Data To Show</h4></td> 
                            </tr>`
                    $(this).html(html);
                }
            });

            $('#total_beds_count').html(response.total_beds_count);
            $('#available_beds_count').html(response.available_beds_count);
            $('#used_beds_count').html(response.used_beds_count);
            $('#booked_beds_count').html(response.booked_beds_count);
            $('#available_percantage_beds').html(response.available_beds_percent);
            $('#used_percantage_beds').html(response.used_beds_percent);

            $('#gen-O2-total-beds').html(response.gen_O2_total);
            $('#gen-O2-available-beds').html(response.gen_O2_available);
            $('#gen-O2-used-beds').html(response.gen_O2_used);
            $('#gen-O2-booked-beds').html(response.gen_O2_booked);
            $('#gen-NoO2-total-beds').html(response.gen_NonO2_total);
            $('#gen-NoO2-available-beds').html(response.gen_NonO2_available);
            $('#gen-NoO2-used-beds').html(response.gen_NonO2_used);
            $('#gen-NoO2-booked-beds').html(response.gen_NonO2_booked);
            $('#gen-total-beds').html(response.gen_total);
            $('#gen-available-beds').html(response.gen_available);
            $('#gen-used-beds').html(response.gen_used);
            $('#gen-booked-beds').html(response.gen_booked);

            $('#female-O2-total-beds').html(response.female_O2_total);
            $('#female-O2-available-beds').html(response.female_O2_available);
            $('#female-O2-used-beds').html(response.female_O2_used);
            $('#female-O2-booked-beds').html(response.female_O2_booked);
            $('#female-NoO2-total-beds').html(response.female_NonO2_total);
            $('#female-NoO2-available-beds').html(response.female_NonO2_available);
            $('#female-NoO2-used-beds').html(response.female_NonO2_used);
            $('#female-NoO2-booked-beds').html(response.female_NonO2_booked);
            $('#female-total-beds').html(response.female_total);
            $('#female-available-beds').html(response.female_available);
            $('#female-used-beds').html(response.female_used);
            $('#female-booked-beds').html(response.female_booked);

            $('#male-O2-total-beds').html(response.male_O2_total);
            $('#male-O2-available-beds').html(response.male_O2_available);
            $('#male-O2-used-beds').html(response.male_O2_used);
            $('#male-O2-booked-beds').html(response.male_O2_booked);
            $('#male-NoO2-total-beds').html(response.male_NonO2_total);
            $('#male-NoO2-available-beds').html(response.male_NonO2_available);
            $('#male-NoO2-used-beds').html(response.male_NonO2_used);
            $('#male-NoO2-booked-beds').html(response.male_NonO2_booked);
            $('#male-total-beds').html(response.male_total);
            $('#male-available-beds').html(response.male_available);
            $('#male-used-beds').html(response.male_used);
            $('#male-booked-beds').html(response.male_booked);

            $('#child-O2-total-beds').html(response.child_O2_total);
            $('#child-O2-available-beds').html(response.child_O2_available);
            $('#child-O2-used-beds').html(response.child_O2_used);
            $('#child-O2-booked-beds').html(response.child_O2_booked);
            $('#child-NoO2-total-beds').html(response.child_NonO2_total);
            $('#child-NoO2-available-beds').html(response.child_NonO2_available);
            $('#child-NoO2-used-beds').html(response.child_NonO2_used);
            $('#child-NoO2-booked-beds').html(response.child_NonO2_booked);
            $('#child-total-beds').html(response.child_total);
            $('#child-available-beds').html(response.child_available);
            $('#child-used-beds').html(response.child_used);
            $('#child-booked-beds').html(response.child_booked);
            
            $('#icu-venti-total-beds').html(response.icu_Ventilation_total);
            $('#icu-venti-available-beds').html(response.icu_Ventilation_available);
            $('#icu-venti-used-beds').html(response.icu_Ventilation_used);
            $('#icu-venti-booked-beds').html(response.icu_Ventilation_booked);
            $('#icu-Noventi-total-beds').html(response.icu_NonVentilation_total);
            $('#icu-Noventi-available-beds').html(response.icu_NonVentilation_available);
            $('#icu-Noventi-used-beds').html(response.icu_NonVentilation_used);
            $('#icu-Noventi-booked-beds').html(response.icu_NonVentilation_booked);
            $('#icu-total-beds').html(response.icu_total);
            $('#icu-available-beds').html(response.icu_available);
            $('#icu-used-beds').html(response.icu_used);
            $('#icu-booked-beds').html(response.icu_booked);

            $('#picu-venti-total-beds').html(response.picu_Ventilation_total);
            $('#picu-venti-available-beds').html(response.picu_Ventilation_available);
            $('#picu-venti-used-beds').html(response.picu_Ventilation_used);
            $('#picu-venti-booked-beds').html(response.picu_Ventilation_booked);
            $('#picu-Noventi-total-beds').html(response.picu_NonVentilation_total);
            $('#picu-Noventi-available-beds').html(response.picu_NonVentilation_available);
            $('#picu-Noventi-used-beds').html(response.picu_NonVentilation_used);
            $('#picu-Noventi-booked-beds').html(response.picu_NonVentilation_booked);
            $('#picu-total-beds').html(response.picu_total);
            $('#picu-available-beds').html(response.picu_available);
            $('#picu-used-beds').html(response.picu_used);
            $('#picu-booked-beds').html(response.picu_booked);

            $('#nicu-venti-total-beds').html(response.nicu_Ventilation_total);
            $('#nicu-venti-available-beds').html(response.nicu_Ventilation_available);
            $('#nicu-venti-used-beds').html(response.nicu_Ventilation_used);
            $('#nicu-venti-booked-beds').html(response.nicu_Ventilation_booked);
            $('#nicu-Noventi-total-beds').html(response.nicu_NonVentilation_total);
            $('#nicu-Noventi-available-beds').html(response.nicu_NonVentilation_available);
            $('#nicu-Noventi-used-beds').html(response.nicu_NonVentilation_used);
            $('#nicu-Noventi-booked-beds').html(response.nicu_NonVentilation_booked);
            $('#nicu-total-beds').html(response.nicu_total);
            $('#nicu-available-beds').html(response.nicu_available);
            $('#nicu-used-beds').html(response.nicu_used);
            $('#nicu-booked-beds').html(response.nicu_booked);

            lastUpdate = String(formatDateTime(response.lastUpdate))
            lastUpdate = lastUpdate.replace(", ", "<br>");
            $('#lastUpdate_beds').html(lastUpdate);
            
            $("#bed-refresh").removeClass('fa-spin');
            $('.bed-data-front').show();
            $('.bed-data-front-loading').hide();
            $('.bed-data-front-loading').html('');

            $("#bed-refresh-btn").prop('disabled', false);

            loadOxygenGauge(remain);
        },
        error: function()
        {

        },
    });
}

var ward_changed = false;
$(".table-bed-data").on('click', ".btn-bed-edit", function(event){
    var id = $(this).attr('data-id');
    var isOpen = $(this).attr('data-open');
    if(isOpen == 'true'){
        closeEdit(id);
    }
    else{
        openEdit(id);
    }
});

function openEdit(id)
{
    $(`.text-group-${id}`).css('display', 'none');
    $(`.input-group-${id}`).css('display', ''); 

    $("#bedEditBtn"+id).removeClass("fad fa-spinner-third fa-spin")
    $("#bedEditBtn"+id).removeClass("far fa-edit");
    $("#bedEditBtn"+id).addClass("far fa-check-square");
    $("#bedEditBtn"+id).attr("data-open", 'true');
}

function closeEdit(id)
{
    $(".edit-bed-required").html("")
    empty_field = false
    $(`[class='input-group-${id}'][required]`).each(function(index, element){
        if($(this).val().replace(/ /g, '') == ''){
            empty_field = true
            next_sibling = $(this).next(".edit-bed-required")
            $(next_sibling).html('Fill the input')
        }
    });
    if(!empty_field){
        $("#bedEditBtn"+id).removeClass("far fa-check-square");
        $("#bedEditBtn"+id).removeClass("far fa-edit");
        $("#bedEditBtn"+id).addClass("fad fa-spinner-third fa-spin")
        data = $(`[class='input-group-${id}']`).serializeToJSON({
            parseBooleans: false,
        });
        data['csrfmiddlewaretoken'] = $('input[name=csrfmiddlewaretoken]').val()
        data['bedId'] = id
        $.ajax(
        {
            type:'POST',
            url: "/edit-bed/",
            data: data,
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                if(response.changed == true)
                {
                    $(`.text-group-${id}`).css('display', '');
                    $(`.input-group-${id}`).css('display', 'none');

                    $(`[class='input-group-${id}']`).each(function(index, element){
                        text_field = $(this).prev(`.text-group-${id}`)
                        $(text_field).html(element.value)
                    })

                    $("#bedEditBtn"+id).removeClass("fad fa-spinner-third fa-spin")
                    $("#bedEditBtn"+id).removeClass("fa-check-square");
                    $("#bedEditBtn"+id).addClass("far fa-edit");
                    $("#bedEditBtn"+id).attr("data-open", 'false');

                    if(response.ward_changed){
                        ward_changed = true;
                    }
                }
                else if(response.changed == false){
                    $("#bedEditBtn"+id).removeClass("fad fa-spinner-third fa-spin")
                    $("#bedEditBtn"+id).removeClass("far fa-edit");
                    $("#bedEditBtn"+id).addClass("far fa-check-square");
                    showSingleButtonAlert("Bed Is In Use", "A patient is admitted in the bed or a booking is assigned to the bed. So you can't change the value of Department, Ward, Support, Room, Unit, Building for this bed.", "Okay");

                    $(`[class='text-group-${id}']`).each(function(index, element){
                        input_field = $(this).next(`.input-group-${id}`)
                        $(input_field).val(element.innerHTML)
                    })
                }
                else if(response.exists == true){
                    $("#bedEditBtn"+id).removeClass("fad fa-spinner-third fa-spin")
                    $("#bedEditBtn"+id).removeClass("far fa-edit");
                    $("#bedEditBtn"+id).addClass("far fa-check-square");
                    showSingleButtonAlert("Already Exists", "A bed with the given inputs already exists", "Okay");

                    $(`[class='text-group-${id}']`).each(function(index, element){
                        input_field = $(this).next(`.input-group-${id}`)
                        $(input_field).val(element.innerHTML)
                    })
                }
            },
            error: function(){
                $("#bedEditBtn"+id).removeClass("fad fa-spinner-third fa-spin")
                $("#bedEditBtn"+id).removeClass("far fa-edit");
                $("#bedEditBtn"+id).addClass("far fa-check-square");
                showSingleButtonAlert("Failed", "An error ocurred to edit the bed", "Try Again");
                $(`[class='text-group-${id}']`).each(function(index, element){
                    input_field = $(this).next(`.input-group-${id}`)
                    $(input_field).val(element.innerHTML)
                })
            }
        });
    } 
}

$(".bed-zoom-card").on('click', function(event){
    let target = $(this).attr('data-target');
    $(target).modal('show');
});

$(".modal-bed-info").on('hide.bs.modal', function(){
    if(ward_changed == true){
        ward_changed = false;
        refreshBedData();
    }
});



function displayUpdateBtn(data){
    if(data.Is_Unknown){
        html = 
        `<div class="mb-1" id="updateBtn-div-${data['Booking_ID']}">
            <button class='btn btn-sm btn-info' type='button' data-toggle='modal' data-target='#update-${data['Booking_ID']}'> 
                Update Details
            </button>
        </div>`
        return html;
    }
    else{
        return '';
    }
}
function displayUpdateModal(data){
    if(data.Is_Unknown){
        html =
        `<!-- Modal --> 
        <div class='modal fade' id='update-${data['Booking_ID']}' data-backdrop='static' data-keyboard='false' 
                tabindex='-1' aria-labelledby='updateLabel${data['Booking_ID']}' aria-hidden='true'> 
            <div class='modal-dialog modal-lg'> 
                <div class='modal-content'> 
                    <div class='modal-header bg-info' style='color:white'> 
                        <h5 class='modal-title' id='updateLabel${data['Booking_ID']}'><strong style='color:white'>
                        Update Patient's Details</strong></h5> 
                        <button type='button' class='close' data-dismiss='modal' aria-label='Close'> 
                            <span aria-hidden='true' style='color:white'>&times;</span> 
                        </button> 
                    </div>
                    <div class='modal-body'> 
                        <form class='patientUpdateForm' id='patientUpdate-${data['Booking_ID']}' data-id='${data['Booking_ID']}' method='post' autocomplete='off'> 
                            <h6 class="text-secondary">Patient Id: ${data['Booking_ID']}</h6>
                            <input type="hidden" name="patient_id" form="patientUpdate-${data['Booking_ID']}" value="${data['Booking_ID']}" required>
                            <br>
                            <div class="row">
                                <div class="col-md">
                                    <div class='input-group mb-3'> 
                                        <div class='input-group-prepend'> 
                                            <label class='input-group-text' for='update-patient-name-${data['Booking_ID']}' style='background-color:#17a2b8; color:white'>Name</label> 
                                        </div> 
                                        <input type="text" inputmode="text" class='form-control input-sm patient-update-input' name='name' id='update-patient-name-${data['Booking_ID']}' form='patientUpdate-${data['Booking_ID']}' placeholder="Patient's Name" required>
                                    </div>
                                </div>
                                <div class="col-md">
                                    <div class='input-group mb-3'> 
                                        <div class='input-group-prepend'> 
                                            <label class='input-group-text' for='update-patient-age-${data['Booking_ID']}' style='background-color:#17a2b8; color:white'>Age</label> 
                                        </div> 
                                        <input type="number" inputmode="numeric" class='form-control input-sm patient-update-input' name='age' id='update-patient-age-${data['Booking_ID']}' form='patientUpdate-${data['Booking_ID']}' required>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md">
                                    <div class='input-group mb-3'> 
                                        <div class='input-group-prepend'> 
                                            <label class='input-group-text' for='update-patient-gender-${data['Booking_ID']}' style='background-color:#17a2b8; color:white'>Gender</label> 
                                        </div> 
                                        <select class='form-control input-sm patient-update-input' name='gender' id='update-patient-gender-${data['Booking_ID']}' form='patientUpdate-${data['Booking_ID']}' required>
                                            <option label="Select Gender"></option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md">
                                    <div class='input-group'> 
                                        <div class='input-group-prepend'> 
                                            <label class='input-group-text' for='update-patient-email-${data['Booking_ID']}' style='background-color:#17a2b8; color:white'>Email</label> 
                                        </div> 
                                        <input type="email" inputmode="email" maxlength="100" class='form-control input-sm patient-update-input' name='email' id='update-patient-email-${data['Booking_ID']}' form='patientUpdate-${data['Booking_ID']}' placeholder="example@domain.com">
                                    </div>
                                    <div class="text-info mb-3 text-left" style="font-size:14px">This field is optional</div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md">
                                    <div class='input-group mb-3'> 
                                        <div class='input-group-prepend'> 
                                            <label class='input-group-text' for='update-patient-mobile-${data['Booking_ID']}' style='background-color:#17a2b8; color:white'>Mobile</label> 
                                        </div> 
                                        <input type="tel" inputmode="tel" minlength="10" maxlength="10" class='form-control input-sm patient-update-input' name='mobile' id='update-patient-mobile-${data['Booking_ID']}' form='patientUpdate-${data['Booking_ID']}' placeholder="10 digit mobile no" required>
                                    </div>
                                </div>
                                <div class="col-md">
                                    <div class='input-group'> 
                                        <div class='input-group-prepend'> 
                                            <label class='input-group-text' for='update-patient-altmobile-${data['Booking_ID']}' style='background-color:#17a2b8; color:white'>Alternative Mobile</label> 
                                        </div> 
                                        <input type="tel" inputmode="tel" minlength="10" maxlength="10" class='form-control input-sm patient-update-input' name='alternative_mobile' id='update-patient-altmobile-${data['Booking_ID']}' form='patientUpdate-${data['Booking_ID']}' placeholder="10 digit mobile no">
                                    </div>
                                    <div class="text-info mb-3 text-left" style="font-size:14px">This field is optional</div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md">
                                    <div class='input-group mb-3'> 
                                        <div class='input-group-prepend'> 
                                            <label class='input-group-text' for='update-patient-pin-${data['Booking_ID']}' style='background-color:#17a2b8; color:white'>Pin</label> 
                                        </div> 
                                        <input type="text" inputmode="numeric" minlength="6" maxlength="6" class='form-control input-sm patient-update-input patient-update-input-pin' name='pin' id='update-patient-pin-${data['Booking_ID']}' form='patientUpdate-${data['Booking_ID']}' data-id="${data['Booking_ID']}" autocomplete='on' required>
                                        <div align="right">
                                            <i class="fad fa-spinner-third fa-spin text-info" id="PatientUpdate-pinLoader" style="font-size:25px;position:absolute;top:6px;right:20px;display:none"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md">
                                    <div class='input-group mb-3'> 
                                        <div class='input-group-prepend'> 
                                            <label class='input-group-text' for='update-patient-subdivision-${data['Booking_ID']}' style='background-color:#17a2b8; color:white'>Subdivision</label> 
                                        </div> 
                                        <input type="text" inputmode="text" class='form-control input-sm patient-update-input' name='subdivision' id='update-patient-subdivision-${data['Booking_ID']}' form='patientUpdate-${data['Booking_ID']}' autocomplete='on' required>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md">
                                    <div class='input-group mb-3'> 
                                        <div class='input-group-prepend'> 
                                            <label class='input-group-text' for='update-patient-state-${data['Booking_ID']}' style='background-color:#17a2b8; color:white'>State</label> 
                                        </div> 
                                        <select class='form-control input-sm patient-update-input patient-update-input-state' name='state' id='update-patient-state-${data['Booking_ID']}' form='patientUpdate-${data['Booking_ID']}' data-district_option="#update-patient-district-${data['Booking_ID']}" required>
                                            ${document.getElementById("patient-state").innerHTML}
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md">
                                    <div class='input-group mb-3'> 
                                        <div class='input-group-prepend'> 
                                            <label class='input-group-text' for='update-patient-district-${data['Booking_ID']}' style='background-color:#17a2b8; color:white'>District</label> 
                                        </div> 
                                        <select class='form-control input-sm patient-update-input' name='district' id='update-patient-district-${data['Booking_ID']}' form='patientUpdate-${data['Booking_ID']}' required>
                                            <option label="Select District"></option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class='text-danger ml-1' id='patient-update-message-${data['Booking_ID']}' align='left'></div> 
                        </form>
                    </div> 
                    <div class='modal-footer'> 
                        <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close 
                        </button> 
                        <button type='submit' class='btn btn-info change-bed btn-change-bed' data-id="${data['Booking_ID']}"
                                id='updateSub-${data['Booking_ID']}' value='edit' form='patientUpdate-${data['Booking_ID']}' 
                                style='border:none;color:white'> 
                            Update 
                        </button> 
                    </div> 
                </div>
            </div> 
        </div>`
        return html;
    }
    else{
        return '';
    }
}

function displayNotNullData(data){
    if(data == null || data == undefined || data == 'None'){
        return '';
    }
    return data;
}

$('#admitFilter').on('submit', function(event){
    event.preventDefault();
    $('#admitSearchBtnText').html('Searching')
    admitSearch({action:'Searching'});
});
document.getElementById('admitSearchClearBtn').addEventListener("click", function() {
    $('#admitSearchClearBtn').html('Clearing')
    admitSearch({action:'All'});
});
$('#admitDataRefresh').on("click", function() {
    admitSearch({action:'All'});
});

var admitSearchPage = 1;
$("#admitDataBody").on('click', "#admit-loadMore", function(){
    admitSearchPage += 1;
    $(this).prop('disabled', true);
    $(this).html('Loading......');
    admitSearch({action:'Searching', page:admitSearchPage});
});

function admitSearch({action='Searching', page=1}={})
{
    if(action == 'All')
    {
        admitSearchPage = 1;
        $("#admitFilter").trigger('reset');
        $("#admitSearch-requirement").html(`<option label="Select Support"></option>`);
        var hId = $("#id_hospital").val();
        $("#admitSearch-hospitalId").val(hId);
        action = 'All';
    }
    if(page == 1){
        html = `<tr id='admitLoading'> 
                    <td colspan='18' align='center' style='text-align:center'><h4 class='text-muted'>Loading....</h4></td> 
                </tr>`
        $('#admitDataBody').html(html);
        $("#admitDataBodyModal").html('');
    }
    
    var beforeDash = $("#admitSearch-hospitalId").val();
    var afterDash = $('#admitSearch-bookingId').val();
    var bId = '';
    if(afterDash != ''){
        bId = beforeDash + "-" + afterDash;
    }
    data = $(`[form='admitFilter']`).serializeToJSON({
        parseBooleans: false,
    });
    data['bookingId'] = bId;
    data['page'] = page;
    $.ajax(
    {
        type:'GET',
        url: $("#admitFilter").attr('action'),
        data: data,
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $('#admitSearchClearBtn').html('Clear');
            $('#admitSearchBtnText').html('Search');
            if(page == 1){
                $('#admitDataBody').html('');
            }
            if(response.admitBook.length <= 0 && page == 1)
            {
                html = `<tr id='admitLoading'> 
                    <td colspan='18' align='center' style='text-align:center'><h4 class='text-muted'>No Data Found</h4></td> 
                </tr>`
                $('#admitDataBody').html(html);
            }
            else
            {   
                departmentOptions = $("#book-department").html();            
                wardOptions = $("#book-ward").html();
                roomOptions = $("#book-room").html();
                unitOptions = $("#book-unit").html();
                stateOptions = $("#patient-state").html();
                for(var i=0; i<response.admitBook.length; i++)
                {
                    var html =
                    `<tr id='${response.admitBook[i]['Booking_ID']}' class='admitData'> 
                        <td class='table-serial-no left-column-sticky' align="center"></td> 
                        <td class="left-column-sticky-1">
                            <a href="/patient-info/${response.admitBook[i]['Booking_ID']}" target="_blank">${response.admitBook[i]['Booking_ID']}</a>
                        </td> 
                        <td id="admitData-Patient_Name-${response.admitBook[i]['Booking_ID']}">${response.admitBook[i]['Patient_Name']}</td> 
                        <td id="admitData-Gender-${response.admitBook[i]['Booking_ID']}">${response.admitBook[i]['Gender']}</td> 
                        <td id="admitData-Age-${response.admitBook[i]['Booking_ID']}">${response.admitBook[i]['Age']}</td> 
                        <td>
                            <form id="admitData-disease-change-form-${response.admitBook[i]['Booking_ID']}" class="admitData-disease-change-form" data-id="${response.admitBook[i]['Booking_ID']}">
                                <div>
                                    <div>
                                        <span id="admitData-disease-${response.admitBook[i]['Booking_ID']}">${response.admitBook[i]['Disease__Disease']}</span>
                                        <div id="autocomplete-disease-change-${response.admitBook[i]['Booking_ID']}" class="autocomplete autocomplete-disease">
                                            <input type="text" class="autocomplete-input admitData-disease-input text-capitalize" id="admitData-disease-input-${response.admitBook[i]['Booking_ID']}" value="${response.admitBook[i]['Disease__Disease']}" form="admitData-disease-change-form-${response.admitBook[i]['Booking_ID']}" required style="display:none; min-width: 100px">
                                            <ul class="autocomplete-result-list"></ul>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <button type="submit" class="admitData-disease-submit-btn disease-autocomplete-input" id="admitData-disease-submit-btn-${response.admitBook[i]['Booking_ID']}" data-id="${response.admitBook[i]['Booking_ID']}" form="admitData-disease-change-form-${response.admitBook[i]['Booking_ID']}" style="display:none; background:none; border:none; outline:none">
                                            <i class="fa-regular fa-square-check"></i>
                                        </button>
                                        <button type="button" class="admitData-disease-edit-btn" id="admitData-disease-edit-btn-${response.admitBook[i]['Booking_ID']}" data-id="${response.admitBook[i]['Booking_ID']}" style="background:none; border:none; outline:none">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </td> 
                        <td id="admitData-Email-${response.admitBook[i]['Booking_ID']}">${response.admitBook[i]['Email']}</td> 
                        <td id="admitData-Mobile-${response.admitBook[i]['Booking_ID']}">${response.admitBook[i]['Mobile']}</td> 
                        <td id="admitData-Alternative_Mobile-${response.admitBook[i]['Booking_ID']}">${response.admitBook[i]['Alternative_Mobile']}</td> 
                        <td id="admitData-Subdivision-${response.admitBook[i]['Booking_ID']}">${response.admitBook[i]['Subdivision']}</td> 
                        <td id="admitData-State-${response.admitBook[i]['Booking_ID']}">${response.admitBook[i]['State']}</td> 
                        <td id="admitData-District-${response.admitBook[i]['Booking_ID']}">${response.admitBook[i]['District']}</td> 
                        <td id="admitData-Pin-${response.admitBook[i]['Booking_ID']}">${response.admitBook[i]['Pin']}</td> 
                        <td id='department${response.admitBook[i]['Booking_ID']}'>${displayNotNullData(response.admitBook[i]['Bed_No__Department__department'])}</td> 
                        <td id='bedno${response.admitBook[i]['Booking_ID']}'>${displayNotNullData(response.admitBook[i]['Bed_No__Bed_No'])}</td> 
                        <td id='ward${response.admitBook[i]['Booking_ID']}'>${displayNotNullData(response.admitBook[i]['Bed_No__Ward'])}</td>
                        <td id='requirement${response.admitBook[i]['Booking_ID']}'>${displayNotNullData(response.admitBook[i]['Bed_No__Support'])}</td> 
                        <td id='room${response.admitBook[i]['Booking_ID']}'>${displayNotNullData(response.admitBook[i]['Bed_No__Room__Room'])}</td> 
                        <td id='unit${response.admitBook[i]['Booking_ID']}'>${displayNotNullData(response.admitBook[i]['Bed_No__Unit__Unit'])}</td> 
                        <td id='floor${response.admitBook[i]['Booking_ID']}'>${displayNotNullData(response.admitBook[i]['Bed_No__Floor'])}</td> 
                        <td id='building${response.admitBook[i]['Booking_ID']}'>${displayNotNullData(response.admitBook[i]['Bed_No__Building__Building'])}</td> 
                        <td>${formatDateTime(response.admitBook[i]['Admit_Time'])}</td> 
                        <td class="right-column-sticky">
                            ${displayUpdateBtn(response.admitBook[i])}
                            <div>
                                <button class='btn btn-sm btn-primary' type='button' data-toggle='modal' data-target='#changebed-${response.admitBook[i]['Booking_ID']}'> 
                                    Shift
                                </button> 
                            </div>
                            <div class="mt-1">
                                <div class="dropdown">
                                    <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButtonMoreAction" data-toggle="dropdown" aria-expanded="false">
                                        More
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonMoreAction">
                                        <button type='button' class='dropdown-item btn btn-more-action-item Btn-Patient-Release mb-2' data-patient-name="${response.admitBook[i]['Patient_Name']}" data-patient-id="${response.admitBook[i]['Booking_ID']}" id="BtnRelease-${response.admitBook[i]['Booking_ID']}"> 
                                            Release 
                                        </button>
                                        <button type='button' class='dropdown-item btn btn-more-action-item Btn-Patient-Refer mb-2' data-toggle="modal" data-target='#patientEditReferModel-${response.admitBook[i]['Booking_ID']}' data-patient-name="${response.admitBook[i]['Patient_Name']}" data-patient-id="${response.admitBook[i]['Booking_ID']}" id="BtnRefer-${response.admitBook[i]['Booking_ID']}"> 
                                            Refer 
                                        </button>
                                        <button type='button' class='dropdown-item btn btn-more-action-item Btn-Patient-Died mb-2' data-patient-name="${response.admitBook[i]['Patient_Name']}" data-patient-id="${response.admitBook[i]['Booking_ID']}" id="BtnDeath-${response.admitBook[i]['Booking_ID']}"> 
                                            Died 
                                        </button>
                                    </div>
                                </div> 
                            </div>
                        </td>
                    </tr>`
                    $(`#admitDataBody`).append(html)
                    var modalHTML = `
                        <!-- Modal --> 
                        <div class='modal fade' id='changebed-${response.admitBook[i]['Booking_ID']}' data-backdrop='static' data-keyboard='false' 
                                tabindex='-1' aria-labelledby='changebedLabel${response.admitBook[i]['Booking_ID']}' aria-hidden='true'> 
                            <div class='modal-dialog modal-md'> 
                                <div class='modal-content'> 
                                    <div class='modal-header bg-primary' style='color:white'> 
                                        <h5 class='modal-title' id='changebedLabel${response.admitBook[i]['Booking_ID']}'><strong style='color:white'>Shift  Patient</strong></h5> 
                                        <button type='button' class='close' data-dismiss='modal' aria-label='Close'> 
                                            <span aria-hidden='true' style='color:white'>&times;</span> 
                                        </button> 
                                    </div>
                                    <div class='modal-body'> 
                                        <form class='patient-shift-form' id='patient-shift-form-${response.admitBook[i]['Booking_ID']}' data-id='${response.admitBook[i]['Booking_ID']}' method='post' autocomplete='on'> 
                                            <h6 style='color:#007bff' align='center'> Patient's Name: <b>${response.admitBook[i]['Patient_Name']}</b></h6>
                                            <p class="text-primary">Patient Id: ${response.admitBook[i]['Booking_ID']}</p>
                                            <br>
                                            <div class='input-group mb-3'> 
                                                <div class='input-group-prepend'> 
                                                    <label class='input-group-text' for='change-department-${response.admitBook[i]['Booking_ID']}' style='background-color:#007bff; color:white'>Department</label> 
                                                </div> 
                                                <select data-id='${response.admitBook[i]['Booking_ID']}' data-bed="#change-Bed_No-${response.admitBook[i]['Booking_ID']}" class='form-control input-sm bed-change-input admitted-patient-department-edit' name='department' id='change-department-${response.admitBook[i]['Booking_ID']}' form='patient-shift-form-${response.admitBook[i]['Booking_ID']}' required> 
                                                    ${departmentOptions}
                                                </select>
                                            </div>
                                            <div class='input-group mb-3'> 
                                                <div class='input-group-prepend'> 
                                                    <label class='input-group-text' for='change-ward-${response.admitBook[i]['Booking_ID']}' style='background-color:#007bff; color:white'>Ward</label> 
                                                </div> 
                                                <select data-id='${response.admitBook[i]['Booking_ID']}' data-requirement='#change-requirement-${response.admitBook[i]['Booking_ID']}' data-bed="#change-Bed_No-${response.admitBook[i]['Booking_ID']}" class='form-control input-sm bed-change-input admitted-patient-ward-edit' name='ward' id='change-ward-${response.admitBook[i]['Booking_ID']}' form='patient-shift-form-${response.admitBook[i]['Booking_ID']}' required> 
                                                    ${wardOptions}
                                                </select>
                                            </div>
                                            <div class='input-group mb-3'> 
                                                <div class='input-group-prepend'> 
                                                    <label class='input-group-text' for='change-requirement-${response.admitBook[i]['Booking_ID']}' style='background-color:#007bff; color:white'>Support</label> 
                                                </div> 
                                                <select data-book_id="${response.admitBook[i]['Booking_ID']}" class='form-control input-sm bed-change-input patient-edit-requirement' name='requirement' id='change-requirement-${response.admitBook[i]['Booking_ID']}' 
                                                        form='patient-shift-form-${response.admitBook[i]['Booking_ID']}' 
                                                        required> 
                                                    <option label='Select Support'></option> 
                                                </select> 
                                            </div> 
                                            <div class='input-group mb-3'> 
                                                <div class='input-group-prepend'> 
                                                    <label class='input-group-text' for='change-room-${response.admitBook[i]['Booking_ID']}' style='background-color:#007bff; color:white'>Room</label> 
                                                </div> 
                                                <select data-id='${response.admitBook[i]['Booking_ID']}' data-bed="#change-Bed_No-${response.admitBook[i]['Booking_ID']}" class='form-control input-sm bed-change-input admitted-patient-room-edit' name='room' id='change-room-${response.admitBook[i]['Booking_ID']}' form='patient-shift-form-${response.admitBook[i]['Booking_ID']}'> 
                                                    ${roomOptions}
                                                </select>
                                            </div>
                                            <div class='input-group mb-3'> 
                                                <div class='input-group-prepend'> 
                                                    <label class='input-group-text' for='change-unit-${response.admitBook[i]['Booking_ID']}' style='background-color:#007bff; color:white'>Unit</label> 
                                                </div> 
                                                <select data-id='${response.admitBook[i]['Booking_ID']}' data-bed="#change-Bed_No-${response.admitBook[i]['Booking_ID']}" class='form-control input-sm bed-change-input admitted-patient-unit-edit' name='unit' id='change-unit-${response.admitBook[i]['Booking_ID']}' form='patient-shift-form-${response.admitBook[i]['Booking_ID']}'> 
                                                    ${unitOptions}
                                                </select>
                                            </div>
                                            <div class='input-group'> 
                                                <div class='input-group-prepend'> 
                                                    <label class='input-group-text' for='change-Bed_No-${response.admitBook[i]['Booking_ID']}' style='background-color:#007bff; color:white'>Bed</label> 
                                                </div> 
                                                <select name='Bed_Id' id='change-Bed_No-${response.admitBook[i]['Booking_ID']}' class='form-control input-sm bed-change-input' form='patient-shift-form-${response.admitBook[i]['Booking_ID']}'> 
                                                    <option label="Select Bed"></option>
                                                </select> 
                                            </div>
                                            <div class='text-danger ml-3 mb-3' id='edit-bed-message-no-bed-${response.admitBook[i]['Booking_ID']}' align='left'></div>
                                            <div id="autocomplete-shift-patient-disease-${response.admitBook[i]['Booking_ID']}" class="autocomplete autocomplete-disease">
                                                <div class="input-group mb-1">
                                                    <div class="input-group-prepend">
                                                        <label class="input-group-text" for="patient-disease-${response.admitBook[i]['Booking_ID']}" style='background-color:#007bff; color:white'>Diagnosis</label>
                                                    </div>
                                                    <input type="text" inputmode="text" name="disease" id="patient-disease-${response.admitBook[i]['Booking_ID']}" class="autocomplete-input form-control input-sm bed-change-input disease-autocomplete-input text-capitalize" form="patient-shift-form-${response.admitBook[i]['Booking_ID']}" value="${response.admitBook[i]['Disease__Disease']}" required autocomplete="off">
                                                </div>
                                                <ul class="autocomplete-result-list"></ul>
                                            </div>
                                        </form>
                                    </div> 
                                    <div class='modal-footer'> 
                                        <div class='text-danger mr-1' id='edit-bed-message-${response.admitBook[i]['Booking_ID']}' align='right'></div> 
                                        <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close 
                                        </button> 
                                        <button type='submit' class='btn btn-primary change-bed btn-change-bed' data-id="${response.admitBook[i]['Booking_ID']}"
                                                id='shift_bed_submit_btn-${response.admitBook[i]['Booking_ID']}' value='edit' form='patient-shift-form-${response.admitBook[i]['Booking_ID']}' 
                                                style='border:none;color:white'> 
                                            Change Bed
                                        </button> 
                                    </div> 
                                </div>
                            </div> 
                        </div>
                        ${displayUpdateModal(response.admitBook[i])}
                        <!-- Modal --> 
                        <div class='modal fade' id='patientEditReferModel-${response.admitBook[i]['Booking_ID']}' data-backdrop='static' data-keyboard='false' 
                                tabindex='-1' aria-labelledby='patientEditReferModelLabel${response.admitBook[i]['Booking_ID']}' aria-hidden='true'> 
                            <div class='modal-dialog modal-md'> 
                                <div class='modal-content'> 
                                    <div class='modal-header bg-warning' style='color:white'> 
                                        <h5 class='modal-title' id='patientEditReferModelLabel${response.admitBook[i]['Booking_ID']}'><strong style='color:white'>
                                        Refer The Patient</strong></h5> 
                                        <button type='button' class='close' data-dismiss='modal' aria-label='Close'> 
                                            <span aria-hidden='true' style='color:white'>&times;</span> 
                                        </button> 
                                    </div>
                                    <div class='modal-body'>
                                        <form class='patientEditReferForm' id='patientEditRefer-${response.admitBook[i]['Booking_ID']}' data-id='${response.admitBook[i]['Booking_ID']}' method='post' autocomplete='on'> 
                                            <h6 style='color:#d6b627' align='center'> Patient's Name: <b>${response.admitBook[i]['Patient_Name']}</b></h6>
                                            <p class="text-secondary">Patient Id: ${response.admitBook[i]['Booking_ID']}</p>
                                            <br> 
                                            <h6>Refer To:</h6>
                                            <div class='input-group mb-3'> 
                                                <div class='input-group-prepend'> 
                                                    <label class='input-group-text' for='referral-state-${response.admitBook[i]['Booking_ID']}' style='background-color:#d6b627; color:white'>State</label> 
                                                </div>
                                                <select data-id='${response.admitBook[i]['Booking_ID']}' class='form-control input-sm refer-patient-input refer-patient-input-state' name='State' id='referral-state-${response.admitBook[i]['Booking_ID']}' form='patientEditRefer-${response.admitBook[i]['Booking_ID']}' required> 
                                                    ${stateOptions}
                                                </select>
                                            </div>

                                            <div class="dropdown-input-field-area mb-3" id="admitReferHospital-dropdown-area">
                                                <div class='input-group'> 
                                                    <div class='input-group-prepend'> 
                                                        <label class='input-group-text' for='readonly-referral-hospital-${response.admitBook[i]['Booking_ID']}' style='background-color:#d6b627; color:white'>Hospital</label> 
                                                    </div> 
                                                    <input type="text" class="dropdown-input form-control input-sm refer-patient-input" id='readonly-referral-hospital-${response.admitBook[i]['Booking_ID']}' form='patientEditRefer-${response.admitBook[i]['Booking_ID']}' readonly required placeholder="Select Hospital" data-dropdown="#admitReferHospital-dropdown" data-dropdown_search="#admitReferHospital-search">
                                                </div>
                                                <input type="hidden" required class="dropdown-input-value" name='Hospital' id='referral-hospital-${response.admitBook[i]['Booking_ID']}' form='patientEditRefer-${response.admitBook[i]['Booking_ID']}'>
                                                <div class="dropdown dropdown-options">
                                                    <div class="dropdown-menu dropdown-options-menu w-100" id="admitReferHospital-dropdown">
                                                        <div style="padding-left:20px;padding-right:20px;">
                                                            <input type="text" class="dropdown-input-search dropdown-input-search-hospital" id="admitReferHospital-search" placeholder="Search Hospitals" autocomplete="off" tabindex="-1">
                                                            <i class="far fa-search" style="position:absolute; top:17px; left:35px"></i>
                                                        </div>
                                                        <div class="dataLists" id="admitReferHospital-dataLists" data-label-input="#readonly-referral-hospital-${response.admitBook[i]['Booking_ID']}" data-value-input="#referral-hospital-${response.admitBook[i]['Booking_ID']}">
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class='text-danger ml-1' id='refer-message-${response.admitBook[i]['Booking_ID']}' align='left'></div>
                                        </form>    
                                    </div> 
                                    <div class='modal-footer'> 
                                        <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close 
                                        </button> 
                                        <button type='submit' class='btn bg-warning' class='refer-patient btn-refer-patient' data-id="${response.admitBook[i]['Booking_ID']}"
                                                id='referPatient-${response.admitBook[i]['Booking_ID']}' form='patientEditRefer-${response.admitBook[i]['Booking_ID']}' 
                                                style='border:none;color:white'> 
                                            Refer 
                                        </button> 
                                    </div> 
                                </div>
                            </div> 
                        </div>`
                    $("#admitDataBodyModal").append(modalHTML);
                    $(`#update-patient-gender-${response.admitBook[i]['Booking_ID']}`).val(response.admitBook[i]['Gender']);
                }
                $("#tr-admit-loadMore").remove();
                if(response.is_last == false){
                    var loadMoreBtn = 
                        `<tr style="background-color:white" id="tr-admit-loadMore">
                            <td colspan='16' align='center' style='text-align:center'>
                                <div class="text-center">
                                    <button class="btn btn-primary" id="admit-loadMore">Load More</button>
                                </div>
                            </td>
                        </tr>`
                    $(`#admitDataBody`).append(loadMoreBtn);
                }
            }
            $('#admitBtnSpin').removeClass('fa-spin');
            $("#admit-loadMore").html('Load More');
            $("#admit-loadMore").prop('disabled', false);
        },
        error:function(response)
        {
            if(page == 1){
                $('#admitDataBody').html('');
            }
            $('#admitSearchClearBtn').html('Clear');
            $('#admitSearchBtnText').html('Search');
            $('#admitBtnSpin').removeClass('fa-spin');
            $("#admit-loadMore").html('Load More');
            $("#admit-loadMore").prop('disabled', false);
        }
    });
}


// $("#admitDataBodyModal").on('focus', ".dropdown-input", dropdownInputFocus);
// $("#referralDataBodyModal").on('focus', ".dropdown-input", dropdownInputFocus);

// $("#admitDataBodyModal").on('focusout', ".dropdown-input", dropdownInputFocusOut);
// $("#referralDataBodyModal").on('focusout', ".dropdown-input", dropdownInputFocusOut);

// $("#admitDataBodyModal").on('click', ".dropdown-item", selectInputDropdownItem);
// $("#referralDataBodyModal").on('click', ".dropdown-item", selectInputDropdownItem);


var statusUpdateReferHospital;
var admitReferHospital;
var referralReferHospital;
$(".dropdown-input-search-hospital").on('keyup', function(event){
    showHospitals({datalist:statusUpdateReferHospital, querySelector:this});
});
$("#admitDataBodyModal").on('keyup', ".dropdown-input-search-hospital", function(event){
    showHospitals({datalist:admitReferHospital, querySelector:this});
});
$("#referralDataBodyModal").on('keyup', ".dropdown-input-search-hospital", function(event){
    showHospitals({datalist:referralReferHospital, querySelector:this});
});
function showHospitals({datalist, querySelector}={})
{
    element = $(querySelector)
    var search = '';
    if(typeof(querySelector) == "object"){ // if querySelector = this
        search = element.val();
        parentElement = element.parent().parent().parent();
        childElements = parentElement.children();
        element = childElements.find(".dataLists")
    }

    element.html("");
    if(search.length > 0)
    {
        for(k in datalist)
        {
            var hos = datalist[k]['Name'].toUpperCase();
            var city = datalist[k]['City'].toUpperCase();
            var sub = datalist[k]['Subdivision'].toUpperCase();
            var dist = datalist[k]['District__Name'].toUpperCase();
            search = search.toUpperCase()
            if(hos.includes(search) || city.includes(search) || sub.includes(search) || dist.includes(search))
            {
                element.append(`<a class="dropdown-item" id="${datalist[k]['id']}" data-value="${datalist[k]['id']}" data-text="${datalist[k]['Name']}"><p>${datalist[k]['Name']}</p><p class="text-muted" style="margin-top:-20px; font-size:13px">${datalist[k]['City']}, ${datalist[k]['Subdivision']}, Dist: ${datalist[k]['District__Name']}, ${datalist[k]['Pin']}</p></a>`);
            }
        }
    }
    else
    {
        for(k in datalist)
        {
            element.append(`<a class="dropdown-item" id="${datalist[k]['id']}" data-value="${datalist[k]['id']}" data-text="${datalist[k]['Name']}"><p>${datalist[k]['Name']}</p><p class="text-muted" style="margin-top:-20px; font-size:13px">${datalist[k]['City']}, ${datalist[k]['Subdivision']}, Dist: ${datalist[k]['District__Name']}, ${datalist[k]['Pin']}</p></a>`);
        }
    }
}

$("#referral-state").on('change', function(event){
    let id = $(this).attr('data-id');
    let state = $(this).val();
    $.ajax(
    {
        url: "/get-hospitals-by-state/",
        data:{
            'state':state,
            'exclude_user': true,
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            statusUpdateReferHospital = response.hospitals
            showHospitals({datalist:statusUpdateReferHospital, querySelector:'#statusUpdateReferHospital-dataLists'});
        }
    });
});

$("#admitDataBodyModal").on('change', ".refer-patient-input-state", function(event){
    let id = $(this).attr('data-id');
    let state = $(this).val();
    $.ajax(
    {
        url: "/get-hospitals-by-state/",
        data:{
            'state':state,
            'exclude_user': true,
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            admitReferHospital = response.hospitals
            showHospitals({datalist:admitReferHospital, querySelector:'#admitReferHospital-dataLists'});
        }
    });
});


$("#referralDataBodyModal").on('change', ".referralPatientRefer-input-state", function(event){
    let id = $(this).attr('data-id');
    let state = $(this).val();
    $("#referralPatientRefer-hospital-"+id).html(`<option label="Select Hospital"></option>`)
    $.ajax(
    {
        url: "/get-hospitals-by-state/",
        data:{
            'state':state,
            'exclude_user': true,
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            referralReferHospital = response.hospitals
            showHospitals({datalist:referralReferHospital, querySelector:'#referralReferHospital-dataLists'});
        }
    });
});



$("[data-target='#site-content-patient-referral']").on('click', function(){
    referralSearch({action:'All'})
});

$("[data-target='#site-content-patient-data']").on('click', function(){
    $(".nav-pills-patient-data").removeClass('active');
    $(".tabe-pane-patient-data").removeClass("show active");
    $(".nav-pills-patient-data").attr("aria-selected", 'false');
    $("#pills-admitted-tab").addClass('active');
    $("#pills-admitted").addClass("show active");
    $("#pills-admitted-tab").attr("aria-selected", 'true');

    admitSearch({action:'All'});
    referSearch({action:'All'});
    pastPatientsSearch({action:'All'});
});


$('#referFilter').on('submit', function(event){
    event.preventDefault();
    $('#referSearchBtnText').html('Searching')
    referSearch({action:'Searching'});
});
document.getElementById('referSearchClearBtn').addEventListener("click", function() {
    $('#referSearchClearBtn').html('Clearing')
    referSearch({action:'All'});
});
$('#referDataRefresh').on("click", function() {
    referSearch({action:'All'});
});

var referSearchPage = 1;
$("#referDataBody").on('click', "#refer-loadMore", function(){
    referSearchPage += 1;
    $(this).prop('disabled', true);
    $(this).html('Loading......');
    referSearch({action:'Searching', page:referSearchPage});
});

function referSearch({action='Searching', page=1}={})
{
    if(action == 'All')
    {
        referSearchPage = 1;
        $("#referFilter").trigger('reset');
        $("#referSearch-requirement").html(`<option label="Select Support"></option>`);
        var hId = $("#id_hospital").val();
        $("#referSearch-hospitalId").val(hId);
        searchFor = 'All';
    }
    if(page == 1){
        html = `<tr id='referLoading'> 
                    <td colspan='18' align='center' style='text-align:center'><h4 class='text-muted'>Loading....</h4></td> 
                </tr>`
        $('#referDataBody').html(html);
    }
    var beforeDash = $("#referSearch-hospitalId").val();
    var afterDash = $('#referSearch-bookingId').val();
    var bId = '';
    if(afterDash != ''){
        bId = beforeDash + "-" + afterDash;
    }
    data = $(`[form='referFilter']`).serializeToJSON({
        parseBooleans: false,
    });
    data['bookingId'] = bId;
    data['page'] = page;
    $.ajax(
    {
        type:'GET',
        url: $("#referFilter").attr('action'),
        data: data,
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $('#referSearchClearBtn').html('Clear');
            $('#referSearchBtnText').html('Search');

            if(page == 1){
                $('#referDataBody').html('');
            }
            if(response.referredBook.length <= 0 && page == 1)
            {
                html = `<tr id='referLoading'> 
                            <td colspan='18' align='center' style='text-align:center'><h4 class='text-muted'>No Data Found</h4></td> 
                        </tr>`
                $('#referDataBody').html(html);
            }
            else
            {
                for(var i=0; i<response.referredBook.length; i++)
                {
                    var admitDate = '';
                    if(response.referredBook[i]['Admit_Time'] != null){
                        admitDate = formatDateTime(response.referredBook[i]['Admit_Time'])
                    }
                    var referDate = formatDateTime(response.referredBook[i]['ReferredDate']);
                    var html =
                        `<tr class='referDataClass' id='referData${response.referredBook[i]['Patient__Booking_ID']}'> 
                            <td class='table-serial-no left-column-sticky' align="center"></td> 
                            <td class="left-column-sticky-1">
                                <a href="/patient-info/${response.referredBook[i]['Patient__Booking_ID']}" target="_blank">${response.referredBook[i]['Patient__Booking_ID']}</a>
                            </td> 
                            <td>${response.referredBook[i]['Patient__Patient_Name']}</td> 
                            <td>${response.referredBook[i]['Patient__Gender']}</td> 
                            <td>${response.referredBook[i]['Patient__Age']}</td> 
                            <td>${response.referredBook[i]['Patient__Disease__Disease']}</td> 
                            <td>${response.referredBook[i]['Patient__Email']}</td> 
                            <td>${response.referredBook[i]['Patient__Mobile']}</td> 
                            <td>${response.referredBook[i]['Patient__Alternative_Mobile']}</td> 
                            <td>${response.referredBook[i]['Patient__Subdivision']}</td> 
                            <td>${response.referredBook[i]['Patient__State']}</td> 
                            <td>${response.referredBook[i]['Patient__District']}</td> 
                            <td>${response.referredBook[i]['Patient__Pin']}</td> 
                            <td>${displayNotNullData(response.referredBook[i]['Bed__Department__department'])}</td> 
                            <td>
                                ${displayNotNullData(response.referredBook[i]['Bed__Bed_No'])}
                            </td> 
                            <td>
                                ${displayNotNullData(response.referredBook[i]['Bed__Ward'])}
                            </td>
                            <td>
                                ${displayNotNullData(response.referredBook[i]['Bed__Support'])}
                            </td> 
                            <td>
                                ${displayNotNullData(response.referredBook[i]['Bed__Room__Room'])}
                            </td> 
                            <td>
                                ${displayNotNullData(response.referredBook[i]['Bed__Unit__Unit'])}
                            </td> 
                            <td>
                                ${displayNotNullData(response.referredBook[i]['Bed__Floor'])}
                            </td> 
                            <td>
                                ${displayNotNullData(response.referredBook[i]['Bed__Building__Building'])}
                            </td>
                            <td>
                                ${response.referredBook[i]['Referral_Hospital_To__Name']},
                                <br>${response.referredBook[i]['Referral_Hospital_To__City']}, Sub: ${response.referredBook[i]['Referral_Hospital_To__Subdivision']},
                                <br>State: ${response.referredBook[i]['Referral_Hospital_To__State__Name']}, Dict: ${response.referredBook[i]['Referral_Hospital_To__District__Name']},
                                <br>Pin: ${response.referredBook[i]['Referral_Hospital_To__Pin']}, Contact: ${response.referredBook[i]['Referral_Hospital_To__Contact']}
                            </td>
                            <td>
                                ${response.referredBook[i]['Patient__Hospital_Name__Name']},
                                <br>${response.referredBook[i]['Patient__Hospital_Name__City']}, Sub: ${response.referredBook[i]['Patient__Hospital_Name__Subdivision']},
                                <br>State: ${response.referredBook[i]['Patient__Hospital_Name__State__Name']}, Dict: ${response.referredBook[i]['Patient__Hospital_Name__District__Name']},
                                <br>Pin: ${response.referredBook[i]['Patient__Hospital_Name__Pin']}, Contact: ${response.referredBook[i]['Patient__Hospital_Name__Contact']}
                            </td>
                            <td>${response.referredBook[i]['Patient__Status']}</td>
                            <td>${response.referredBook[i]['Patient__Status_Changed_At']}</td>
                            <td>${admitDate}</td> 
                            <td>${referDate}</td> 
                            <td>${response.referredBook[i]['is_action_took']}</td>
                        </tr>`
                    $(`#referDataBody`).append(html)
                }
                $("#tr-refer-loadMore").remove();
                if(response.is_last == false){
                    var loadMoreBtn = 
                        `<tr style="background-color:white" id="tr-refer-loadMore">
                            <td colspan='16' align='center' style='text-align:center'>
                                <div class="text-center">
                                    <button class="btn btn-primary" id="refer-loadMore">Load More</button>
                                </div>
                            </td>
                        </tr>`
                    $(`#referDataBody`).append(loadMoreBtn);
                }
            }
            $('#referBtnSpin').removeClass('fa-spin');
            $("#refer-loadMore").html('Load More');
            $("#refer-loadMore").prop('disabled', false);
        },
        error:function(response)
        {
            if(page == 1){
                $('#referDataBody').html('');
            }
            $('#referSearchClearBtn').html('Clear');
            $('#referSearchBtnText').html('Search');
            $('#referBtnSpin').removeClass('fa-spin');
            $("#refer-loadMore").html('Load More');
            $("#refer-loadMore").prop('disabled', false);
        }
    });
}


$('#pastPatientsFilter').on('submit', function(event){
    event.preventDefault();
    $('#pastPatientsSearchBtnText').html('Searching')
    pastPatientsSearch({action:'Searching'})
});
document.getElementById('pastPatientsSearchClearBtn').addEventListener("click", function() {
    $('#pastPatientsSearchClearBtn').html('Clearing')
    pastPatientsSearch({action:'All'});
});
$('#pastPatientsDataRefresh').on("click", function() {
    pastPatientsSearch({action:'All'});
});

var pastPatientsSearchPage = 1;
$("#pastPatientsDataBody").on('click', "#pastPatients-loadMore", function(){
    pastPatientsSearchPage += 1;
    $(this).prop('disabled', true);
    $(this).html('Loading......');
    pastPatientsSearch({action:'Searching', page:pastPatientsSearchPage});
});

function pastPatientsSearch({action='Searching', page=1}={})
{
    if(action == 'All')
    {
        pastPatientsSearchPage = 1;
        $("#pastPatientsFilter").trigger('reset');
        $("#pastPatientsSearch-requirement").html(`<option label="Select Support"></option>`);
        var hId = $("#id_hospital").val();
        $("#pastPatientsSearch-hospitalId").val(hId);
        searchFor = 'All';
    }
    if(page == 1){
        html = `<tr id='pastPatientsLoading'> 
                <td colspan='18' align='center' style='text-align:center'><h4 class='text-muted'>Loading....</h4></td> 
            </tr>`
        $('#pastPatientsDataBody').html(html);
    }
    
    var beforeDash = $("#pastPatientsSearch-hospitalId").val();
    var afterDash = $('#pastPatientsSearch-bookingId').val();
    var bId = '';
    if(afterDash != ''){
        bId = beforeDash + "-" + afterDash;
    }
    data = $(`[form='pastPatientsFilter']`).serializeToJSON({
        parseBooleans: false,
    });
    data['bookingId'] = bId;
    data['page'] = page;
    $.ajax(
    {
        type:'GET',
        url: $("#pastPatientsFilter").attr('action'),
        data: data,
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $('#pastPatientsSearchClearBtn').html('Clear');
            $('#pastPatientsSearchBtnText').html('Search');
            if(page == 1){
                $('#pastPatientsDataBody').html('');
            }
            if(response.pastPatients.length <= 0 && page == 1)
            {
                html = `<tr id='pastPatientsLoading'> 
                            <td colspan='18' align='center' style='text-align:center'><h4 class='text-muted'>No Data Found</h4></td> 
                        </tr>`
                $('#pastPatientsDataBody').html(html);
            }
            else
            {
                for(var i=0; i<response.pastPatients.length; i++)
                {
                    var html =
                        `<tr class='pastPatientsDataClass' id='pastPatientsData${response.pastPatients[i]['Booking_ID']}'> 
                            <td class='table-serial-no left-column-sticky' align="center"></td> 
                            <td class="left-column-sticky-1">
                                <a href="/patient-info/${response.pastPatients[i]['Booking_ID']}" target="_blank">${response.pastPatients[i]['Booking_ID']}</a>
                            </td> 
                            <td>${response.pastPatients[i]['Patient_Name']}</td> 
                            <td>${response.pastPatients[i]['Gender']}</td> 
                            <td>${response.pastPatients[i]['Age']}</td>
                            <td>${response.pastPatients[i]['Disease__Disease']}</td> 
                            <td>${response.pastPatients[i]['Email']}</td> 
                            <td>${response.pastPatients[i]['Mobile']}</td> 
                            <td>${response.pastPatients[i]['Alternative_Mobile']}</td> 
                            <td>${response.pastPatients[i]['Subdivision']}</td> 
                            <td>${response.pastPatients[i]['State']}</td> 
                            <td>${response.pastPatients[i]['District']}</td> 
                            <td>${response.pastPatients[i]['Pin']}</td>  
                            <td>${displayNotNullData(response.pastPatients[i]['Bed_No__Department__department'])}</td> 
                            <td>
                                ${displayNotNullData(response.pastPatients[i]['Bed_No__Bed_No'])}
                            </td> 
                            <td>
                                ${displayNotNullData(response.pastPatients[i]['Bed_No__Ward'])}
                            </td>
                            <td>
                                ${displayNotNullData(response.pastPatients[i]['Bed_No__Support'])}
                            </td> 
                            <td>
                                ${displayNotNullData(response.pastPatients[i]['Bed_No__Room__Room'])}
                            </td> 
                            <td>
                                ${displayNotNullData(response.pastPatients[i]['Bed_No__Unit__Unit'])}
                            </td> 
                            <td>
                                ${displayNotNullData(response.pastPatients[i]['Bed_No__Floor'])}
                            </td> 
                            <td>
                                ${displayNotNullData(response.pastPatients[i]['Bed_No__Building__Building'])}
                            </td>
                            <td>${response.pastPatients[i]['Status']}</td>
                            <td>${formatDateTime(response.pastPatients[i]['Admit_Time'])}</td> 
                            <td>${formatDateTime(response.pastPatients[i]['Status_Changed_At'])}</td> 
                        </tr>`
                    $(`#pastPatientsDataBody`).append(html);
                }
                $("#tr-pastPatients-loadMore").remove();
                if(response.is_last == false){
                    var loadMoreBtn = 
                        `<tr style="background-color:white" id="tr-pastPatients-loadMore">
                            <td colspan='16' align='center' style='text-align:center'>
                                <div class="text-center">
                                    <button class="btn btn-primary" id="pastPatients-loadMore">Load More</button>
                                </div>
                            </td>
                        </tr>`
                    $(`#pastPatientsDataBody`).append(loadMoreBtn);
                }
            }
            $('#pastPatientsDataRefreshSpin').removeClass('fa-spin');
            $("#pastPatients-loadMore").html('Load More');
            $("#pastPatients-loadMore").prop('disabled', false);
        },
        error:function(response)
        {
            if(page == 1){
                $('#pastPatientsDataBody').html('');
            }
            $('#pastPatientsSearchClearBtn').html('Clear');
            $('#pastPatientsSearchBtnText').html('Search');
            $('#pastPatientsDataRefreshSpin').removeClass('fa-spin');
            $("#pastPatients-loadMore").html('Load More');
            $("#pastPatients-loadMore").prop('disabled', false);
        }
    });
}


$('#referralFilter').on('submit', function(event){
    event.preventDefault();
    $('#referralSearchBtnText').html('Searching')
    referralSearch({action:'Searching'})
});
document.getElementById('referralSearchClearBtn').addEventListener("click", function() {
    $('#referralSearchClearBtn').html('Clearing')
    referralSearch({action:'All'});
});
$('#referralDataRefresh').on("click", function() {
    referralSearch({action:'All'});
});

var referralSearchPage = 1;
$("#referralDataBody").on('click', "#referral-loadMore", function(){
    referralSearchPage += 1;
    $(this).prop('disabled', true);
    $(this).html('Loading......');
    referralSearch({action:'Searching', page:referralSearchPage});
});

function referralSearch({action='Searching', page=1}={})
{
    if(action == 'All')
    {
        referralSearchPage = 1;
        $("#referralFilter").trigger('reset');
        $("#referralSearch-requirement").html(`<option label="Select Support"></option>`);
        searchFor = 'All';
    }
    if(page == 1){
        html = `<tr id='referralLoading'> 
                    <td colspan='15' align='center' style='text-align:center'><h4 class='text-muted'>Loading....</h4></td> 
                </tr>`
        $('#referralDataBody').html(html);
        $("#referralDataBodyModal").html('');
    }

    var beforeDash = $("#referralSearch-hospitalId").val();
    var afterDash = $('#referralSearch-bookingId').val();
    var bId = '';
    if(afterDash != ''){
        bId = beforeDash + "-" + afterDash;
    }
    data = $(`[form='referralFilter']`).serializeToJSON({
        parseBooleans: false,
    });
    data['bookingId'] = bId;
    data['page'] = page;
    $.ajax(
    {
        type:'GET',
        url: $("#referralFilter").attr('action'),
        data: data,
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $('#referralSearchClearBtn').html('Clear');
            $('#referralSearchBtnText').html('Search');
            if(page == 1){
                $('#referralDataBody').html('');
            }
            if(response.referralBook.length <= 0 && page == 1)
            {
                html = `<tr id='referralLoading'> 
                            <td colspan='15' align='center' style='text-align:center'><h4 class='text-muted'>No Data Found</h4></td> 
                        </tr>`
                $('#referralDataBody').html(html);
            }
            else
            {
                departmentOptions = $("#book-department").html();            
                wardOptions = $("#book-ward").html();
                roomOptions = $("#book-room").html();
                unitOptions = $("#book-unit").html();
                stateOptions = $("#patient-state").html();
                for(var i=0; i<response.referralBook.length; i++)
                {
                    var referralDate = formatDateTime(response.referralBook[i]['ReferredDate']);
                    var html =
                        `<tr class='referralDataClass' id='referralData${response.referralBook[i]['id']}'> 
                            <td class='table-serial-no left-column-sticky' align="center"></td> 
                            <td class="left-column-sticky-1">
                                <a href="/patient-info/${response.referralBook[i]['Patient__Booking_ID']}" target="_blank">${response.referralBook[i]['Patient__Booking_ID']}</a>
                            </td> 
                            <td>${response.referralBook[i]['Patient__Patient_Name']}</td>
                            <td>${response.referralBook[i]['Patient__Gender']}</td> 
                            <td>${response.referralBook[i]['Patient__Age']}</td>
                            <td>${response.referralBook[i]['Patient__Disease__Disease']}</td> 
                            <td>${response.referralBook[i]['Patient__Email']}</td> 
                            <td>${response.referralBook[i]['Patient__Mobile']}</td> 
                            <td>${response.referralBook[i]['Patient__Alternative_Mobile']}</td> 
                            <td>${response.referralBook[i]['Patient__Subdivision']}</td> 
                            <td>${response.referralBook[i]['Patient__State']}</td> 
                            <td>${response.referralBook[i]['Patient__District']}</td> 
                            <td>${response.referralBook[i]['Patient__Pin']}</td> 
                            <td>
                                ${response.referralBook[i]['Referral_Hospital_From__Name']},
                                <br>${response.referralBook[i]['Referral_Hospital_From__City']}, Sub: ${response.referralBook[i]['Referral_Hospital_From__Subdivision']},
                                <br>State: ${response.referralBook[i]['Referral_Hospital_From__State__Name']}, Dict: ${response.referralBook[i]['Referral_Hospital_From__District__Name']},
                                <br>Pin: ${response.referralBook[i]['Referral_Hospital_From__Pin']}, Contact: ${response.referralBook[i]['Referral_Hospital_From__Contact']}
                            </td>
                            <td>${referralDate}</td> 
                            <td class="right-column-sticky">
                                <div>
                                    <button class='btn btn-sm btn-danger' type='button' data-toggle='modal' data-target='#referralAdmit-${response.referralBook[i]['id']}' 
                                            style='color:white;border:none'> 
                                        Admit
                                    </button> 
                                </div>
                                <div class="mt-1">
                                    <div class="dropdown">
                                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButtonMoreAction" data-toggle="dropdown" aria-expanded="false">
                                            More
                                        </button>
                                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonMoreAction">
                                            <button type='button' class='dropdown-item btn btn-more-action-item Btn-Patient-Release mb-2' data-patient-name="${response.referralBook[i]['Patient__Patient_Name']}" data-patient-id="${response.referralBook[i]['id']}" id="ReferralBtnRelease-${response.referralBook[i]['id']}"> 
                                                Release 
                                            </button>
                                            <button type='button' class='dropdown-item btn btn-more-action-item Btn-Patient-Refer mb-2' data-toggle="modal" data-target='#referralPatientReferModel-${response.referralBook[i]['id']}' data-patient-name="${response.referralBook[i]['Patient__Patient_Name']}" data-patient-id="${response.referralBook[i]['id']}" id="ReferralBtnRefer-${response.referralBook[i]['id']}"> 
                                                Refer 
                                            </button>
                                            <button type='button' class='dropdown-item btn btn-more-action-item Btn-Patient-Died mb-2' data-patient-name="${response.referralBook[i]['Patient__Patient_Name']}" data-patient-id="${response.referralBook[i]['id']}" id="BtnDied-${response.referralBook[i]['id']}"> 
                                                Died 
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>`
                    $(`#referralDataBody`).append(html);
                    var modalHTML = 
                    `<!-- Modal --> 
                    <div class='modal fade' id='referralAdmit-${response.referralBook[i]['id']}' data-backdrop='static' data-keyboard='false' 
                            tabindex='-1' aria-labelledby='referralAdmitLabel${response.referralBook[i]['id']}' aria-hidden='true'> 
                        <div class='modal-dialog modal-md'> 
                            <div class='modal-content'> 
                                <div class='modal-header bg-danger' style='color:white'> 
                                    <h5 class='modal-title' id='referralAdmitLabel${response.referralBook[i]['id']}'><strong style='color:white'>Admit Patient</strong></h5> 
                                    <button type='button' class='close' data-dismiss='modal' aria-label='Close'> 
                                        <span aria-hidden='true' style='color:white'>&times;</span> 
                                    </button> 
                                </div>
                                <div class='modal-body'> 
                                    <form class='referralAdmitForm' id='referralAdmitForm-${response.referralBook[i]['id']}' data-id='${response.referralBook[i]['id']}' method='post' autocomplete='on'> 
                                        <h6 style='color:#fe1812' align='center'> Patient's Name: <b>${response.referralBook[i]['Patient__Patient_Name']}</b></h6><br> 
                                        <div class='input-group mb-3'> 
                                            <div class='input-group-prepend'> 
                                                <label class='input-group-text' for='referralAdmit-department-${response.referralBook[i]['Booking_ID']}' style='background-color:#fa312a; color:white'>Department</label> 
                                            </div> 
                                            <select data-id='${response.referralBook[i]['Booking_ID']}' data-bed="#referralAdmit-Bed_No-${response.referralBook[i]['Booking_ID']}" class='form-control input-sm referralAdmitForm-input referralAdmit-input-department' name='department' id='referralAdmit-department-${response.referralBook[i]['Booking_ID']}' form='referralAdmitForm-${response.referralBook[i]['Booking_ID']}' required> 
                                                ${departmentOptions}
                                            </select>
                                        </div>
                                        <div class='input-group mb-3'> 
                                            <div class='input-group-prepend'> 
                                                <label class='input-group-text' for='referralAdmit-ward-${response.referralBook[i]['id']}' style='background-color:#fa312a; color:white'>Ward</label> 
                                            </div> 
                                            <select data-id='${response.referralBook[i]['id']}' data-requirement='#referralAdmit-requirement-${response.referralBook[i]['id']}' data-bed="#referralAdmit-Bed_No-${response.referralBook[i]['Booking_ID']}" class='form-control input-sm referralAdmitForm-input referralAdmit-input-ward' name='ward' id='referralAdmit-ward-${response.referralBook[i]['id']}' form='referralAdmitForm-${response.referralBook[i]['id']}' required> 
                                                ${wardOptions}
                                            </select>
                                        </div>
                                        <div class='input-group mb-3'> 
                                            <div class='input-group-prepend'> 
                                                <label class='input-group-text' for='referralAdmit-requirement-${response.referralBook[i]['id']}' style='background-color:#fa312a; color:white'>Support</label> 
                                            </div> 
                                            <select data-book_id="${response.referralBook[i]['id']}" class='form-control input-sm referralAdmitForm-input referralAdmit-input-requirement' name='requirement' id='referralAdmit-requirement-${response.referralBook[i]['id']}' form='referralAdmitForm-${response.referralBook[i]['id']}' required> 
                                                <option label='Select Support'></option> 
                                            </select> 
                                        </div>
                                        <div class='input-group mb-3'> 
                                            <div class='input-group-prepend'> 
                                                <label class='input-group-text' for='referralAdmit-room-${response.referralBook[i]['Booking_ID']}' style='background-color:#fa312a; color:white'>Room</label> 
                                            </div> 
                                            <select data-id='${response.referralBook[i]['Booking_ID']}' data-bed="#referralAdmit-Bed_No-${response.referralBook[i]['Booking_ID']}" class='form-control input-sm referralAdmitForm-input referralAdmit-input-room' name='room' id='referralAdmit-room-${response.referralBook[i]['Booking_ID']}' form='referralAdmitForm-${response.referralBook[i]['Booking_ID']}'> 
                                                ${roomOptions}
                                            </select>
                                        </div>
                                        <div class='input-group mb-3'> 
                                            <div class='input-group-prepend'> 
                                                <label class='input-group-text' for='referralAdmit-unit-${response.referralBook[i]['Booking_ID']}' style='background-color:#fa312a; color:white'>Unit</label> 
                                            </div> 
                                            <select data-id='${response.referralBook[i]['Booking_ID']}' data-bed="#referralAdmit-Bed_No-${response.referralBook[i]['Booking_ID']}" class='form-control input-sm referralAdmitForm-input referralAdmit-input-unit' name='unit' id='referralAdmit-unit-${response.referralBook[i]['Booking_ID']}' form='referralAdmitForm-${response.referralBook[i]['Booking_ID']}'> 
                                                ${unitOptions}
                                            </select>
                                        </div>
                                        <div class='input-group mb-1'> 
                                            <div class='input-group-prepend'> 
                                                <label class='input-group-text' for='referralAdmit-Bed_No-${response.referralBook[i]['id']}' style='background-color:#fa312a; color:white'>Bed</label> 
                                            </div> 
                                            <select name='Bed_Id' id='referralAdmit-Bed_No-${response.referralBook[i]['id']}' class='form-control input-sm referralAdmitForm-input' form='referralAdmitForm-${response.referralBook[i]['id']}'>
                                                <option label="Select Bed"></option>
                                            </select> 
                                        </div> 
                                        <div class='text-danger ml-1' id='referralAdmit-message-${response.referralBook[i]['id']}' align='left'></div>
                                    </form>
                                </div> 
                                <div class='modal-footer'> 
                                    <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close 
                                    </button> 
                                    <button type='submit' class='btn btn-danger' class='referralAdmit btn-referralAdmit' data-id="${response.referralBook[i]['id']}"
                                            id='referralAdmitFormBtn-${response.referralBook[i]['id']}' value='Admit' form='referralAdmitForm-${response.referralBook[i]['id']}' 
                                            style='border:none;color:white'> 
                                        Admit
                                    </button> 
                                </div> 
                            </div>
                        </div> 
                    </div>
                    
                    <!-- Modal --> 
                    <div class='modal fade' id='referralPatientReferModel-${response.referralBook[i]['id']}' data-backdrop='static' data-keyboard='false' 
                            tabindex='-1' aria-labelledby='referralPatientReferModelLabel${response.referralBook[i]['id']}' aria-hidden='true'> 
                        <div class='modal-dialog modal-md'> 
                            <div class='modal-content'> 
                                <div class='modal-header bg-warning' style='color:white'> 
                                    <h5 class='modal-title' id='referralPatientReferModelLabel${response.referralBook[i]['id']}'><strong style='color:white'>
                                    Refer The Patient</strong></h5> 
                                    <button type='button' class='close' data-dismiss='modal' aria-label='Close'> 
                                        <span aria-hidden='true' style='color:white'>&times;</span> 
                                    </button> 
                                </div>
                                <div class='modal-body'>
                                    <form class='referralPatientReferForm' id='referralPatientReferForm-${response.referralBook[i]['id']}' data-id='${response.referralBook[i]['id']}' method='post' autocomplete='on'>
                                        <h6 style='color:#d6b627' align='center'> Patient's Name: <b>${response.referralBook[i]['Patient__Patient_Name']}</b></h6><br> 
                                        <h6>Refer To:</h6>
                                        <div class='input-group mb-3'> 
                                            <div class='input-group-prepend'> 
                                                <label class='input-group-text' for='referralPatientRefer-state-${response.referralBook[i]['id']}' style='background-color:#d6b627; color:white'>State</label> 
                                            </div>
                                            <select data-id='${response.referralBook[i]['id']}' class='form-control input-sm referralPatientRefer-input referralPatientRefer-input-state' name='State' id='referralPatientRefer-state-${response.referralBook[i]['id']}' form='referralPatientReferForm-${response.referralBook[i]['id']}' required> 
                                                ${stateOptions}
                                            </select>
                                        </div>
                                        <div class="dropdown-input-field-area mb-3" id="referralReferHospital-dropdown-area">
                                            <div class='input-group'> 
                                                <div class='input-group-prepend'> 
                                                    <label class='input-group-text' for='readonly-referral-hospital-${response.referralBook[i]['id']}' style='background-color:#d6b627; color:white'>Hospital</label> 
                                                </div> 
                                                <input type="text" class="dropdown-input form-control input-sm referralPatientRefer-input" id='readonly-referralPatientRefer-hospital-${response.referralBook[i]['id']}' form='patientEditRefer-${response.referralBook[i]['id']}' readonly required placeholder="Select Hospital" data-dropdown="#referralReferHospital-dropdown" data-dropdown_search="#referralReferHospital-search">
                                            </div>
                                            <input type="hidden" required class="dropdown-input-value" name='Hospital' id='referralPatientRefer-hospital-${response.referralBook[i]['id']}' form='patientEditRefer-${response.referralBook[i]['id']}'>
                                            <div class="dropdown dropdown-options">
                                                <div class="dropdown-menu dropdown-options-menu w-100" id="referralReferHospital-dropdown">
                                                    <div style="padding-left:20px;padding-right:20px;">
                                                        <input type="text" class="dropdown-input-search dropdown-input-search-hospital" id="referralReferHospital-search" placeholder="Search Hospitals" autocomplete="off" tabindex="-1">
                                                        <i class="far fa-search" style="position:absolute; top:17px; left:35px"></i>
                                                    </div>
                                                    <div class="dataLists" id="referralReferHospital-dataLists" data-label-input="#readonly-referralPatientRefer-hospital-${response.referralBook[i]['id']}" data-value-input="#referralPatientRefer-hospital-${response.referralBook[i]['id']}">
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='text-danger ml-1' id='referralPatientRefer-message-${response.referralBook[i]['id']}' align='left'></div> 
                                    </form>
                                </div> 
                                <div class='modal-footer'> 
                                    <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close 
                                    </button> 
                                    <button type='submit' class='btn bg-warning' class='refer-patient btn-referralPatientRefer-patient' data-id="${response.referralBook[i]['id']}"
                                            id='referralPatientReferBtn-${response.referralBook[i]['id']}' form='referralPatientReferForm-${response.referralBook[i]['id']}' 
                                            style='border:none;color:white'> 
                                        Refer 
                                    </button> 
                                </div> 
                            </div>
                        </div> 
                    </div>`
                    $("#referralDataBodyModal").append(modalHTML);
                }
                $("#tr-referral-loadMore").remove();
                if(response.is_last == false){
                    var loadMoreBtn = 
                        `<tr style="background-color:white" id="tr-referral-loadMore">
                            <td colspan='16' align='center' style='text-align:center'>
                                <div class="text-center">
                                    <button class="btn btn-primary" id="referral-loadMore">Load More</button>
                                </div>
                            </td>
                        </tr>`
                    $(`#referralDataBody`).append(loadMoreBtn);
                }
            }
            $('#referralBtnSpin').removeClass('fa-spin');
            $("#referral-loadMore").html('Load More');
            $("#referral-loadMore").prop('disabled', false);

        },
        error:function(response)
        {
            if(page == 1){
                $('#referralDataBody').html('');
            }
            $('#referralSearchClearBtn').html('Clear');
            $('#referralSearchBtnText').html('Search');
            $('#referralBtnSpin').removeClass('fa-spin');
            $("#referral-loadMore").html('Load More');
            $("#referral-loadMore").prop('disabled', false);
        }
    });
}


$("#referralDataBodyModal").on('submit', ".referralAdmitForm", function(event){
    event.preventDefault();
    var id = $(this).attr('data-id');
    document.getElementById('referralAdmitFormBtn-'+id).innerHTML = "<i class='fad fa-spinner fa-spin'></i>"
    $("#referralAdmit-message-"+id).html("");
    bed = $('#referralAdmit-Bed_No').val()
    let option_count = $('#referralAdmit-Bed_No option').length;
    if((bed == '' || bed == null || bed == undefined) && (option_count > 1)){
        $("#referralAdmit-message-"+id).html(`<span class="text-danger">Please select a bed.</span>`)
    }
    else{
        $.ajax(
        {
            type:'POST',
            url: "/referral-patient-edit/",
            data:{
                id:id,
                Bed_Id:$('#referralAdmit-Bed_No-'+id).val(),
                department: $(`#referralAdmit-requirement-${id}`).val(),
                ward: $(`#referralAdmit-ward-${id}`).val(),
                requirement: $(`#referralAdmit-requirement-${id}`).val(),
                room: $(`#referralAdmit-room-${id}`).val(),
                unit: $(`#referralAdmit-unit-${id}`).val(),
                status: 'Admit',
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success:function(response)
            {   
                document.getElementById('referralAdmitFormBtn-'+id).innerHTML = "Admit";
                if(response.success == "Admitted")
                {
                    $('#referralAdmit-'+id).modal('hide');
                    var row = document.getElementById('referralData'+id);
                    setTimeout(function(){
                        row.parentNode.removeChild(row);
                    }, 1000);
                    window.open(response.url);
                }
            },
            error:function(response)
            {
                document.getElementById('referralAdmitFormBtn-'+id).innerHTML = "Admit";
                $("#referralAdmit-message-"+id).html("Failed to admit the patient. Try Again!")
            },
        });
    }
});

$("#referralDataBodyModal").on('submit', ".referralPatientReferForm", function(event){
    event.preventDefault();
    $("#referralPatientReferForm-"+id).prop('disabled', true);
    var id = $(this).attr('data-id');
    $(`#referralPatientRefer-message-${id}`).html("");
    document.getElementById('referralPatientReferBtn-'+id).innerHTML = "<i class='fad fa-spinner fa-spin'></i>";
    $.ajax(
    {
        type:'POST',
        url: "/referral-patient-edit/",
        data:{
            id:id,
            referralHospital:$('#referralPatientRefer-hospital-'+id).val(),
            status: 'Referred',
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {   
            $('#patientEditReferModel-'+id).modal('hide');
            if(response.success == "Referred")
            {
                window.open(response.url);
                var row = document.getElementById('referralData'+id);
                setTimeout(function(){
                    row.parentNode.removeChild(row);
                }, 1000);
            }
        },
        error:function(response)
        {
            document.getElementById('referralPatientReferBtn-'+id).innerHTML = "Refer";
            $("#referralPatientReferForm-"+id).prop('disabled', false);
            $(`#referralPatientRefer-message-${id}`).html('Failed to refer the patient! Try Again')
        },
    });
});

$("#referralDataBody").on('click', '.Btn-Patient-Release', function(event){
    var patientName = $(this).attr('data-patient-name');
    var patientId = $(this).attr('data-patient-id');
    var message = `Are You Want To Release The Patient <span class="text-uppercase">${patientName}?</span>`
    var functionToExecute = function(){
        referralPatientChange(patientId, 'Release')
    }
    twoButtonAlert(message, 'Cancel', 'Release', functionToExecute)
});
$("#referralDataBody").on('click', '.Btn-Patient-Died', function(event){
    var patientName = $(this).attr('data-patient-name');
    var patientId = $(this).attr('data-patient-id');
    var message = `Are You Sure That The Patient <span class="text-uppercase">(${patientName})</span> Is Died?`
    var functionToExecute = function(){
        referralPatientChange(patientId, 'Died')
    }
    twoButtonAlert(message, 'Cancel', 'Patient is Died', functionToExecute)
});
function referralPatientChange(id, status)
{
    window.stop();
    $.ajax(
    {
        type:'POST',
        url: "/referral-patient-edit/",
        data:{
            id:id,
            status: status,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            window.open(response.url);
            var row = document.getElementById('referralData'+id);
            setTimeout(function(){
                row.parentNode.removeChild(row);
            }, 1000);
        },
        error:function(response)
        {
            showSingleButtonAlert("Failed", "Sorry! Some Error Occurred. Please Try Again!", "Okay");
        }
    });
}


$("#admitDataBody").on('keyup', '.admitData-disease-input', function(){
    this.style.width = ((this.value.length + 1) * 8) + 'px';
})
$("#admitDataBody").on('click', ".admitData-disease-edit-btn", function(event){
    id = $(this).attr('data-id')
    $(`#admitData-disease-input-${id}`).show()
    $(`#admitData-disease-${id}`).hide()
    $(`#admitData-disease-submit-btn-${id}`).show()
    $(this).hide()
})

$("#admitDataBody").on('submit', ".admitData-disease-change-form", function(event){
    event.preventDefault();
    var id = $(this).attr('data-id');
    document.getElementById('admitData-disease-submit-btn-'+id).innerHTML = "<i class='fad fa-spinner fa-spin'></i>"
    $.ajax(
    {
        type:'POST',
        url: "/patient-edit/",
        data:{
            bookid:id,
            disease: $(`#admitData-disease-input-${id}`).val(),
            status: 'change_disease',
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {   
            $(`#admitData-disease-${id}`).html(response.disease)
            $(`#admitData-disease-input-${id}`).val(response.disease)
            $(`#patient-disease-${id}`).val(response.disease)
            $(`#admitData-disease-input-${id}`).hide()
            $(`#admitData-disease-${id}`).show()
            $(`#admitData-disease-submit-btn-${id}`).hide()
            $(`#admitData-disease-submit-btn-${id}`).html(`<i class="fa-regular fa-square-check"></i>`)
            $(`#admitData-disease-edit-btn-${id}`).show()
        },
        error:function(response)
        {
            $(`#admitData-disease-submit-btn-${id}`).html(`<i class="fa-regular fa-square-check"></i>`)
            showSingleButtonAlert("Failed", "Sorry! Some Error Occurred. Please Try Again!", "Okay");
        },
    });
});



$("#admitDataBodyModal").on('submit', ".patient-shift-form", function(event){
    event.preventDefault();
    var id = $(this).attr('data-id');
    $("#edit-bed-message-"+id).html("");
    document.getElementById('shift_bed_submit_btn-'+id).innerHTML = "<i class='fad fa-spinner fa-spin'></i>"
    $.ajax(
    {
        type:'POST',
        url: "/patient-edit/",
        data:{
            bookid:id,
            disease: $(`#patient-disease-${id}`).val(),
            Bed_Id:$('#change-Bed_No-'+id).val(),
            status: 'patient_shift',
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {   
            document.getElementById('shift_bed_submit_btn-'+id).innerHTML = "Change Bed";
            if(response.success == "change")
            {
                shiftToBed = response.shiftToBed
                document.getElementById('department'+id).innerHTML = shiftToBed.Department__department;
                document.getElementById('bedno'+id).innerHTML = shiftToBed.Bed_No;
                document.getElementById('ward'+id).innerHTML = shiftToBed.Ward;
                document.getElementById('requirement'+id).innerHTML = shiftToBed.Support;
                document.getElementById('room'+id).innerHTML = shiftToBed.Room__Room;
                document.getElementById('unit'+id).innerHTML = shiftToBed.Unit__Unit;
                document.getElementById('floor'+id).innerHTML = shiftToBed.Floor;
                document.getElementById('building'+id).innerHTML = shiftToBed.Building__Building;
                $(`#admitData-disease-${id}`).html(response.disease)
                $(`#admitData-disease-input-${id}`).val(response.disease)
                $(`#patient-disease-${id}`).val(response.disease)
            }
            $('#changebed-'+id).modal('hide');
        },
        error:function(response)
        {
            document.getElementById('shift_bed_submit_btn-'+id).innerHTML = "Change Bed";
            $("#edit-bed-message-"+id).html("Failed to change bed. Try Again!");
        },
    });
});


$("#admitDataBodyModal").on('submit', ".patientEditReferForm", function(event){
    event.preventDefault();
    $("#referPatient-"+id).prop('disabled', true);
    var id = $(this).attr('data-id');
    $(`#refer-message-${id}`).html("");
    document.getElementById('referPatient-'+id).innerHTML = "<i class='fad fa-spinner fa-spin'></i>";
    $.ajax(
    {
        type:'POST',
        url: "/patient-edit/",
        data:{
            bookid:id,
            referralHospital:$('#referral-hospital-'+id).val(),
            status: 'Referred',
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {   
            $('#patientEditReferModel-'+id).modal('hide');
            if(response.success == "Referred")
            {
                window.open(response.url);
                var row = document.getElementById(id);
                setTimeout(function(){
                    row.parentNode.removeChild(row);
                }, 1000);
            }
        },
        error:function(response)
        {
            document.getElementById('referPatient-'+id).innerHTML = "Refer";
            $("#referPatient-"+id).prop('disabled', false);
            $(`#refer-message-${id}`).html('Failed to refer the patient! Try Again')
        },
    });
});

$("#admitDataBody").on('click', '.Btn-Patient-Release', function(event){
    var patientName = $(this).attr('data-patient-name');
    var patientId = $(this).attr('data-patient-id');
    var message = `Are You Want To Release The Patient <span class="text-uppercase">${patientName}?</span>`
    var functionToExecute = function(){
        patientChange(patientId, 'Release')
    }
    twoButtonAlert(message, 'Cancel', 'Release', functionToExecute)
});
$("#admitDataBody").on('click', '.Btn-Patient-Died', function(event){
    var patientName = $(this).attr('data-patient-name');
    var patientId = $(this).attr('data-patient-id');
    var message = `Are You Sure That The Patient <span class="text-uppercase">(${patientName})</span> Is Died?`
    var functionToExecute = function(){
        patientChange(patientId, 'Died')
    }
    twoButtonAlert(message, 'Cancel', 'Patient is Died', functionToExecute)
});
function patientChange(id, status)
{
    window.stop();
    $.ajax(
    {
        type:'POST',
        url: "/patient-edit/",
        data:{
            bookid:id,
            status: status,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            window.open(response.url);
            var row = document.getElementById(id);
            setTimeout(function(){
                row.parentNode.removeChild(row);
            }, 1000);
            $("#pastPatientsFilter").trigger('reset');
            pastPatientsSearch({action:'All'});
        },
        error:function(response)
        {
            showSingleButtonAlert("Failed", "Sorry! Some Error Occurred. Please Try Again!", "Okay");
        }
    });
}



$('#getBookingForm').on('submit', function(event){
    event.preventDefault();
    $('#fetchBtn').prop('disabled', true);
    $('#bookingFindMessage').html("");
    $('#fetchBtn').html('Fetching');
    $('.patient-info').html("");
    $('#statusUpdateDropdown').hide();
    $('#statusUpdateDropdownMenu').html("");
    $("#cancel-booking").html("");
    $("#time1").html("Booking Time:-");
    $("#time2").html("Expired Time:-");
    var beforeDash = $("#book-hospital-id").val();
    var afterDash = $('#bookid').val();
    var bId = beforeDash + "-" + afterDash;
    $.ajax(
    {
        type:'POST',
        url: "/get-booking-details/",
        data:{
            bookid: bId,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $('#fetchBtn').prop('disabled', false);
            $('#fetchBtn').html('Fetch Data');
            if(response.message == 'not_exists')
            {
                $('#bookingFindMessage').html('No Result Found!');
            }
            else
            {
                $("#search-bookid").val(response.book[0]['Booking_ID']);

                $("#admit-department").val(response.book[0]['Bed_No__Department__id'])
                $('#admit-ward').val(response.book[0]['Bed_No__Ward'])
                $('#admit-room').val(response.book[0]['Bed_No__Room__id'])
                $('#admit-unit').val(response.book[0]['Bed_No__Unit__id'])
                admitChangeRequirement(response.book[0]['Bed_No__Support']);
                getDepartmentBeds_forAdmit({bookingId:response.book[0]['Booking_ID'], bedId:response.book[0]['Bed_No__id']});

                $("[name='status']").attr('data-value', response.book[0]['Booking_ID']);
                $("#patient-info-bed").attr('data-value', response.book[0]['Bed_No__id']);
                if(response.book[0]['Status'] == 'Expired')
                {
                    $('#bookingFindMessage').html('Booking has been expired!');
                }
                if(response.message == 'hospital_not_matched')
                {
                    $('#bookingFindMessage').html(`The booking is not done for this hospital!<br>Booking is done for ${response.book[0]['Hospital_Name__Name']}, ${response.book[0]['Hospital_Name__Subdivision']}, ${response.book[0]['Hospital_Name__State']}`);
                }
                if(response.book[0]['Status'] == 'Not Admit Still Now')
                {
                    html = `<button class="btn btn-danger" id="cancelBookingBtn">Cancel This Booking</button>`;
                    $("#cancel-booking").html(html);

                    $('#statusUpdateDropdown').show();
                    var html =
                        `<a class='dropdown-item'> 
                            <button type='button' class='btn btn-warning' data-toggle='modal' data-target='#admit'> 
                                Admit Here
                            </button> 
                        </a>
                        <a class='dropdown-item'> 
                            <button type='button' class='btn btn-success' id='changeStatus-no_admit'> 
                                Patient Don't need to Admit 
                            </button> 
                        </a>
                        <a class='dropdown-item'> 
                        <button type='button' class='btn btn-info' data-toggle='modal' data-target='#statusUpdateReferModel'> 
                            Refer 
                        </button> 
                    </a>
                    <a class='dropdown-item'> 
                        <button type='button' class='btn btn-danger' id='changeStatus-died'> 
                            Patient Is Died 
                        </button> 
                    </a>`
                    $('#statusUpdateDropdownMenu').html(html);
                    $('#admit-requirement').attr("data-book_id", `${response.book[0]['Booking_ID']}`);
                }
                else if(response.book[0]['Status'] == 'Referred'){
                    $('#statusUpdateDropdown').show();
                    var html =
                        `<a class='dropdown-item'> 
                            <button type='button' class='btn btn-warning' data-toggle='modal' data-target='#admit'> 
                                Admit Here
                            </button> 
                        </a>
                        <a class='dropdown-item'> 
                        <button type='button' class='btn btn-info' data-toggle='modal' data-target='#statusUpdateReferModel'> 
                            Refer 
                        </button> 
                    </a>
                    <a class='dropdown-item'> 
                        <button type='button' class='btn btn-danger' id='changeStatus-died'> 
                            Patient Is Died 
                        </button> 
                    </a>`
                    $('#statusUpdateDropdownMenu').html(html);
                }
                else if(response.book[0]['Status'] == 'Admitted' && response.message != 'hospital_not_matched')
                {
                    $('#statusUpdateDropdown').show();
                    var html =
                        `<a class='dropdown-item'> 
                            <button type='button' class='btn btn-primary' id='changeStatus-release'> 
                                Release 
                            </button> 
                        </a>
                        <a class='dropdown-item'> 
                        <button type='button' class='btn btn-info' data-toggle='modal' data-target='#statusUpdateReferModel'> 
                            Refer 
                        </button> 
                    </a>
                    <a class='dropdown-item'> 
                        <button type='button' class='btn btn-danger' id='changeStatus-died'> 
                            Patient Is Died 
                        </button> 
                    </a>`
                    $('#statusUpdateDropdownMenu').html(html);
                }

                var bookingDate = formatDateTime(response.book[0]['Booking_Time']);
                var expireDate = formatDateTime(response.book[0]['Expire_Time']);
                var admitDate = formatDateTime(response.book[0]['Admit_Time']);
                var statusChangedDate = formatDateTime(response.book[0]['Status_Changed_At']);
                $("#referMessage").html('');
                if(response.book[0]['Status'] == "Not Admit Still Now"){
                    $("#time1").html("Booking Time:-");
                    $("#time2").html("Expired Time:-");

                    $('#patient-info-time1').html(bookingDate);
                    $('#patient-info-time2').html(expireDate);
                }
                if(response.book[0]['Status'] == "Don't Need to Admit"){
                    $("#time1").html("Booking Time:-");
                    $("#time2").html("Status Changed At:-");

                    $('#patient-info-time1').html(bookingDate);
                    $('#patient-info-time2').html(statusChangedDate);
                }
                if(response.book[0]['Status'] == 'Admitted'){
                    $("#time1").html("Booking Time:-");
                    $("#time2").html("Admitted Time:-");

                    $('#patient-info-time1').html(bookingDate);
                    $('#patient-info-time2').html(admitDate);
                }
                if(response.book[0]['Status'] == 'Released'){
                    $("#time1").html("Admitted Time:-");
                    $("#time2").html("Released Time:-");

                    $('#patient-info-time1').html(admitDate);
                    $('#patient-info-time2').html(statusChangedDate);
                }
                if(response.book[0]['Status'] == 'Referred'){
                    $("#time1").html("Admitted Time:-");
                    $("#time2").html("Referred Time:-");

                    $('#patient-info-time1').html(admitDate);
                    $('#patient-info-time2').html(statusChangedDate);

                    $("#referMessage").html(`Referred From: ${response.referFrom}<br>Referred To: ${response.referTo}`);
                }
                if(response.book[0]['Status'] == 'Died'){
                    $("#time1").html("Admitted Time:-");
                    $("#time2").html("Died At:-");

                    $('#patient-info-time1').html(admitDate);
                    $('#patient-info-time2').html(statusChangedDate);
                }
                if(response.book[0]['Status'] == 'Expired'){
                    $("#time1").html("Booking Time:-");
                    $("#time2").html("Expired Time:-");

                    $('#patient-info-time1').html(bookingDate);
                    $('#patient-info-time2').html(expireDate);
                }

                $('#patient-info-bed').html(response.bed);
                $('#patient-info-department').html(response.book[0]['Bed_No__Department__department']);
                $('#patient-info-bed_no').html(response.book[0]['Bed_No__Bed_No']);
                $('#patient-info-id').html(response.book[0]['Booking_ID']);
                $('#patient-info-status').html(response.book[0]['Status']);
                $('#patient-info-name').html(response.book[0]['Patient_Name']);
                $('#patient-info-email').html(response.book[0]['Email']);
                $('#patient-info-mobile').html(response.book[0]['Mobile']);
                $('#patient-info-alternative_mobile').html(response.book[0]['Alternative_Mobile']);
                $('#patient-info-state').html(response.book[0]['State']);
                $('#patient-info-district').html(response.book[0]['District']);
                $('#patient-info-pin').html(response.book[0]['Pin']);
                $('#patient-info-subdivision').html(response.book[0]['Subdivision']);
                $('#patient-info-gender').html(response.book[0]['Gender']);

                $("#fetched_book_bed_id").val(response.bedID)
            }
            $('#bookid').val('')
            var hId = $("#id_hospital").val();
            $("#book-hospital-id").val(hId);
        },
        error:function(response)
        {
            $('#bookingFindMessage').html('Some error occurred!');
            $('#fetchBtn').prop('disabled', false);
            $('#fetchBtn').html('Fetch Data');
        }
    });
});


function statusUpdateNoAdmit(){
    $.ajax(
    {
        type:'POST',
        url: "/status-update/",
        data:{
            bookid: $('#search-bookid').val(),
            status:  "Don't Need to Admit",
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            if(response.status == "Don't Need to Admit")
            {
                $("#time1").html("Booking Time:-");
                $("#time2").html("Status Changed At:-");

                bookingDate = formatDateTime(response.patientData[0]['Booking_Time']);
                statusChangedDate = formatDateTime(response.patientData[0]['Status_Changed_At']);
                $('#patient-info-time1').html(bookingDate);
                $('#patient-info-time2').html(statusChangedDate);
                $('#patient-info-status').html(response.patientData[0]['Status']);
                $('#statusUpdateDropdownMenu').html("");
                $('#statusUpdateDropdown').hide();
            }
        },
        error:function()
        {
            
        }
    });
}

function statusUpdateRelease(){
    $.ajax(
    {
        type:'POST',
        url: "/status-update/",
        data:{
            bookid: $('#search-bookid').val(),
            status:  "Release",
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            if(response.status == "Released")
            {
                $("#time1").html("Admitted Time:-");
                $("#time2").html("Released Time:-");

                admitDate = formatDateTime(response.patientData[0]['Admit_Time']);
                statusChangedDate = formatDateTime(response.patientData[0]['Status_Changed_At']);
                $('#patient-info-time1').html(admitDate);
                $('#patient-info-time2').html(statusChangedDate);
                $('#patient-info-status').html(response.patientData[0]['Status']);
                $('#statusUpdateDropdownMenu').html("");
                $('#statusUpdateDropdown').hide();
                window.open(response.url);
            }
        },
        error:function()
        {
            
        }
    });
}

function statusUpdateDied(){
    $.ajax(
    {
        type:'POST',
        url: "/status-update/",
        data:{
            bookid: $('#search-bookid').val(),
            status:  "Died",
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            if(response.status == "Died")
            {
                $("#time1").html("Admitted Time:-");
                $("#time2").html("Died At:-");

                admitDate = formatDateTime(response.patientData[0]['Admit_Time']);
                statusChangedDate = formatDateTime(response.patientData[0]['Status_Changed_At']);
                $('#patient-info-time1').html(admitDate);
                $('#patient-info-time2').html(statusChangedDate);
                $('#patient-info-status').html(response.patientData[0]['Status']);
                $('#statusUpdateDropdownMenu').html("");
                $('#statusUpdateDropdown').hide();
                window.open(response.url);
            }
        },
        error:function()
        {
            
        }
    });
}

$("#statusUpdateForm-admit").on('submit', function(event){
    event.preventDefault();
    $("#admitBtn").prop('disabled', true);
    $("#admitBtn").html("Please Wait");
    $('#admit-bed-message').html("")
    var bed = $("#admit-Bed_No").val();
    let option_count = $('#admit-Bed_No option').length;
    if((bed == '' || bed == null || bed == undefined) && (option_count > 1)){
        $('#admit-bed-message').html(`<span class="text-danger">Please select a bed.</span>`)
    }
    else{
        $.ajax(
        {
            type:'POST',
            url: $(this).attr('action'),
            data:{
                bookid: $('#search-bookid').val(),
                status:  'Admit',
                Bed_Id: bed,
                disease: $("#admit-disease").val(),
                department: $("#admit-department").val(),
                ward: $("#admit-ward").val(),
                requirement: $("#admit-requirement").val(),
                room: $("#admit-room").val(),
                unit: $("#admit-unit").val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success:function(response)
            {  
                if(response.error == '0')
                {
                    $("#admit").modal('hide');
                    if(response.status == 'Admitted')
                    {
                        $("#time1").html("Booking Time:-");
                        $("#time2").html("Admitted Time:-");

                        bookingTime = formatDateTime(response.patientData[0]['Booking_Time']);
                        admitDate = formatDateTime(response.patientData[0]['Admit_Time']);
                        $('#patient-info-time1').html(bookingTime);
                        $('#patient-info-time2').html(admitDate);
                        $('#patient-info-status').html(response.patientData[0]['Status']);
                        $("#patient-info-department").html(response.patientData[0]['Bed_No__Department__department'])
                        $("#patient-info-bed_no").html(response.patientData[0]['Bed_No__Bed_No'])
                        $('#patient-info-bed').html(response.bed);
                        var html =
                            `<a class='dropdown-item'> 
                                <button type='button' class='btn btn-warning' id='changeStatus-release'> 
                                    Release 
                                </button> 
                            </a>
                            <a class='dropdown-item'> 
                                <button type='button' class='btn btn-info' data-toggle='modal' data-target='#statusUpdateReferModel'> 
                                    Refer 
                                </button> 
                            </a>
                            <a class='dropdown-item'> 
                                <button type='button' class='btn btn-danger' id='changeStatus-died'>
                                    Patient Is Died 
                                </button> 
                            </a>`
                        $('#statusUpdateDropdownMenu').html(html);
                        window.open(response.url);
                    }
                }
                $("#admitBtn").html('Admit');
                $("#admitBtn").prop('disabled', false);
            },
            error:function(response)
            {
                $("#admitBtn").html('Admit');
                $("#admitBtn").prop('disabled', false);
                $('#admit-bed-message').html(`<span class="text-danger">Error occurred. Try again!</span>`)
            }
        });
    }
});

$("#statusUpdateForm-refer").on('submit', function(event){
    event.preventDefault();
    $("#referPatient").prop('disabled', true);
    $("#referPatient").html("Please Wait");
    $.ajax(
    {
        type:'POST',
        url: $(this).attr('action'),
        data:{
            bookid:$('#search-bookid').val(),
            referralHospital:$('#referral-hospital').val(),
            status: 'Referred',
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {   
            $("#referPatient").prop('disabled', false);
            $("#referPatient").html("Refer");
            if(response.status == "Referred")
            {
                $("#time1").html("Admitted Time:-");
                $("#time2").html("Referred Time:-");

                admitDate = formatDateTime(response.patientData[0]['Admit_Time']);
                statusChangedDate = formatDateTime(response.patientData[0]['Status_Changed_At']);
                $('#patient-info-time1').html(admitDate);
                $('#patient-info-time2').html(statusChangedDate);
                $("#statusUpdateReferModel").modal('hide');
                $('#patient-info-status').html(response.patientData[0]['Status']);
                $('#statusUpdateDropdownMenu').html("");
                $('#statusUpdateDropdown').hide();
                window.open(response.url);
                
            }
        },
        error:function(response)
        {
            $("#refer-message").html("Sorry! Some error occurred.")
            $("#referPatient").prop('disabled', false);
            $("#referPatient").html("Refer");
        },
    });
});

function cancelBooking(){
    $.ajax(
    {
        type:'POST',
        url: "/status-update/",
        data:{
            bookid: $('#search-bookid').val(),
            status:  "Cancel",
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            if(response.status == "Canceled")
            {
                $('#bookingFindMessage').html("");
                $('#patient-info-bed').html("");
                $('#patient-info-time2').html("");
                $('#patient-info-id').html("");
                $('#patient-info-status').html("");
                $('#patient-info-time1').html("");
                $('#patient-info-name').html("");
                $('#patient-info-email').html("");
                $('#patient-info-mobile').html("");
                $('#patient-info-alternative_mobile').html("");
                $('#patient-info-state').html("");
                $('#patient-info-district').html("");
                $('#patient-info-pin').html("");
                $('#patient-info-subdivision').html("");
                $('#patient-info-gender').html("");
                $('#statusUpdateDropdown').hide();
                $('#statusUpdateDropdownMenu').html("");
                $("#cancel-booking").html("");
                
            }
        },
        error:function()
        {
            
        }
    });
}

$('#statusUpdateDropdownMenu').on('click', '#changeStatus-no_admit', function(){
    twoButtonAlert('Are You Sure To Not Admit The Patient?', 'No', 'Yes', statusUpdateNoAdmit)
});

$('#statusUpdateDropdownMenu').on('click', '#changeStatus-release', function(){
    twoButtonAlert('Are You want To Release The Patient?', 'No', 'Yes', statusUpdateRelease)
});

$('#statusUpdateDropdownMenu').on('click', '#changeStatus-died', function(){
    twoButtonAlert('Are You Sure That The Patient Is Died?', 'No', 'Yes', statusUpdateDied)
});

$('#cancel-booking').on('click', '#cancelBookingBtn', function(){
    twoButtonAlert('Are You want To Cancel This Booking?', 'No', 'Yes', cancelBooking)
});



function resetRemoveBedForm(){
    $("#remove-requirement").html('<option label="Select Support"></option>');
    $("#removebedmeesage").html('');
}
$("#removeBedForm").on('reset', resetRemoveBedForm);



document.getElementById('bookingInfoClearBtn').addEventListener("click", function(){
    $("#bookid").val('');
    $('#bookingFindMessage').html("");
    $('#fetchBtn').prop('disabled', false);
    $('#fetchBtn').html('Fetch Data');
    $('#patient-info-bed').html("");
    $('#patient-info-time2').html("");
    $('#patient-info-id').html("");
    $('#patient-info-status').html("");
    $('#patient-info-time1').html("");
    $('#patient-info-name').html("");
    $('#patient-info-email').html("");
    $('#patient-info-mobile').html("");
    $('#patient-info-alternative_mobile').html("");
    $('#patient-info-state').html("");
    $('#patient-info-district').html("");
    $('#patient-info-pin').html("");
    $('#patient-info-subdivision').html("");
    $('#patient-info-gender').html("");
    $('#statusUpdateDropdown').hide();
    $('#statusUpdateDropdownMenu').html("");
    $("#time1").html("Booking Time:-");
    $("#time2").html("Expired Time:-");
});


$(document).ready(fetchAllDiseases)
var list_allDiseases;
function fetchAllDiseases(){
    $.ajax(
    {
        type:'GET',
        url: "/get-all-disease/",
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            list_allDiseases = response.diseases
        },
    });
}
$(document).ready(function(){
    var uri = `/events/new-disease/`;
    let lastEventId = $("#last-new-disease-strean-id").val();
    lastEventId = lastEventId.split(":")
    lastEventId = `${lastEventId[0]}:${lastEventId[1]-1}`
    var es = new ReconnectingEventSource(uri, {lastEventId: lastEventId});
    es.addEventListener('message', function (event) {
        let receivedData = JSON.parse(event.data)
        if(!list_allDiseases.includes(receivedData['new_disease'])){
            list_allDiseases.push(receivedData['new_disease'])
            list_allDiseases.sort()
        }
    }, false);
    es.onerror = function () {
        console.log('*** connection lost, reconnecting...');
    };
    es.addEventListener('stream-reset', function () {
        console.log('*** client too far behind, please refresh');
    }, false);
    return true;
})


autocomplete_options =  {
    autoSelect: true,
    search: input => {
        return new Promise(resolve => {
            if (input.length > 1) {
                l = list_allDiseases.filter(function(currentValue){
                    return currentValue.toLowerCase().includes(input.toLowerCase())
                })
                return resolve(l)
            }
            else{
                return resolve([])
            }
        });
    },
    renderResult: (result, props) => {
        renderedHtml = `
        <li ${props}>
            <div class="autocomplete-option-title">
                ${result}
            </div>
        </li>
        `
        return renderedHtml;
    },
}
// Attach autocomplete to each element
$.initialize(".autocomplete-disease", function() {
    new Autocomplete(this, autocomplete_options)
});

  

$("#book-hospital-id").on('keyup', function(){
    fieldValue = $(this).val();
    maxLength = Number($(this).attr('maxlength'));
    if(fieldValue.length >= maxLength){
        $('#bookid').focus();
    }
});
$('#bookid').on('keydown', function(event){
    if(event.key === 'Backspace'){
        fieldValue = $(this).val();
        if(fieldValue.length <= 0){
            $("#book-hospital-id").focus();
            document.getElementById("book-hospital-id").selectionStart = document.getElementById("book-hospital-id").value.length;
        }
    }
});

$("#admitSearch-hospitalId").on('keyup', function(){
    fieldValue = $(this).val();
    maxLength = Number($(this).attr('maxlength'));
    if(fieldValue.length >= maxLength){
        $('#admitSearch-bookingId').focus();
    }
});
$('#admitSearch-bookingId').on('keydown', function(event){
    if(event.key === 'Backspace'){
        fieldValue = $(this).val();
        if(fieldValue.length <= 0){
            $("#admitSearch-hospitalId").focus();
            document.getElementById("admitSearch-hospitalId").selectionStart = document.getElementById("admitSearch-hospitalId").value.length;
        }
    }
});

$("#pastPatientsSearch-hospitalId").on('keyup', function(){
    fieldValue = $(this).val();
    maxLength = Number($(this).attr('maxlength'));
    if(fieldValue.length >= maxLength){
        $('#pastPatientsSearch-bookingId').focus();
    }
});
$('#pastPatientsSearch-bookingId').on('keydown', function(event){
    if(event.key === 'Backspace'){
        fieldValue = $(this).val();
        if(fieldValue.length <= 0){
            $("#pastPatientsSearch-hospitalId").focus();
            document.getElementById("pastPatientsSearch-hospitalId").selectionStart = document.getElementById("pastPatientsSearch-hospitalId").value.length;
        }
    }
});


$("[data-target='#site-content-update-status']").on('click', function(){
    $('#bookid').val('')
    var hId = $("#id_hospital").val();
    $("#book-hospital-id").val(hId);
    $('#bookingFindMessage').html('');
});


function reserveBedTimer(setTime){
    let datetime = new Date()
    datetime.setSeconds( datetime.getSeconds() + Number(setTime));
    // Update the count down every 1 second
    varInterval = setInterval(function(){
        let current_datetime = new Date()
        distance = datetime - current_datetime;
        var hours =  Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        $("#reserveBedTimer").html(`<i class="fa-solid fa-timer"></i> ${minutes < 10 ? '0'+minutes : minutes} Min ${seconds < 10 ? '0'+seconds : seconds} Sec`);

        // If the count down is finished
        if (distance <= 0)
        {
            bedReserved = false;
            document.getElementById('reserve-bed').disabled = false;
            $(".admit-field-patitent-data").prop("disabled", true);
            $(".new-admit-field").val('')
            $("#reserveBedTimer").html("");
            $('#reserveMessage').html('');
            clearInterval(varInterval);
        }
    }, 1000);
}
$(document).ready(function() {
    $(".admit-field-patitent-data").prop("disabled", true);
});
document.getElementById('book-Bed_No').addEventListener("change", function(){
    document.getElementById('reserve-bed').disabled = false;
    $(".admit-field-patitent-data").prop("disabled", true);
    $('#reserveMessage').html('');
});
var bedReserved = false;
document.getElementById('reserve-bed').addEventListener("click", function(){
    $('#reserveMessage').html('');
    $(".admit-field-bed-data-error").html("")
    let required_error = false
    $(".admit-field-bed-data[required]").each(function(){
        if(this.value == '' || this.value == null || this.value == undefined){
            thisId = $(this).attr('id')
            err = $(`#${thisId}`).parent().next(".admit-field-bed-data-error")
            $(err).html("This field is required")
            required_error = true
        }
    })
    bed = $('#book-Bed_No').val()
    let option_count = $('#book-Bed_No option').length;
    if((bed == '' || bed == null || bed == undefined) && (option_count > 1)){
        $('#reserveMessage').html(`<span class="text-danger">Please select a bed.</span>`)
    }
    else if(!required_error){
        bedReserved = false;
        document.getElementById('reserve-bed').disabled = true;
        $.ajax(
        {
            type:'POST',
            url: "/reserve-book/",
            data:{
                bedNo: bed,
                department: $("#book-department").val(),
                ward: $("#book-ward").val(),
                support: $("#book-requirement").val(),
                room: $("#book-room").val(),
                unit: $("#book-support").val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success:function(response)
            {
                if(response.error == '0')
                {
                    $('#reserveMessage').html(`<span style='color:green'>${response.message}</span>`);
                    $(".admit-field-patitent-data").prop("disabled", false);
                    bedReserved = true;
                    reserveBedTimer(15*60)
                }
                else if(response.error == '00')
                {
                    $('#reserveMessage').html(`<span style='color:green'>${response.message}</span>`);
                    $(".admit-field-patitent-data").prop("disabled", false);
                    bedReserved = true;
                }
                else if(response.error == '1')
                {
                    $('#reserveMessage').$('#reserveMessage').html("<span class='text-danger'>Select a bed</span>")
                    $(".admit-field-patitent-data").prop("disabled", true);
                    document.getElementById('reserve-bed').disabled = false;
                }
            },
            error:function(response)
            {
                document.getElementById('reserve-bed').disabled = false;
                $(".admit-field-patitent-data").prop("disabled", true);
                $('#reserveMessage').html("<span class='text-danger'>Failed! Try again</span>");
            }
        });
    }
});

$("#is_unknown").on('change', disabeBookInput);
function disabeBookInput(){
    if(bedReserved){
        let isClicked = $("#is_unknown").is(':checked')
        if(isClicked){
            $(".admit-field-patitent-data").prop('disabled', true);
            $('input[name=gender]').prop('disabled', false);
            $("#disease").prop('disabled', false);
            $("#new-admitBtn").prop('disabled', false)
        }
        else{
            $(".admit-field-patitent-data").prop("disabled", false);
        }
        $("#is_unknown").prop('disabled', false);
    }
}

$("#newAdmit").on('reset', function(){
    $("#book-requirement").html(`<option label="Select Support"></option>`);
    $("#book-Bed_No").html(`<option label="Select Bed"></option>`);
    $("#patient-district").html(`<option label="Select District"></option>`);
});

$("#newAdmit").on('submit', function(event) {
    event.preventDefault();
    let theForm = new FormData(this);
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    $("#newAdmit :input").prop("disabled", true);
    document.getElementById('admitBtn').disabled = true;
    $('#new-admitBtn').html("<i class='fas fa-compact-disc fa-spin' style='font-size:22px;'></i>");
    $('#reserveMessage').html('');
    $('#admitMessage').html('')
    $.ajax(
    {
        type:'POST',
        url: "/new-book/",
        data: theForm,
        contentType: false,
        processData: false,
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $("#newAdmit :input").prop("disabled", false);
            disabeBookInput();
            if(response.error == '1')
            {
                showSingleButtonAlert('Bed Not Available', 'Selected bed is not available. Please choise other bed.', 'Okay');
            }
            else if(response.success == '1')
            {
                window.open(response.url);
                $("#newAdmit").trigger('reset');
                $(".admit-field-patitent-data").prop("disabled", true);
                bedReserved = false;
            }
            else
            {
                showSingleButtonAlert('Error', '<b>Sorry!</b> Some Error Ocurred.', 'Try Again');
            }
            $('#new-admitBtn').html('Done')
        },
        error:function(response)
        {
            $("#newAdmit :input").prop("disabled", false);
            disabeBookInput();
            $('#new-admitBtn').html('Done')
            showSingleButtonAlert('Server Error', '<b>Sorry!</b> Some Error Ocurred.', 'Try Again');
        }
    });
});

$("#admitDataBodyModal").on('submit', '.patientUpdateForm', function(event){
    event.preventDefault();
    id= $(this).attr('data-id')
    let theForm = new FormData(this);
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    $(".patientUpdateForm :input").prop("disabled", true);
    $(`#patient-update-message-${id}`).html("");
    $(`#updateSub-${id}`).html('Please Wait....');
    $.ajax(
    {
        type:'POST',
        url: "/patient-update/",
        data: theForm,
        contentType: false,
        processData: false,
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $(".patientUpdateForm :input").prop("disabled", false);
            if(response.success)
            {
                patient = JSON.parse(response.patient);
                patient = patient[0].fields;
                console.log(patient.Patient_Name)
                
                $(`#updateBtn-div-${id}`).hide();
                console.log(document.getElementById(`admitData-Patient_Name-${id}`))
                document.getElementById(`admitData-Patient_Name-${id}`).innerHTML = patient.Patient_Name;
                console.log(document.getElementById(`admitData-Patient_Name-${id}`))
                $(`#admitData-Email-${id}`).html(patient.Email);
                $(`#admitData-Mobile-${id}`).html(patient.Mobile);
                $(`#admitData-Alternative_Mobile-${id}`).html(patient.Alternative_Mobile);
                $(`#admitData-Age-${id}`).html(patient.Age);
                $(`#admitData-Subdivision-${id}`).html(patient.Subdivision);
                $(`#admitData-State-${id}`).html(patient.State);
                $(`#admitData-District-${id}`).html(patient.District);
                $(`#admitData-Pin-${id}`).html(patient.Pin);
                $(`#admitData-Gender-${id}`).html(patient.Gender1);
                $(`#update-${id}`).modal('hide');
            }
            else
            {
                showSingleButtonAlert('Error', '<b>Sorry!</b> Some Error Ocurred.', 'Try Again');
            }
            $(`#updateSub-${id}`).html('Update');
        },
        error:function(response)
        {
            $(".patientUpdateForm :input").prop("disabled", false);
            $(`#updateSub-${id}`).html('Update');
            showSingleButtonAlert('Server Error', '<b>Sorry!</b> Some Error Ocurred.', 'Try Again');
        }
    });
});


function admitEmailCheck()
{
    var email = $('#admit_email').val()
    var positionOfAt = email.indexOf("@");
    var positionOfDot = email.lastIndexOf(".");

    if(email.search("@") == -1 || //if '@' is not present
    email.search(" ") >= 1 || //if blank space is present
    email.search(".") == -1 || //if "." is not present
    positionOfAt < 1 || //if there is no character before "@", at least one character should be present before "@"
    positionOfDot - positionOfAt <= 2 || //between '@' and '.', if there is not at least two character
    email.length - positionOfDot <= 2) //if after '.' there is not at least two character)
    {
        $('#admit_email').addClass('is-invalid')
        $('#admitEmailMessage').html('Please enter valid email id!');
        document.getElementById('admitBtn').disabled = true;
    }
    else
    {
        $('#admit_email').removeClass('is-invalid')
        $('#admitEmailMessage').html('');
        document.getElementById('admitBtn').disabled = false;
    }
}
$('#admit_email').on('change', function(){
    admitEmailCheck()
});


$(document).on('change', "[data-requirement]", function(){
    let wardField = $(this);
    changeRequirements(wardField);
});
function changeRequirements(wardField){
    var select = wardField.attr('data-requirement');
    let ward = wardField.val()
    var bedfield = wardField.attr('data-bed');
    $(bedfield).html(`<option label='Select Bed'></option>`)
    $(select).attr({
        "data-toggle": "",
        "data-placement": "",
        "title": ""
    })
    if(ward == 'ICU' || ward == 'PICU' || ward == 'NICU')
    {
        $(select).html('');
        let option0 = "<option label='Select Support'></option>"
        let option1 = "<option value='With Ventilator'>With Ventilator</option>";
        let option2 = "<option value='Non-Ventilator'>Non-Ventilator</option>";
        $(select).html(option0 + option1 + option2);
    }
    else if(ward == 'Female Ward' || ward == 'Male Ward' || ward == 'Child Ward')
    {
        $(select).html('');
        let option0 = "<option label='Select Support'></option>"
        let option1 = "<option value='With Oxygen'>With Oxygen</option>";
        let option2 = "<option value='Non-Oxygen'>Non-Oxygen</option>";
        $(select).html(option0 + option1 + option2);
    }
    else{
        $(select).html("<option label='Select Support'></option>");
        $(select).attr({
            "data-toggle": "tooltip",
            "data-placement": "top",
            "title": "Select Ward First"
        })
    }
}

$("#admit-ward").on('change', admitChangeRequirement);
function admitChangeRequirement(arg=''){
    var wardField = $("#admit-ward");
    changeRequirements(wardField);
    if(arg != '')
    {
        $('#admit-requirement').val(arg);
    }
}
$("#book-ward").on('change', function(){
    document.getElementById('reserve-bed').disabled = false;
    $(".admit-field-patitent-data").prop("disabled", true);
    $('#reserveMessage').html('');
});


$("#admit-department").on('change', getDepartmentBeds_forAdmit);
$("#admit-requirement").on('change', getDepartmentBeds_forAdmit);
$("#admit-room").on('change', getDepartmentBeds_forAdmit);
$("#admit-unit").on('change', getDepartmentBeds_forAdmit);
function getDepartmentBeds_forAdmit({bookingId, bedId}={})
{
    $("#admit-bed-message").html(`<span class="text-dark">Fetching available beds. Please wait...</span>`);
    $("#admit-Bed_No").html(`<option label="Select Bed"></option>`)
    departmentVal = $('#admit-department').val();
    wardVal = $('#admit-ward').val()
    requirementVal = $('#admit-requirement').val();
    roomVal = $('#admit-room').val();
    unitVal = $('#admit-unit').val();
    $("#admitBtn").prop('disabled', true)
    $.ajax(
    {
        url: "/get-department-beds/",
        data:{
            'department':departmentVal,
            'ward':wardVal,
            'requirement': requirementVal,
            'room':roomVal,
            'unit':unitVal,
            'bookingId': bookingId,
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            $("#admitBtn").prop('disabled', false)
            if(response.bed.length <= 0 && departmentVal != '' && wardVal != '' && requirementVal != '')
            {
                $("#admit-bed-message").html("No beds are available");
            }
            else
            {
                $("#admit-bed-message").html("");
                for(i=0; i<response.bed.length; i++)
                {
                    innerHTML = `BED NO: ${response.bed[i]['Bed_No']}, ROOM: ${response.bed[i]['Room__Room']}, UNIT: ${response.bed[i]['Unit__Unit']}, FLOOR: ${response.bed[i]['Floor']}, BUILDING: ${response.bed[i]['Building__Building']}`;
                    console.log(innerHTML)
                    $("#admit-Bed_No").append(`<option value="${response.bed[i]['id']}">${innerHTML}</option>`)
                }
                document.getElementById("admit-Bed_No").selectedIndex = 1
            }
            if(bedId != '')
            {
                $("#admit-Bed_No").val(bedId);
            }
        },
    });
}

$("#book-department").on('change', getDepartmentBeds_forBook);
$("#book-requirement").on('change', getDepartmentBeds_forBook);
$("#book-room").on('change', getDepartmentBeds_forBook);
$("#book-unit").on('change', getDepartmentBeds_forBook);
function getDepartmentBeds_forBook()
{
    document.getElementById('reserve-bed').disabled = false;
    $(".admit-field-patitent-data").prop("disabled", true);
    $('#reserveMessage').html('');

    $("#book-bed-message").html(`<span class="text-dark">Fetching available beds. Please wait...</span>`);
    $("#book-Bed_No").html(`<option label="Select Bed"></option>`)
    departmentVal = $('#book-department').val();
    wardVal = $('#book-ward').val()
    requirementVal = $('#book-requirement').val();
    roomVal = $('#book-room').val();
    unitVal = $('#book-unit').val();
    $("#reserve-bed").prop('disabled', true)
    $.ajax(
    {
        url: "/get-department-beds/",
        data:{
            'department':departmentVal,
            'ward':wardVal,
            'requirement':requirementVal,
            'room':roomVal,
            'unit':unitVal,
            'allowReserve': 'Yes',
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            $("#reserve-bed").prop('disabled', false)
            if(response.bed.length <= 0 && departmentVal != '' && wardVal != '' && requirementVal != '')
            {
                $("#book-bed-message").html("No beds are available");
            }
            else
            {
                $("#book-bed-message").html("");
                for(var i in response.bed)
                {
                    innerHTML = `BED NO: ${response.bed[i]['Bed_No']}, ROOM: ${response.bed[i]['Room__Room']}, UNIT: ${response.bed[i]['Unit__Unit']}, FLOOR: ${response.bed[i]['Floor']}, BUILDING: ${response.bed[i]['Building__Building']}`;
                    $("#book-Bed_No").append(`<option value="${response.bed[i]['id']}">${innerHTML}</option>`)
                }
                document.getElementById("book-Bed_No").selectedIndex = 1
            }
            
        },
    });
}

$("#admitDataBodyModal").on('change', ".patient-edit-department", getDepartmentBeds_patientShift)
$("#admitDataBodyModal").on('change', ".patient-edit-requirement", getDepartmentBeds_patientShift)
$("#admitDataBodyModal").on('change', ".patient-edit-room", getDepartmentBeds_patientShift)
$("#admitDataBodyModal").on('change', ".patient-edit-unit", getDepartmentBeds_patientShift)
function getDepartmentBeds_patientShift(){
    var id = $(this).attr('data-book_id');
    $("#edit-bed-message-"+id).html(`<span class="text-dark">Fetching available beds. Please wait...</span>`);
    $(`#change-Bed_No-${id}`).html(`<option label="Select Bed"></option>`);
    departmentVal = $('#change-department-'+id).val()
    wardVal = $('#change-ward-'+id).val()
    requirementVal = $('#change-requirement-'+id).val();
    roomVal = $('#change-room-'+id).val()
    unitVal = $('#change-unit-'+id).val()
    $(`#shift_bed_submit_btn-${id}`).prop('disabled', true)
    $.ajax(
    {
        url: "/get-department-beds/",
        data:{
            'department':departmentVal,
            'ward':wardVal,
            'requirement': requirementVal,
            'room':roomVal,
            'unit':unitVal,
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            $(`#shift_bed_submit_btn-${id}`).prop('disabled', false)
            if(response.bed.length <= 0 && departmentVal != '' && wardVal != '' && requirementVal != '')
            {
                $("#edit-bed-message-no-bed-"+id).html("No beds are available");
            }
            else
            {
                $("#edit-bed-message-no-bed-"+id).html("");
                for(var i in response.bed)
                {
                    innerHTML = `BED NO: ${response.bed[i]['Bed_No']}, ROOM: ${response.bed[i]['Room__Room']}, UNIT: ${response.bed[i]['Unit__Unit']}, FLOOR: ${response.bed[i]['Floor']}, BUILDING: ${response.bed[i]['Building__Building']}`;
                    $(`#change-Bed_No-${id}`).append(`<option value="${response.bed[i]['id']}">${innerHTML}</option>`)
                }
                document.getElementById(`change-Bed_No-${id}`).selectedIndex = 1
            }
            
        },
    });
}

$("#referralDataBodyModal").on('change', ".referralAdmit-input-department", getDepartmentBeds_referrAdmit)
$("#referralDataBodyModal").on('change', ".referralAdmit-input-requirement", getDepartmentBeds_referrAdmit)
$("#referralDataBodyModal").on('change', ".referralAdmit-input-room", getDepartmentBeds_referrAdmit)
$("#referralDataBodyModal").on('change', ".referralAdmit-input-unit", getDepartmentBeds_referrAdmit)
function getDepartmentBeds_referrAdmit(){
    var id = $(this).attr('data-book_id');
    $("#referralAdmit-message-"+id).html("");
    $(`#referralAdmit-Bed_No-${id}`).html(`<option label="Select Bed"></option>`);
    departmentVal = $('#referralAdmit-department-'+id).val()
    wardVal = $('#referralAdmit-ward-'+id).val()
    requirementVal = $('#referralAdmit-requirement-'+id).val();
    roomVal = $('#referralAdmit-room-'+id).val()
    unitVal = $('#referralAdmit-unit-'+id).val()
    $(`#referralAdmitFormBtn-${id}`).prop('disabled', true)
    $.ajax(
    {
        url: "/get-department-beds/",
        data:{
            'department':departmentVal,
            'ward':wardVal,
            'requirement': requirementVal,
            'room':roomVal,
            'unit':unitVal,
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            $(`#referralAdmitFormBtn-${id}`).prop('disabled', false)
            if(response.bed.length <= 0 && departmentVal != '' && wardVal != '' && requirementVal != '')
            {
                $("#referralAdmit-message-"+id).html("No beds are available");
            }
            else
            {
                for(var i in response.bed)
                {
                    opt.innerHTML = `BED NO: ${response.bed[i]['Bed_No']}, ROOM: ${response.bed[i]['Room__Room']}, UNIT: ${response.bed[i]['Unit__Unit']}, FLOOR: ${response.bed[i]['Floor']}, BUILDING: ${response.bed[i]['Building__Building']}`;
                    $(`#referralAdmit-Bed_No-${id}`).append(`<option value="${response.bed[i]['id']}">${innerHTML}</option>`)
                }
                document.getElementById(`referralAdmit-Bed_No-${id}`).selectedIndex = 1
            }
            
        },
    });
}

$("#patient-state").on('change', loadDistrict);
$("#edit-state").on('change', loadDistrict);
$("#admitDataBodyModal").on('change', ".patient-update-input-state", loadDistrict);
function loadDistrict()
{
    var state = $(this).val();
    var districtFieldId = $(this).attr("data-district_option");
    $(districtFieldId).html(`<option label="Select District"></option>`);
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
                $(districtFieldId).append(`<option value="${response.districts[i]}">${response.districts[i]}</option>`)
            }
            
        },
    });
}


$("#patient-pin").on('keyup', loadAddress);
function loadAddress(){
    pin = $(this).val();
    if(pin.length == 6)
    {
        document.getElementById('pinLoader').style.display = 'inline-block';
        $('#patient-subdivision').val('');
        $('#patient-state').val('');

        $('#patient-subdivision').prop('disabled', true);
        $('#patient-state').prop('disabled', true);
        $('#patient-district').prop('disabled', true);

        var select_dist = document.getElementById("patient-district");
        select_dist.options.length = 0;

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
                select_dist.options.length = 0;
                $('#patient-subdivision').val(response.city);
                $('#patient-state').val(response.state);

                for(var i in response.districts)
                {
                    var newOption = new Option(response.districts[i], response.districts[i]);
                    select_dist.add(newOption,undefined);
                }
                if(response.districtFind){
                    select_dist.value = response.district;
                }
                else{
                    $("#patient-district").prepend(`<option label="Select District" selected></option>`);
                }
                $('#patient-subdivision').prop('disabled', false);
                $('#patient-state').prop('disabled', false);
                $('#patient-district').prop('disabled', false);
                document.getElementById('pinLoader').style.display = 'none';
                
            },
            error: function(response)
            {
                $('#patient-subdivision').prop('disabled', false);
                $('#patient-state').prop('disabled', false);
                $('#patient-district').prop('disabled', false);
                document.getElementById('pinLoader').style.display = 'none';
                
            }
        });
    }
}

$("#admitDataBodyModal").on('keyup', ".patient-update-input-pin", function(){
    pin = $(this).val();
    id = $(this).attr('data-id');
    if(pin.length == 6)
    {
        document.getElementById('PatientUpdate-pinLoader').style.display = 'block';
        $(`#update-patient-subdivision-${id}`).val('');
        $(`#update-patient-state-${id}`).val('');

        $(`#update-patient-subdivision-${id}`).prop('disabled', true);
        $(`#update-patient-state-${id}`).prop('disabled', true);
        $(`#update-patient-district-${id}`).prop('disabled', true);

        var select_dist = document.getElementById(`update-patient-district-${id}`);
        select_dist.options.length = 0;

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
                select_dist.options.length = 0;
                $(`#update-patient-subdivision-${id}`).val(response.city);
                $(`#update-patient-state-${id}`).val(response.state);

                for(var i in response.districts)
                {
                    var newOption = new Option(response.districts[i], response.districts[i]);
                    select_dist.add(newOption,undefined);
                }
                if(response.districtFind){
                    select_dist.value = response.district;
                }
                else{
                    $(`#update-patient-district-${id}`).prepend(`<option label="Select District" selected></option>`);
                }
                $(`#update-patient-subdivision-${id}`).prop('disabled', false);
                $(`#update-patient-state-${id}`).prop('disabled', false);
                $(`#update-patient-district-${id}`).prop('disabled', false);
                document.getElementById('PatientUpdate-pinLoader').style.display = 'none';
                
            },
            error: function(response)
            {
                $(`#update-patient-subdivision-${id}`).prop('disabled', false);
                $(`#update-patient-state-${id}`).prop('disabled', false);
                $(`#update-patient-district-${id}`).prop('disabled', false);
                document.getElementById('PatientUpdate-pinLoader').style.display = 'none';
            }
        });
    }
});

$("#edit-pin").on('keyup', function(){
    var pin = $(this).val()
    if(pin.length == 6)
    {
        var select_state = document.getElementById("edit-state");
        $('#edit-subdivision').val('');
        $('#edit-state').val('');
        $('#edit-district').val('');

        $('#edit-subdivision').prop('disabled', true);
        $('#edit-city').prop('disabled', true);
        $('#edit-state').prop('disabled', true);
        $('#edit-district').prop('disabled', true);

        var select_dist = document.getElementById("edit-district");
        select_dist.options.length = 0;
        $.ajax(
        {
            url: "/get-address/",
            data:{
                'pin':pin,
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            { select_dist.options.length = 0;
                
                $('#edit-subdivision').val(response.city);
                $('#edit-city').val(response.city);
                $('#edit-state').val(response.state);

                for(var i in response.districts)
                {
                    var newOption = new Option(response.districts[i], response.districts[i]);
                    select_dist.add(newOption,undefined);
                }
                if(response.districtFind){
                    select_dist.value = response.district;
                }
                else{
                    $("#edit-district").prepend(`<option label="Select District" selected></option>`);
                }

                $('#edit-subdivision').prop('disabled', false);
                $('#edit-city').prop('disabled', false);
                $('#edit-state').prop('disabled', false);
                $('#edit-district').prop('disabled', false);   
            },
        });
    }
});



function updateAntivenom()
{
    var id = $("#id_hospital").val();
    $.ajax(
    {
        type:'POST',
        url: "/update-antivenom/",
        data:{
            hospitalId:id,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            if(response.error != '0')
            {
                html = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <strong>Sorry!</strong> Something went wrong. Please try again.
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`
                $("#antivenom-error-alert").html(html)

                var checkbox = $("#id_update-antivenom").prop('checked');
                $("#id_update-antivenom").prop('checked', !checkbox);
            }
        },
        error:function(){
            html = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <strong>Sorry!</strong> Something went wrong. Please try again.
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`
                $("#antivenom-error-alert").html(html)
        }
    });
}
$("#id_update-antivenom").on('change', updateAntivenom)


$("#reset_book").on('click', resetBook);
function resetBook()
{
    $("#book-requirement").html(`<option label="Select Support"></option>`);
    $("#book-Bed_No").html(`<option label="Select Bed"></option>`);
    $("#patient-district").html(`<option label="Select District"></option>`);
}


$('#picture').on('change', function(){
    document.getElementById('image-upload-button').innerHTML = "Change Profile Picture";
    var fileUpload = this;
    if (typeof(fileUpload.files) != undefined) {
        var size = fileUpload.files[0].size / 1024;
        var fileType = fileUpload.files[0].type.split('/')[0];
        if(fileType != 'image')
        {
            showSingleButtonAlert('Not A Proper Image File', "This is not an image file.<br>Select an image file.", 'OK')
        }
        else if(size > 1024*5)
        {
            showSingleButtonAlert('Not A Proper Image File', "Image size should be maximum 5 MB.", 'OK')
        }
        else if (fileUpload.files && fileUpload.files[0])
        {
            afterCropFunction = function(){
                uploadImage()
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                initializeImageCroper({image_src:e.target.result, aspect_ratio:16 / 9, image_input:'#picture', afterCropFunction:afterCropFunction,})
            }
            reader.readAsDataURL(fileUpload.files[0]);
            $(this).val('')
        }
    }
})
function uploadImage(){
    form = document.getElementById('imageForm');
    let theForm = new FormData(form);
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    $(".btn-upload").prop('disabled', true);
    imageUploadButton = document.getElementById('image-upload-button');
    dotMovingAnimation(imageUploadButton, 8);
    $.ajax(
    {
        type:'POST',
        url: "/hospital-image-change/",
        data: theForm,
        contentType: false,
        processData: false,
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $(".btn-upload").prop('disabled', false);
            if(response.success == '1'){
                var fileUpload = document.getElementById("picture");
                if (typeof(fileUpload.files) != undefined) {
                    if(fileUpload.files && fileUpload.files[0])
                    {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            $('#img_id').attr('src', e.target.result);
                            $("#id_card-img-top").attr('src', e.target.result)
                            $("#profile-icon").attr('src', e.target.result)
                        }
                        reader.readAsDataURL(fileUpload.files[0]);
                    }
                }
            }
            else if(response.success == '0'){
                showSingleButtonAlert('Not A Proper Image File', response.message, 'OK')
            }
            dotMovingAnimation(imageUploadButton, 0);
            imageUploadButton.innerHTML = "Change Profile Picture";
        },
        error:function(){
            $(".btn-upload").prop('disabled', false);
            showSingleButtonAlert('Error', 'Some Error Ocurred', 'Try Again');
            dotMovingAnimation(imageUploadButton, 0);
            imageUploadButton.innerHTML = "Change Profile Picture";
        }
    });
}


$(document).ready(function(){
    $("#table-refresh").removeClass('fa-spin');
});


$('#edit-email').on('keyup', function(){
    let email = $(this).val();
    var positionOfAt = email.indexOf("@");
    var positionOfDot = email.lastIndexOf(".");

    if(email.search("@") == -1 || //if '@' is not present
    email.search(" ") >= 1 || //if blank space is present
    email.search(".") == -1 || //if "." is not present
    positionOfAt < 1 || //if there is no character before "@", at least one character should be present before "@"
    positionOfDot - positionOfAt <= 2 || //between '@' and '.', if there is not at least two character
    email.length - positionOfDot <= 2) //if after '.' there is not at least two character)
    {
        $('#emailMessage').html('Please enter valid email id!');
        $("#contactUpdateBtn").prop('disabled', true);
        $("#email-otp-send-btn").prop('disabled', true);
    }
    else
    {
        $('#emailMessage').html('');
        $("#contactUpdateBtn").prop('disabled', false);
        let data_value = $(this).attr('data-value')
        if(email != data_value){
            $("#email-otp-send-btn").prop('disabled', false)
        }
    }
});


$("#edit-mobile").on('keyup', function(){
    let mobile = $(this).val()
    let data_value = $(this).attr('data-value')
    if(mobile == data_value){
        $("#mobile-otp-send-btn").prop('disabled', true)
    }
    else if(mobile.length == 10){
        $("#mobile-otp-send-btn").prop('disabled', false)
    }
})
$("#mobile-otp-send-btn").on('click', mobileOtpSend);
function mobileOtpSend(){
    let mobile = $("#edit-mobile").val();
    $("#mobileotpvalidation").html('');
    $("#mobile-otp-sent-to").html('');
    if(mobile.length == 10){
        clearInterval(interval2);
        $(this).prop('disabled', true);
        $(this).html('Sending...');
        otpSendToMobile = undefined;
        mobileOtpSent = false;
        $.ajax(
        {
            type:'POST',
            url: "/hospital-edit-otp-send/",
            data:{
                contact: mobile,
                sendTo: 'mobile',
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success:function(response)
            {
                if(response.success){
                    clearInterval(interval2);
                    t = 120;
                    timer2(t);
                    $("#mobile-otp-sent-to").html(`OTP sent to ${mobile}`);
                    $("#edit-mobile-otp").val('');
                    otpSendToMobile = mobile;
                    mobileOtpSent = true;
                }
            },
            error: function(response)
            {
                $("#mobile-otp-send-btn").prop('disabled', false);
                $("#mobile-otp-send-btn").html('Resend OTP');
                $("#mobile-otp-sent-to").html('OTP send failed!');
            },
        });
    }
    else{
        $("#mobileMessage").html(`Enter 10 digit mobile no`);
    }
}

$("#email-otp-send-btn").on('click', emailOtpSend);
function emailOtpSend(){
    let email = $("#edit-email").val();
    $("#emailotpvalidation").html('');
    $("#email-otp-sent-to").html('');
    clearInterval(interval1);
    $(this).prop('disabled', true);
    $(this).html('Sending...');
    otpSendToEmail = undefined;
    emailOtpSent = false;
    $.ajax(
    {
        type:'POST',
        url: "/hospital-edit-otp-send/",
        data:{
            email: email,
            sendTo: 'email',
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            if(response.success){
                clearInterval(interval1);
                t = 120;
                timer1(t);
                $("#email-otp-sent-to").html(`OTP sent to ${email}`);
                $("#edit-email-otp").val('');
                otpSendToEmail = email;
                emailOtpSent = true;
            }
        },
        error: function(response)
        {
            $("#email-otp-send-btn").prop('disabled', false);
            $("#email-otp-send-btn").html('Resend OTP');
            $("#email-otp-sent-to").html('OTP send failed!');
        },
    });
}


$('#contactForm').on('submit', function(e) {
    e.preventDefault();
    let theForm = new FormData(this);
    let csrf = $('input[name=csrfmiddlewaretoken]').val();
    theForm.append('csrfmiddlewaretoken', csrf);
    other_contacts = []
    $('input[name="other_contacts"]').each(function (index, member) {
        var value = $(member).val();
        other_contacts.push(value);
    });
    theForm.append('other_contacts', other_contacts);
    $("#contactUpdateBtn").prop('disabled', true);
    $("#contactUpdateBtn").html('Please Wait...');
    $('#emailMessage').html(" ");
    $('#mobileMessage').html(" ");
    $.ajax(
    {
        type:'POST',
        url: $(this).attr('action'),
        data: theForm,
        contentType: false,
        processData: false,
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $("#contactUpdateBtn").prop('disabled', false);
            $("#contactUpdateBtn").html('Update Contact');
            $("#mobileMessage").html("");
            $("#mobileotpvalidation").html("");
            $("#emailMessage").html("");
            $("#emailotpvalidation").html("");
            if(response.emailExists)
            {
                document.getElementById('emailMessage').innerHTML = `<p>Data with this email already exists</p>`;
            }
            if(response.mobileExists){
                document.getElementById('mobileMessage').innerHTML = `<p>Data with this mobile number already exists</p>`;
            }
            if(response.invalidEmailOtp)
            {
                document.getElementById('emailotpvalidation').innerHTML = `Invalid OTP`;
            }
            if(response.invalidMobileOtp){
                document.getElementById('mobileotpvalidation').innerHTML = `Invalid OTP`;
            }
            if(response.emailExists == false && response.mobileExists == false && response.invalidEmailOtp == false && response.invalidMobileOtp == false)
            {
                showSingleButtonAlert("Success", "Contact has been updated", "Okay");
                clearInterval(interval1);
                clearInterval(interval2);
                let mobile = $("#edit-mobile").val()
                $("#edit-mobile").attr('data-value', mobile)
                let email = $("#edit-email").val()
                $("#edit-email").attr('data-value', email)
                $("#mobile-otp-send-btn").prop("disabled", false);
                $("#mobile-otp-send-btn").html("Send OTP");
                $("#mobile-otp-sent-to").html("");
                $("#email-otp-send-btn").html("Send OTP");
                $("#email-otp-sent-to").html("");
                $("#edit-mobile-otp").val("");
                $("#edit-email-otp").val("");
            }
        },
        error: function(response)
        {
            document.getElementById('contactUpdateBtn').disabled = false;
            $("#contactUpdateBtn").html('Update Contact');
            showSingleButtonAlert("Failed", "Failed to update contact", "Okay");
            
        },
    });
});


$('#generalEditForm').on('submit',function(e) {
    e.preventDefault();
    let theForm = new FormData(this);
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    $("#saveChangeBtn").html('Saving Changes....');
    $("#saveChangeBtn").prop("disabled", true)
    $.ajax({
        type:'POST',
        url: $(this).attr('action'),
        data: theForm,
        contentType: false,
        processData: false,
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $("#HospitalNameTitle").html(response.name.toUpperCase());
            $("#saveChangeBtn").html('Save Changes');
            showSingleButtonAlert("Success", "Save Changed Success", "Okay");
            $("#saveChangeBtn").prop("disabled", false)
        },
        error:function(response)
        {
            $("#saveChangeBtn").html('Save Changes');
            $("#saveChangeBtn").prop("disabled", false)
            showSingleButtonAlert("Failed", "Failed to Save Change", "Okay");
        }

    });
});



var addedRooms;
$(document).on('keyup', ".dropdown-input-search-room", function(event){
    updateDropdownResult({datalist:addedRooms, querySelector:this, value_key:'id', label_key:'Room'});
});
var addedUnits;
$(document).on('keyup', ".dropdown-input-search-unit", function(event){
    updateDropdownResult({datalist:addedUnits, querySelector:this, value_key:'id', label_key:'Unit'});
});
var addedBuildings;
$(document).on('keyup', ".dropdown-input-search-unit", function(event){
    updateDropdownResult({datalist:addedBuildings, querySelector:this, value_key:'id', label_key:'Building'});
});

function updateDropdownResult({datalist, querySelector, value_key, label_key}={})
{
    element = $(querySelector)
    var search = '';
    if(typeof(querySelector) == "object"){ // if querySelector = this
        search = element.val();
        parentElement = element.parent().parent().parent();
        childElements = parentElement.children();
        element = childElements.find(".dataLists")
    }
    
    element.html("");
    if(datalist.length > 0){
        datalist.sort(function(a,b){
            if ( a[label_key] < b[label_key] ){
                return -1;
            }
            if ( a[label_key] > b[label_key] ){
                return 1;
            }
            return 0;
        });
        if(search.length > 0)
        {
            for(k in datalist)
            {
                var room = datalist[k][label_key].toUpperCase();
                search = search.toUpperCase()
                if(room.includes(search))
                {
                    element.append(`<a class="dropdown-item" id="dropdown-item-${datalist[k][value_key]}" data-value="${datalist[k][value_key]}" data-text="${datalist[k][label_key]}"><p id="dropdown-item-text-${datalist[k][value_key]}">${datalist[k][label_key]}</p></a>`);
                }
            }
        }
        else
        {
            for(k in datalist)
            {
                element.append(`<a class="dropdown-item" id="dropdown-item-${datalist[k][value_key]}" data-value="${datalist[k][value_key]}" data-text="${datalist[k][label_key]}"><p id="dropdown-item-text-${datalist[k][value_key]}">${datalist[k][label_key]}</p></a>`);
            }
        }
    }
    else{
        element.html(`<p style="text-align:center"><b>No Item Found</b></p>`)
    }
}

function fetchBedInfo(){
    $.ajax({
        type: 'GET',
        url: "/fetch-beds-data/",
        data:{

        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            $(".totalBedCount").html(response.total_beds);
            $(".totalAvailableBedCount").html(response.available_beds);
        },
    }); 
}

function updateRoomRow(addedRooms){
    $(".room-select").html(`<option label='Select Room'></option>`);
    $(".room-select-all").html(`<option label='All Rooms'></option>`);
    if(addedRooms.length > 0){
        $(".no-room-added").remove();
        addedRooms.sort()
        $(".table-added-room-data").html("")
        for(i=0; i<addedRooms.length; i++){
            var html =
                `<tr class="addedRoom-table-row" id="addedRoom-table-row-${addedRooms[i].id}">
                    <td class="table-serial-no" align="center"></td>
                    <td>
                        <span id="span-td-room-${addedRooms[i].id}">${addedRooms[i].Room}</span>
                        <input type="text" inputmode="text" class="input-edit-room" id="input-edit-room-${addedRooms[i].id}" value="${addedRooms[i].Room}" style="display:none">
                    </td>
                    <td align="center">
                        <button type="button" class="btn btn-room-edit" data-id="${addedRooms[i].id}" id="btn-room-edit-${addedRooms[i].id}" data-placement="bottom" data-toggle="tooltip" title="Edit Room">
                            <i class="fa-solid fa-pen-to-square text-primary" id="btn-room-edit-icon-${addedRooms[i].id}"></i>
                        </button>
                        <button type="button" class="btn btn-room-remove" data-id="${addedRooms[i].id}" id="btn-room-remove-${addedRooms[i].id}" data-placement="bottom" data-toggle="tooltip" title="Remove Room">
                            <i class="fa-solid fa-trash text-danger" id="btn-room-remove-icon-${addedRooms[i].id}"></i>
                        </button>
                    </td>
                </tr>`
            $(".table-added-room-data").append(html);
            $(".room-select").append(`<option value="${addedRooms[i].id}">${addedRooms[i].Room}</option>`)
            $(".room-select-all").append(`<option value="${addedRooms[i].id}">${addedRooms[i].Room}</option>`)
        }
    }
    else{
        html = `<tr class="no-room-added"> 
            <td colspan='100%' align='center' style='text-align:center'><h4 class='text-muted'>No Room Found</h4></td> 
        </tr>`
        $(".table-added-room-data").html(html);
    }
}
function updateUnitRow(addedUnits){
    $(".unit-select").html(`<option label='Select Unit'></option>`);
    $(".unit-select-all").html(`<option label='All Units'></option>`);
    if(addedUnits.length > 0){
        $(".no-unit-added").remove();
        addedUnits.sort()
        $(".table-added-unit-data").html("")
        for(i=0; i<addedUnits.length; i++){
            var html =
                `<tr class="addedUnit-table-row" id="addedUnit-table-row-${addedUnits[i].id}">
                    <td class="table-serial-no" align="center"></td>
                    <td>
                        <span id="span-td-unit-${addedUnits[i].id}">${addedUnits[i].Unit}</span>
                        <input type="text" inputmode="text" class="input-edit-unit" id="input-edit-unit-${addedUnits[i].id}" value="${addedUnits[i].Unit}" style="display:none">
                    </td>
                    <td align="center">
                        <button type="button" class="btn btn-unit-edit" data-id="${addedUnits[i].id}" id="btn-unit-edit-${addedUnits[i].id}" data-placement="bottom" data-toggle="tooltip" title="Edit Unit">
                            <i class="fa-solid fa-pen-to-square text-primary" id="btn-unit-edit-icon-${addedUnits[i].id}"></i>
                        </button>
                        <button type="button" class="btn btn-unit-remove" data-id="${addedUnits[i].id}" id="btn-unit-remove-${addedUnits[i].id}" data-placement="bottom" data-toggle="tooltip" title="Remove Unit">
                            <i class="fa-solid fa-trash text-danger" id="btn-unit-remove-icon-${addedUnits[i].id}"></i>
                        </button>
                    </td>
                </tr>`
            $(".table-added-unit-data").append(html);
            $(".unit-select").append(`<option value="${addedUnits[i].id}">${addedUnits[i].Unit}</option>`)
            $(".unit-select-all").append(`<option value="${addedUnits[i].id}">${addedUnits[i].Unit}</option>`)
        }
    }
    else{
        html = `<tr class="no-unit-added"> 
            <td colspan='100%' align='center' style='text-align:center'><h4 class='text-muted'>No Unit Found</h4></td> 
        </tr>`
        $(".table-added-unit-data").html(html);
    }
}
function updateBuildingRow(addedBuildings){
    $(".building-select").html(`<option label="Select Building"></option>`)
    $(".building-select-all").html(`<option label='All Buildings'></option>`);
    if(addedBuildings.length > 0){
        $(".no-building-added").remove();
        addedBuildings.sort()
        $(".table-added-building-data").html("")
        for(i=0; i<addedBuildings.length; i++){
            var html =
                `<tr class="addedBuilding-table-row" id="addedBuilding-table-row-${addedBuildings[i].id}">
                    <td class="table-serial-no" align="center"></td>
                    <td>
                        <span id="span-td-building-${addedBuildings[i].id}">${addedBuildings[i].Building}</span>
                        <input type="text" inputmode="text" class="input-edit-building" id="input-edit-building-${addedBuildings[i].id}" value="${addedBuildings[i].Building}" style="display:none">
                    </td>
                    <td align="center">
                        <button type="button" class="btn btn-building-edit" data-id="${addedBuildings[i].id}" id="btn-building-edit-${addedBuildings[i].id}" data-placement="bottom" data-toggle="tooltip" title="Edit Building">
                            <i class="fa-solid fa-pen-to-square text-primary" id="btn-building-edit-icon-${addedBuildings[i].id}"></i>
                        </button>
                        <button type="button" class="btn btn-building-remove" data-id="${addedBuildings[i].id}" id="btn-building-remove-${addedBuildings[i].id}" data-placement="bottom" data-toggle="tooltip" title="Remove Building">
                            <i class="fa-solid fa-trash text-danger" id="btn-building-remove-icon-${addedBuildings[i].id}"></i>
                        </button>
                    </td>
                </tr>`
            $(".table-added-building-data").append(html);
            $(".building-select").append(`<option value="${addedBuildings[i].id}">${addedBuildings[i].Building}</option>`)
            $(".building-select-all").append(`<option value="${addedBuildings[i].id}">${addedBuildings[i].Building}</option>`)
        }
    }
    else{
        html = `<tr class="no-building-added"> 
            <td colspan='100%' align='center' style='text-align:center'><h4 class='text-muted'>No Building Found</h4></td> 
        </tr>`
        $(".table-added-building-data").html(html);
    }
}

function fetchAllRoom(){
    let hospitalId = $("#id_hospital").val();
    $.ajax(
    {
        url: "/get-rooms-by-hospital/",
        data:{
            'hospitalId':hospitalId,
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            $(".table-added-room-data").html("");
            addedRooms = response.rooms;
            updateRoomRow(addedRooms)
            updateDropdownResult({datalist:addedRooms, querySelector:'.selectRoom-dropdown-dataLists', value_key:'id', label_key:'Room'});
        }
    })
}
function fetchAllUnit(){
    let hospitalId = $("#id_hospital").val();
    $.ajax(
    {
        url: "/get-units-by-hospital/",
        data:{
            'hospitalId':hospitalId,
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            $(".table-added-unit-data").html("");
            addedUnits = response.units;
            updateUnitRow(addedUnits)
            updateDropdownResult({datalist:addedUnits, querySelector:'.selectUnit-dropdown-dataLists', value_key:'id', label_key:'Unit'});
        }
    })
}
function fetchAllBuilding(){
    let hospitalId = $("#id_hospital").val();
    $.ajax(
    {
        url: "/get-buildings-by-hospital/",
        data:{
            'hospitalId':hospitalId,
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            $(".table-added-building-data").html("");
            addedBuildings = response.buildings;
            updateBuildingRow(addedBuildings)
            updateDropdownResult({datalist:addedBuildings, querySelector:'.selectBuilding-dropdown-dataLists', value_key:'id', label_key:'Building'});
        }
    })
}

$("[data-target='#site-content-add-bed']").on('click', function(event){
    fetchBedInfo()
    fetchAllRoom()
    fetchAllUnit()
    fetchAllBuilding()
});
$("[data-target='#site-content-remove-bed']").on('click', function(event){
    fetchBedInfo()
    fetchAllRoom()
    fetchAllUnit()
    fetchAllBuilding()
});
$("[data-target='#site-content-admit-patient']").on('click', function(event){
    fetchAllRoom()
    fetchAllUnit()
    fetchAllBuilding()
});
$("[data-target='#site-content-update-status']").on('click', function(event){
    fetchAllRoom()
    fetchAllUnit()
    fetchAllBuilding()
});

$("#addRomModal").on('hide.bs.modal', function(){
    $("#add-room-message").html(""); 
    $("#add_room_form").trigger('reset');
});
$("#add_room_form input").on('keyup', function(){
    $("#add-room-message").html(""); 
});
$("#add_room_form").on('reset', function(){
    $("#add-room-message").html('');
});
$("#add_room_form").on('submit', function(event){
    event.preventDefault();
    $("#add-room-message").html("");
    let hospitalId = $("#id_hospital").val();
    $("#add-room-form-submit-button").prop('disabled', true);
    $("#add-room-form-submit-button").html("Adding...");
    $.ajax(
    {
        url: $(this).attr("action"),
        type: 'POST',
        data:{
            hospitalId: hospitalId,
            room: $("#add_room").val(),
            emailOTP: $("#email_verification-otp").val(),
            mobileOTP: $("#mobile_verification-otp").val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            $(".no-room-added").remove();
            $("#add-room-form-submit-button").html("Add");
            $("#add-room-form-submit-button").prop('disabled', false);
            if(response.exists){
                $("#add-room-message").html(`<span class="text-danger">This room already added.</span>`);
            }
            else{
                responseRoom = response.room;
                responseRoom = JSON.parse(responseRoom)[0];
                addedRoom = [{
                    id: responseRoom.pk,
                    Room: responseRoom['fields']['Room']
                }];
                $("#add_room_form").trigger('reset');
                $("#add-room-message").html(`<span class="text-success"><b>New Room Added</b></span>`);
                addedRooms = addedRooms.concat(addedRoom[0]);
                updateRoomRow(addedRooms)
                updateDropdownResult({datalist:addedRooms, querySelector:'.selectRoom-dropdown-dataLists', value_key:'id', label_key:'Room'});
            }
        },
        error: function(response){
            $("#add-room-form-submit-button").html("Add");
            $("#add-room-form-submit-button").prop('disabled', false);
            $("#add-room-message").html(`<span class="text-danger">Error Occurred! Try again.</span>`);
        }
    });
});

$(".table-added-room-data").on('click', ".btn-room-edit", function(){
    $(this).tooltip('dispose')
    let data_id = $(this).attr('data-id');
    let hospitalId = $("#id_hospital").val();
    let editInput = $(`#input-edit-room-${data_id}`);
    if(editInput.css('display') == 'none'){
        editInput.css('display', 'block');
        $(`#span-td-room-${data_id}`).css('display', 'none');
        $(`#btn-room-edit-icon-${data_id}`).removeClass("fa-solid fa-pen-to-square");
        $(`#btn-room-edit-icon-${data_id}`).addClass("fa-solid fa-check");
    }
    else{
        $(`#btn-room-edit-icon-${data_id}`).removeClass("fa-solid fa-check");
        $(`#btn-room-edit-icon-${data_id}`).addClass("fa-light fa-spinner-third fa-spin");
        roomName = editInput.val();
        $.ajax(
        {
            url: "/edit-room/",
            type: 'POST',
            data:{
                hospitalId: hospitalId,
                roomId: data_id,
                roomName: roomName,
                emailOTP: $("#email_verification-otp").val(),
                mobileOTP: $("#mobile_verification-otp").val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                $(`#btn-room-edit-icon-${data_id}`).removeClass("fa-light fa-spinner-third fa-spin");
                $(`#btn-room-edit-icon-${data_id}`).addClass("fa-solid fa-pen-to-square");
                if(response.success){
                    $(`#span-td-room-${data_id}`).css('display', 'block');
                    editInput.css('display', 'none');
                    $(`#span-td-room-${data_id}`).html(roomName);
                    for(item in addedRooms){
                        if(addedRooms[item]['id'] == data_id){
                            addedRooms[item]['Room'] = roomName
                        }
                    }
                    updateDropdownResult({datalist:addedRooms, querySelector:'.selectRoom-dropdown-dataLists', value_key:'id', label_key:'Room'});
                }
                else if(response.exists){
                    alert('Room with the name already exists!');
                }
                else{
                    alert('Failed to edit room.\nTry Again!');
                }
            },
            error: function(){
                $(`#btn-room-edit-icon-${data_id}`).removeClass("fa-light fa-spinner-third fa-spin");
                $(`#btn-room-edit-icon-${data_id}`).addClass("fa-solid fa-check");
                alert('Failed to edit room.\nTry Again!');
            }
        });
    }
});

$(".table-added-room-data").on('click', ".btn-room-remove", function(){
    $(this).tooltip('dispose')
    let data_id = $(this).attr('data-id');
    let hospitalId = $("#id_hospital").val();
    $(this).prop('disabled', true);
    $(`#btn-room-remove-icon-${data_id}`).removeClass("fa-solid fa-trash");
    $(`#btn-room-remove-icon-${data_id}`).addClass("fa-light fa-spinner-third fa-spin");
    $.ajax({
        url: "/delete-room/",
        type: 'POST',
        data:{
            hospitalId: hospitalId,
            roomId: data_id,
            emailOTP: $("#email_verification-otp").val(),
            mobileOTP: $("#mobile_verification-otp").val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            $(`#btn-room-remove-icon-${data_id}`).addClass("fa-solid fa-trash");
            $(`#btn-room-remove-icon-${data_id}`).removeClass("fa-light fa-spinner-third fa-spin");
            if(response.success){
                for(i=0; i < addedRooms.length; i++){
                    if(addedRooms[i]['id'] == data_id){
                        addedRooms.splice(i);
                    }
                }
                $(`#addedRoom-table-row-${data_id}`).remove();
                $(`#dropdown-item-${data_id}`).remove();
                if(response.totalRoom <= 0){
                    html = `<tr class="no-room-added"> 
                        <td colspan='100%' align='center' style='text-align:center'><h4 class='text-muted'>No Room Found</h4></td> 
                    </tr>`
                    $(".table-added-room-data").html(html);
                }
            }
            else{
                $(`#btn-room-remove-${data_id}`).prop('disabled', false);
                alert('Failed to remove room.\nTry Again!');
            }
        },
        error: function(){
            $(`#btn-room-remove-icon-${data_id}`).addClass("fa-solid fa-trash");
            $(`#btn-room-remove-icon-${data_id}`).removeClass("fa-light fa-spinner-third fa-spin");
            $(`#btn-room-remove-${data_id}`).prop('disabled', false);
            alert('Failed to remove room.\nTry Again!');
        }
    });
});


$("#addUnitModal").on('hide.bs.modal', function(){
    $("#add-unit-message").html(""); 
    $("#add_unit_form").trigger('reset');
});
$("#add_unit_form input").on('keyup', function(){
    $("#add-unit-message").html(""); 
});
$("#add_unit_form").on('reset', function(){
    $("#add-unit-message").html('');
});
$("#add_unit_form").on('submit', function(event){
    event.preventDefault();
    $("#add-unit-message").html("");
    let hospitalId = $("#id_hospital").val();
    $("#add-unit-form-submit-button").prop('disabled', true);
    $("#add-unit-form-submit-button").html("Adding...");
    $.ajax(
    {
        url: $(this).attr("action"),
        type: 'POST',
        data:{
            hospitalId: hospitalId,
            unit: $("#add_unit").val(),
            emailOTP: $("#email_verification-otp").val(),
            mobileOTP: $("#mobile_verification-otp").val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            $(".no-unit-added").remove();
            $("#add-unit-form-submit-button").html("Add");
            $("#add-unit-form-submit-button").prop('disabled', false);
            if(response.exists){
                $("#add-unit-message").html(`<span class="text-danger">This unit already added.</span>`);
            }
            else{
                responseUnit = response.unit;
                responseUnit = JSON.parse(responseUnit)[0];
                addedUnit = [{
                    id: responseUnit.pk,
                    Unit: responseUnit['fields']['Unit']
                }];
                $("#add_unit_form").trigger('reset');
                $("#add-unit-message").html(`<span class="text-success"><b>New Unit Added</b></span>`);
                addedUnits = addedUnits.concat(addedUnit[0]);
                updateUnitRow(addedUnits)
                updateDropdownResult({datalist:addedUnits, querySelector:'.selectUnit-dropdown-dataLists', value_key:'id', label_key:'Unit'});
            }
        },
        error: function(response){
            $("#add-unit-form-submit-button").html("Add");
            $("#add-unit-form-submit-button").prop('disabled', false);
            $("#add-unit-message").html(`<span class="text-danger">Error Occurred! Try again.</span>`);
        }
    });
});

$(".table-added-unit-data").on('click', ".btn-unit-edit", function(){
    $(this).tooltip('dispose')
    let data_id = $(this).attr('data-id');
    let hospitalId = $("#id_hospital").val();
    let editInput = $(`#input-edit-unit-${data_id}`);
    if(editInput.css('display') == 'none'){
        editInput.css('display', 'block');
        $(`#span-td-unit-${data_id}`).css('display', 'none');
        $(`#btn-unit-edit-icon-${data_id}`).removeClass("fa-solid fa-pen-to-square");
        $(`#btn-unit-edit-icon-${data_id}`).addClass("fa-solid fa-check");
    }
    else{
        $(`#btn-unit-edit-icon-${data_id}`).removeClass("fa-solid fa-check");
        $(`#btn-unit-edit-icon-${data_id}`).addClass("fa-light fa-spinner-third fa-spin");
        unitName = editInput.val();
        $.ajax(
        {
            url: "/edit-unit/",
            type: 'POST',
            data:{
                hospitalId: hospitalId,
                unitId: data_id,
                unitName: unitName,
                emailOTP: $("#email_verification-otp").val(),
                mobileOTP: $("#mobile_verification-otp").val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                $(`#btn-unit-edit-icon-${data_id}`).removeClass("fa-light fa-spinner-third fa-spin");
                $(`#btn-unit-edit-icon-${data_id}`).addClass("fa-solid fa-pen-to-square");
                if(response.success){
                    $(`#span-td-unit-${data_id}`).css('display', 'block');
                    editInput.css('display', 'none');
                    $(`#span-td-unit-${data_id}`).html(unitName);
                    for(item in addedUnits){
                        if(addedUnits[item]['id'] == data_id){
                            addedUnits[item]['Unit'] = unitName
                        }
                    }
                    updateDropdownResult({datalist:addedUnits, querySelector:'.selectUnit-dropdown-dataLists', value_key:'id', label_key:'Unit'});
                }
                else if(response.exists){
                    alert('Unit with the name already exists!');
                }
                else{
                    alert('Failed to edit unit.\nTry Again!');
                }
            },
            error: function(){
                $(`#btn-unit-edit-icon-${data_id}`).removeClass("fa-light fa-spinner-third fa-spin");
                $(`#btn-unit-edit-icon-${data_id}`).addClass("fa-solid fa-check");
                alert('Failed to edit unit.\nTry Again!');
            }
        });
    }
});

$(".table-added-unit-data").on('click', ".btn-unit-remove", function(){
    $(this).tooltip('dispose')
    let data_id = $(this).attr('data-id');
    let hospitalId = $("#id_hospital").val();
    $(this).prop('disabled', true);
    $(`#btn-unit-remove-icon-${data_id}`).removeClass("fa-solid fa-trash");
    $(`#btn-unit-remove-icon-${data_id}`).addClass("fa-light fa-spinner-third fa-spin");
    $.ajax({
        url: "/delete-unit/",
        type: 'POST',
        data:{
            hospitalId: hospitalId,
            unitId: data_id,
            emailOTP: $("#email_verification-otp").val(),
            mobileOTP: $("#mobile_verification-otp").val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            $(`#btn-unit-remove-icon-${data_id}`).addClass("fa-solid fa-trash");
            $(`#btn-unit-remove-icon-${data_id}`).removeClass("fa-light fa-spinner-third fa-spin");
            if(response.success){
                for(i=0; i < addedUnits.length; i++){
                    if(addedUnits[i]['id'] == data_id){
                        addedUnits.splice(i);
                    }
                }
                $(`#addedUnit-table-row-${data_id}`).remove();
                $(`#dropdown-item-${data_id}`).remove();
                if(response.totalUnit <= 0){
                    html = `<tr class="no-unit-added"> 
                                <td colspan='100%' align='center' style='text-align:center'><h4 class='text-muted'>No Unit Found</h4></td> 
                            </tr>`
                    $(".table-added-unit-data").html(html);
                }
            }
            else{
                $(`#btn-unit-remove-${data_id}`).prop('disabled', false);
                alert('Failed to remove unit.\nTry Again!');
            }
        },
        error: function(){
            $(`#btn-unit-remove-icon-${data_id}`).addClass("fa-solid fa-trash");
            $(`#btn-unit-remove-icon-${data_id}`).removeClass("fa-light fa-spinner-third fa-spin");
            $(`#btn-unit-remove-${data_id}`).prop('disabled', false);
            alert('Failed to remove unit.\nTry Again!');
        }
    });
});


$("#addBuildingModal").on('hide.bs.modal', function(){
    $("#add-building-message").html(""); 
    $("#add_building_form").trigger('reset');
});
$("#add_building_form input").on('keyup', function(){
    $("#add-building-message").html(""); 
});
$("#add_building_form").on('reset', function(){
    $("#add-building-message").html('');
});
$("#add_building_form").on('submit', function(event){
    event.preventDefault();
    $("#add-building-message").html("");
    let hospitalId = $("#id_hospital").val();
    $("#add-building-form-submit-button").prop('disabled', true);
    $("#add-building-form-submit-button").html("Adding...");
    $.ajax(
    {
        url: $(this).attr("action"),
        type: 'POST',
        data:{
            hospitalId: hospitalId,
            building: $("#add_building").val(),
            emailOTP: $("#email_verification-otp").val(),
            mobileOTP: $("#mobile_verification-otp").val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            $(".no-building-added").remove();
            $("#add-building-form-submit-button").html("Add");
            $("#add-building-form-submit-button").prop('disabled', false);
            if(response.exists){
                $("#add-building-message").html(`<span class="text-danger">This building already added.</span>`);
            }
            else{
                responseBuilding = response.building;
                responseBuilding = JSON.parse(responseBuilding)[0];
                addedBuilding = [{
                    id: responseBuilding.pk,
                    Building: responseBuilding['fields']['Building']
                }];
                $("#add_building_form").trigger('reset');
                $("#add-building-message").html(`<span class="text-success"><b>New Building Added</b></span>`);
                addedBuildings = addedBuildings.concat(addedBuilding[0]);
                updateBuildingRow(addedBuildings)
                updateDropdownResult({datalist:addedBuildings, querySelector:'.selectBuilding-dropdown-dataLists', value_key:'id', label_key:'Building'});
            }
        },
        error: function(response){
            $("#add-unit-form-submit-button").html("Add");
            $("#add-unit-form-submit-button").prop('disabled', false);
            $("#add-unit-message").html(`<span class="text-danger">Error Occurred! Try again.</span>`);
        }
    });
});

$(".table-added-building-data").on('click', ".btn-building-edit", function(){
    $(this).tooltip('dispose')
    let data_id = $(this).attr('data-id');
    let hospitalId = $("#id_hospital").val();
    let editInput = $(`#input-edit-building-${data_id}`);
    if(editInput.css('display') == 'none'){
        editInput.css('display', 'block');
        $(`#span-td-building-${data_id}`).css('display', 'none');
        $(`#btn-building-edit-icon-${data_id}`).removeClass("fa-solid fa-pen-to-square");
        $(`#btn-building-edit-icon-${data_id}`).addClass("fa-solid fa-check");
    }
    else{
        $(`#btn-building-edit-icon-${data_id}`).removeClass("fa-solid fa-check");
        $(`#btn-building-edit-icon-${data_id}`).addClass("fa-light fa-spinner-third fa-spin");
        buildingName = editInput.val();
        $.ajax(
        {
            url: "/edit-building/",
            type: 'POST',
            data:{
                hospitalId: hospitalId,
                buildingId: data_id,
                buildingName: buildingName,
                emailOTP: $("#email_verification-otp").val(),
                mobileOTP: $("#mobile_verification-otp").val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                $(`#btn-building-edit-icon-${data_id}`).removeClass("fa-light fa-spinner-third fa-spin");
                $(`#btn-building-edit-icon-${data_id}`).addClass("fa-solid fa-pen-to-square");
                if(response.success){
                    $(`#span-td-building-${data_id}`).css('display', 'block');
                    editInput.css('display', 'none');
                    $(`#span-td-building-${data_id}`).html(buildingName);
                    for(item in addedBuildings){
                        if(addedBuildings[item]['id'] == data_id){
                            addedBuildings[item]['Building'] = buildingName
                        }
                    }
                    updateDropdownResult({datalist:addedBuildings, querySelector:'.selectBuilding-dropdown-dataLists', value_key:'id', label_key:'Building'});
                }
                else if(response.exists){
                    alert('Building with the name already exists!');
                }
                else{
                    alert('Failed to edit building.\nTry Again!');
                }
            },
            error: function(){
                $(`#btn-building-edit-icon-${data_id}`).removeClass("fa-light fa-spinner-third fa-spin");
                $(`#btn-building-edit-icon-${data_id}`).addClass("fa-solid fa-check");
                alert('Failed to edit building.\nTry Again!');
            }
        });
    }
});

$(".table-added-building-data").on('click', ".btn-building-remove", function(){
    $(this).tooltip('dispose')
    let data_id = $(this).attr('data-id');
    let hospitalId = $("#id_hospital").val();
    $(this).prop('disabled', true);
    $(`#btn-building-remove-icon-${data_id}`).removeClass("fa-solid fa-trash");
    $(`#btn-building-remove-icon-${data_id}`).addClass("fa-light fa-spinner-third fa-spin");
    $.ajax({
        url: "/delete-building/",
        type: 'POST',
        data:{
            hospitalId: hospitalId,
            buildingId: data_id,
            emailOTP: $("#email_verification-otp").val(),
            mobileOTP: $("#mobile_verification-otp").val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            $(`#btn-building-remove-icon-${data_id}`).addClass("fa-solid fa-trash");
            $(`#btn-building-remove-icon-${data_id}`).removeClass("fa-light fa-spinner-third fa-spin");
            if(response.success){
                for(i=0; i < addedBuildings.length; i++){
                    if(addedBuildings[i]['id'] == data_id){
                        addedBuildings.splice(i);
                    }
                }
                $(`#addedBuilding-table-row-${data_id}`).remove();
                $(`#dropdown-item-${data_id}`).remove();
                if(response.totalBuilding <= 0){
                    html = `<tr class="no-building-added"> 
                                <td colspan='100%' align='center' style='text-align:center'><h4 class='text-muted'>No Building Found</h4></td> 
                            </tr>`
                    $(".table-added-building-data").html(html);
                }
            }
            else{
                $(`#btn-building-remove-${data_id}`).prop('disabled', false);
                alert('Failed to remove building.\nTry Again!');
            }
        },
        error: function(){
            $(`#btn-building-remove-icon-${data_id}`).addClass("fa-solid fa-trash");
            $(`#btn-building-remove-icon-${data_id}`).removeClass("fa-light fa-spinner-third fa-spin");
            $(`#btn-building-remove-${data_id}`).prop('disabled', false);
            alert('Failed to remove building.\nTry Again!');
        }
    });
});



$("#addBedForm").on('reset', function(){
    $("#requirement").html('<option label="Select Support"></option>');
    $("#addbedmeesage").html("");
});
$('#addBedForm').on('submit', function(event){
    event.preventDefault();
    let theForm = new FormData(this);
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    document.getElementById("addbedmeesage").innerHTML = ""
    document.getElementById('addBadSubmit').disabled = true;
    document.getElementById('addBadSubmit').innerHTML = 'Adding';
    $.ajax(
    {
        type:'POST',
        url: $(this).attr('action'),
        data: theForm,
        contentType: false,
        processData: false,
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            document.getElementById('addBadSubmit').disabled = false;
            document.getElementById('addBadSubmit').innerHTML = 'Add'
            if(response.success)
            {
                document.getElementById("addbedmeesage").innerHTML = "<b style='color:green'>New Bed Added</b>"
                $(".totalBedCount").html(response.total_beds);
                $(".totalAvailableBedCount").html(response.available_beds);
                createdBed = response.createdBed[0]
                $("#recentAddedBedsLoading").remove()
                var html =
                    `<tr class="recent-added-beds-table-row" id="recent-added-beds-table-row-${createdBed.id}">
                        <td>${createdBed.Department__department}</td>
                        <td>${createdBed.Bed_No}</td>
                        <td>${displayNotNullData(createdBed.Room__Room)}</td>
                        <td>${displayNotNullData(createdBed.Unit__Unit)}</td>
                        <td>${displayNotNullData(createdBed.Building__Building)}</td>
                        <td>${createdBed.Floor}</td>
                        <td>${createdBed.Ward}</td>
                        <td>${createdBed.Support}</td>
                        <td>${formatDateTime(createdBed.added_at)}</td>
                        <td>${formatDateTime(createdBed.Last_Update)}</td>
                    </tr>`
                    $("#recent-beds-table-body").prepend(html);
            }
            else if(response.exists)
            {
                document.getElementById("addbedmeesage").innerHTML = "<b style='color:red'>Data Already Exists!</b>"
            }
        },
        error: function(response)
        {
            document.getElementById('addBadSubmit').disabled = false;
            document.getElementById('addBadSubmit').innerHTML = 'Add'
            document.getElementById("addbedmeesage").innerHTML = "<b style='color:red'>Failed to Add New Bed!</b>"
        },
    });
});

function fetchRecentAddedBeds(){
    l = `<tr id='recentAddedBedsLoading'> 
            <td colspan='100%' align='center' style='text-align:center'><h4 class='text-muted'>Loading....</h4></td> 
        </tr>`
    $("#recent-beds-table-body").html(l)
    $.ajax(
    {
        url: '/recent-added-beds/',
        data: {
            'hospital': $("#id_hospital").val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $("#recent-beds-table-body").html('')
            recentAddeBeds = response.recentAddeBeds
            if(recentAddeBeds.length > 0){
                for(i=0; i<recentAddeBeds.length; i++){
                    var html =
                    `<tr class="recent-added-beds-table-row" id="recent-added-beds-table-row-${recentAddeBeds[i].id}">
                        <td>${recentAddeBeds[i].Department__department}</td>
                        <td>${recentAddeBeds[i].Bed_No}</td>
                        <td>${displayNotNullData(recentAddeBeds[i].Room__Room)}</td>
                        <td>${displayNotNullData(recentAddeBeds[i].Unit__Unit)}</td>
                        <td>${displayNotNullData(recentAddeBeds[i].Building__Building)}</td>
                        <td>${recentAddeBeds[i].Floor}</td>
                        <td>${recentAddeBeds[i].Ward}</td>
                        <td>${recentAddeBeds[i].Support}</td>
                        <td>${formatDateTime(recentAddeBeds[i].added_at)}</td>
                        <td>${formatDateTime(recentAddeBeds[i].Last_Update)}</td>
                    </tr>`
                    $("#recent-beds-table-body").append(html);
                }
            }
            else{
                l = `<tr id='recentAddedBedsLoading'> 
                            <td colspan='100%' align='center' style='text-align:center'><h5 class='text-muted'>No Bed Added Recently</h5></td> 
                        </tr>`
                    $("#recent-beds-table-body").html(l)
            }
        }
    });
}
$("[data-target='#site-content-add-bed']").on('click', function(){
    fetchRecentAddedBeds()
});


$('#removeBedForm').on('submit', function(event){
    event.preventDefault();
    let theForm = new FormData(this);
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    document.getElementById("removebedmeesage").innerHTML = "";
    document.getElementById('removeBadSubmit').disabled = true;
    document.getElementById('removeBadSubmit').innerHTML = "Wait";
    $.ajax(
    {
        type:'POST',
        url: $(this).attr('action'),
        data: theForm,
        contentType: false,
        processData: false,
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            document.getElementById('removeBadSubmit').disabled = false;
            document.getElementById('removeBadSubmit').innerHTML = 'Remove'
            if(response.error == "0")
            {
                document.getElementById("removebedmeesage").innerHTML = "<b style='color:orange'>Bed Remove Request sent to Administrator.<br>Administrator will verify it.</b>"
                removeRequest = response.removeRequest[0]
                if(removeRequest.Status != 'Pending'){
                    status_change_at = formatDateTime(removeRequest.status_change_at)
                }
                else{
                    status_change_at = ""
                }
                var html =
                `<tr class="bed-remove-request-table-row" id="bed-remove-request-table-row-${removeRequest.id}">
                    <td>${removeRequest.Bed__Department__department}</td>
                    <td>${removeRequest.Bed__Bed_No}</td>
                    <td>${displayNotNullData(removeRequest.Bed__Room__Room)}</td>
                    <td>${displayNotNullData(removeRequest.Bed__Unit__Unit)}</td>
                    <td>${displayNotNullData(removeRequest.Bed__Building__Building)}</td>
                    <td>${removeRequest.Bed__Floor}</td>
                    <td>${removeRequest.Bed__Ward}</td>
                    <td>${removeRequest.Bed__Support}</td>
                    <td>${formatDateTime(removeRequest.requested_at)}</td>
                    <td>${removeRequest.Status}</td>
                    <td>${status_change_at}</td>
                    <td class="right-column-sticky">${enableRequestUndoBtn(removeRequest)}</td>
                </tr>`
                $("#bedRemoveRequestsLoading").remove()
                $("#bed-remove-requests-table-body").prepend(html);
            }
            else if(response.error == "noexists")
            {
                document.getElementById("removebedmeesage").innerHTML = "<b style='color:red'>Data Doesn't Exists!</b>"
            }
            else if(response.error == 'used')
            {
                document.getElementById("removebedmeesage").innerHTML = "<b style='color:red'>You can't remove this bed!<br>A patient is admit in the bed.</b>"
            }
            else if(response.error == "already requested"){
                document.getElementById("removebedmeesage").innerHTML = "<b style='color:red'>Bed Remove request for the bed already initiated.</b>"
            }
            
        },
        error: function(response)
        {
            document.getElementById('removeBadSubmit').disabled = false;
            document.getElementById('removeBadSubmit').innerHTML = 'Remove'
            document.getElementById("removebedmeesage").innerHTML = "<b style='color:red'>Failed to Remove Bed!</b>"
            
        },
    });
});

$(document).on('click', '.btn-request-undo', function(){
    data_id = $(this).attr('data-id')
    $(this).prop('disabled', true)
    console.log($('input[name=csrfmiddlewaretoken]').val())
    $.ajax(
    {
        type:'POST',
        url: '/undo-bed-remove-requests/',
        data: {
            id: data_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            if(response.success){
                $(`#bed-remove-request-table-row-${data_id}`).remove()
                if(response.totalRequests <= 0){
                    l = `<tr id='bedRemoveRequestsLoading'> 
                            <td colspan='100%' align='center' style='text-align:center'><h5 class='text-muted'>No Request Initiated</h5></td> 
                        </tr>`
                    $("#bed-remove-requests-table-body").html(l)
                }
            }
        }
    });
    $(this).prop('disabled', false)
})

function enableRequestUndoBtn(requestData){
    if(requestData.Status == 'Pending'){
        h = `<button type="button" class="btn btn-request-undo text-primary" style="background:none; border:none; outline:none" data-id="${requestData.id}">Undo</button>`
        return h
    }
    else{
        return ""
    }
}

function fetchBedRemoveRequests(){
    l = `<tr id='bedRemoveRequestsLoading'> 
            <td colspan='100%' align='center' style='text-align:center'><h4 class='text-muted'>Loading....</h4></td> 
        </tr>`
    $("#bed-remove-requests-table-body").html(l)
    $.ajax(
    {
        url: '/all-bed-remove-requests/',
        data: {
            'hospital': $("#id_hospital").val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $("#bed-remove-requests-table-body").html('')
            removeRequests = response.removeRequests
            if(removeRequests.length > 0){
                for(i=0; i<removeRequests.length; i++){
                    if(removeRequests[i].Status != 'Pending'){
                        status_change_at = formatDateTime(removeRequests[i].status_change_at)
                    }
                    else{
                        status_change_at = ""
                    }
                    var html =
                    `<tr class="bed-remove-request-table-row" id="bed-remove-request-table-row-${removeRequests[i].id}">
                        <td>${removeRequests[i].Bed__Department__department}</td>
                        <td>${removeRequests[i].Bed__Bed_No}</td>
                        <td>${displayNotNullData(removeRequests[i].Bed__Room__Room)}</td>
                        <td>${displayNotNullData(removeRequests[i].Bed__Unit__Unit)}</td>
                        <td>${displayNotNullData(removeRequests[i].Bed__Building__Building)}</td>
                        <td>${removeRequests[i].Bed__Floor}</td>
                        <td>${removeRequests[i].Bed__Ward}</td>
                        <td>${removeRequests[i].Bed__Support}</td>
                        <td>${formatDateTime(removeRequests[i].requested_at)}</td>
                        <td>${removeRequests[i].Status}</td>
                        <td>${status_change_at}</td>
                        <td class="right-column-sticky">${enableRequestUndoBtn(removeRequests[i])}</td>
                    </tr>`
                    $("#bed-remove-requests-table-body").append(html);
                }
            }
            else{
                l = `<tr id='bedRemoveRequestsLoading'> 
                            <td colspan='100%' align='center' style='text-align:center'><h5 class='text-muted'>No Request Initiated</h5></td> 
                        </tr>`
                    $("#bed-remove-requests-table-body").html(l)
            }
        }
    });
}
$("[data-target='#site-content-remove-bed']").on('click', function(){
    fetchBedRemoveRequests()
});


$(document).on('click', '.add-remove-button', function(){
    let target = $(this).attr('data-target')
    $(target).modal('show')
})


window.onbeforeunload = function(e) {
    return "You text is not saved!";
}