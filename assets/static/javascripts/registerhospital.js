function onLoadOtpVerification(){
    otpVerifyModal = document.getElementById("otpVerifyModal")
    if(otpVerifyModal != null){
        $("#otpVerifyModal").modal('show');
        emailOtpSendUserVerification();
        mobileOtpSendUserVerification();
    }
}
$(document).ready(function(){
    onLoadOtpVerification();
});

var interval01;
function timer01(t1)
{
    interval01 = setInterval(function(){
        sendButton = document.getElementById("btn-email_verification-sendotp")
        if(sendButton == null || sendButton == undefined){
            clearInterval(interval01);
        }
        else if(t1 <= 0)
        {
            sendButton.disabled = false;
            sendButton.innerHTML = "Resend OTP";
            clearInterval(interval01);
            return 0;
        }
        else if(t1 > 0)
        {
            sendButton.disabled = true;
            sendButton.innerHTML = `Resend OTP in ${t1}s`
            t1 = t1 - 1;
        }
    }, 1000);
    return 0;
}
var interval02;
function timer02(t1)
{
    interval02 = setInterval(function(){
        sendButton = document.getElementById("btn-mobile_verification-sendotp")
        if(sendButton == null || sendButton == undefined){
            clearInterval(interval02);
        }
        else if(t1 <= 0)
        {
            sendButton.disabled = false;
            sendButton.innerHTML = "Resend OTP";
            clearInterval(interval02);
            return 0;
        }
        else if(t1 > 0)
        {
            sendButton.disabled = true;
            sendButton.innerHTML = `Resend OTP in ${t1}s`
            t1 = t1 - 1;
        }
    }, 1000);
    return 0;
}

var userEmailVerified = false;
var userMobileVerified = false;
$(".registration-div").on('click', "#btn-email_verification-sendotp", emailOtpSendUserVerification);
function emailOtpSendUserVerification(){
    $("#email_verification-error").html('');
    clearInterval(interval01);
    $("this").prop('disabled', true);
    $(this).html('Sending...');
    $.ajax(
    {
        type:'POST',
        url: $("#user_verification-form").attr('action'),
        data:{
            action: 'OTPSend',
            sendTo: 'email',
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            if(response.success){
                userEmailVerified = false;
                clearInterval(interval01);
                t = 120;
                timer01(t);
                $("#email_verification").val('');
            }
        },
        error: function(response)
        {
            $("#btn-email_verification-sendotp").prop('disabled', false);
            $("#btn-email_verification-sendotp").html('Resend OTP');
            $("#email_verification-error").html('Failed!');
        },
    });
}
$(".registration-div").on('click', "#btn-email_verification-verify", emailOtpVerifyUserVerification);
function emailOtpVerifyUserVerification(){
    let emailOTP = $("#email_verification-otp").val();
    $("#email_verification-error").html('');
    if(emailOTP == '' || emailOTP == null || emailOTP == undefined){
        $("#email_verification-error").html('Enter OTP!');
    }
    else{
        $(this).prop('disabled', true);
        $.ajax(
        {
            type:'POST',
            url: $("#user_verification-form").attr('action'),
            data:{
                action: 'OTPVerify',
                otp: emailOTP,
                verifyFor: 'email',
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success:function(response)
            {
                if(response.valid){
                    clearInterval(interval01);
                    $("#btn-email_verification-verify").html('Verified');
                    $("#btn-email_verification-sendotp").html('Resend OTP');
                    $("#btn-email_verification-sendotp").prop('disabled', true);
                    userEmailVerified = true;
                    if(userEmailVerified && userMobileVerified){
                        $("#otpVerifyModal").modal('hide');
                    }
                }
                else{
                    $("#btn-email_verification-verify").prop('disabled', false);
                    $("#email_verification-error").html('Invalid OTP!');
                }
            },
            error: function(response)
            {
                $("#btn-email_verification-verify").prop('disabled', false);
                $("#email_verification-error").html('Failed!');
            },
        });
    }
}

$(".registration-div").on('click', "#btn-mobile_verification-sendotp", mobileOtpSendUserVerification);
function mobileOtpSendUserVerification(){
    $("#mobile_verification-error").html('');
    clearInterval(interval02);
    $("this").prop('disabled', true);
    $(this).html('Sending...');
    $.ajax(
    {
        type:'POST',
        url: $("#user_verification-form").attr('action'),
        data:{
            action: 'OTPSend',
            sendTo: 'mobile',
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            if(response.success){
                userMobileVerified = false;
                clearInterval(interval02);
                t = 120;
                timer02(t);
                $("#mobile_verification").val('');
            }
        },
        error: function(response)
        {
            $("#btn-mobile_verification-sendotp").prop('disabled', false);
            $("#btn-mobile_verification-sendotp").html('Resend OTP');
            $("#mobile_verification-error").html('Failed!');
        },
    });
}
$(".registration-div").on('click', "#btn-mobile_verification-verify", mobileOtpVerifyUserVerification);
function mobileOtpVerifyUserVerification(){
    let mobileOTP = $("#mobile_verification-otp").val();
    $("#mobile_verification-error").html('');
    if(mobileOTP == '' || mobileOTP == null || mobileOTP == undefined){
        $("#mobile_verification-error").html('Enter OTP!');
    }
    else{
        $(this).prop('disabled', true);
        $.ajax(
        {
            type:'POST',
            url: $("#user_verification-form").attr('action'),
            data:{
                action: 'OTPVerify',
                otp: mobileOTP,
                verifyFor: 'mobile',
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success:function(response)
            {
                if(response.valid){
                    clearInterval(interval02);
                    $("#btn-mobile_verification-verify").html('Verified');
                    $("#btn-mobile_verification-sendotp").html('Resend OTP');
                    $("#btn-mobile_verification-sendotp").prop('disabled', true);
                    userMobileVerified = true;
                    if(userEmailVerified && userMobileVerified){
                        $("#otpVerifyModal").modal('hide');
                    }
                }
                else{
                    $("#btn-mobile_verification-verify").prop('disabled', false);
                    $("#mobile_verification-error").html('Invalid OTP!');
                }
            },
            error: function(response)
            {
                $("#btn-mobile_verification-verify").prop('disabled', false);
                $("#mobile_verification-error").html('Failed!');
            },
        });
    }
}

var otpSendToEmail = undefined;
var emailOtpSent = false;
var interval1;
var currentOTPTimer1 = 0;
function timer1(t1)
{
    interval1 = setInterval(function(){
        sendButton = document.getElementById("email-otp-send-btn")
        if(sendButton == null || sendButton == undefined){
            clearInterval(interval1);
        }
        else if(t1 <= 0)
        {
            sendButton.disabled = false;
            sendButton.innerHTML = "Resend OTP";
            clearInterval(interval1);
            return 0;
        }
        else if(t1 > 0)
        {
            sendButton.disabled = true;
            sendButton.innerHTML = `Resend OTP in ${t1}s`
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
        sendButton = document.getElementById("mobile-otp-send-btn")
        if(sendButton == null || sendButton == undefined){
            clearInterval(interval2);
        }
        else if(t2 <= 0)
        {
            sendButton.disabled = false;
            sendButton.innerHTML = "Resend OTP";
            clearInterval(interval2);
            return 0;
        }
        else if(t2 > 0)
        {
            sendButton.disabled = true;
            sendButton.innerHTML = `Resend OTP in ${t2}s`
            t2 = t2 - 1;
            currentOTPTimer2 = t2;
        }
    }, 1000);
    return 0;
}

var registration_status = $("#registration_status").val();
if(registration_status == 'True'){
    $("#registration-success-message").show();
}
else{
    window.onbeforeunload = function(e) {
        return "You text is not saved!";
    }
}


var addedRooms;
$(".registration-div").on('keyup', ".dropdown-input-search-room", function(event){
    updateDropdownResult({datalist:addedRooms, querySelector:this, value_key:'id', label_key:'Room'});
})
var addedUnits;
$(".registration-div").on('keyup', ".dropdown-input-search-unit", function(event){
    updateDropdownResult({datalist:addedUnits, querySelector:this, value_key:'id', label_key:'Unit'});
})
var addedBuildings;
$(".registration-div").on('keyup', ".dropdown-input-search-building", function(event){
    updateDropdownResult({datalist:addedBuildings, querySelector:this, value_key:'id', label_key:'Building'});
})

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
        element.html(`<p style="text-align:center"><b>Click on the '+' icon to add items.</b></p>`)
    }
}

function updateRoomRow(addedRooms){
    if(addedRooms.length > 0){
        $(".no-room-added").remove();
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
    if(addedUnits.length > 0){
        $(".no-unit-added").remove();
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
    if(addedBuildings.length > 0){
        $(".no-building-added").remove();
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
            $("#table-added-room-data").html("");
            addedRooms = response.rooms;
            updateRoomRow(addedRooms)
            updateDropdownResult({datalist:addedRooms, querySelector:'.selectRoom-dropdown-dataLists', value_key:'id', label_key:'Room'});
        }
    });
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

$(document).ready(function(event){
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
                updateRoomRow(addedRoom)
                $("#add_room_form").trigger('reset');
                $("#add-room-message").html(`<span class="text-success"><b>Room Added</b></span>`);
                addedRooms = addedRooms.concat(addedRoom[0]);
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

$("#table-added-room-data").on('click', ".btn-room-edit", function(){
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

$("#table-added-room-data").on('click', ".btn-room-remove", function(){
    $(this).tooltip('dispose')
    let data_id = $(this).attr('data-id');
    let hospitalId = $("#id_hospital").val();
    $(this).prop('disabled', true);
    $(`#btn-room-remove-icon-${data_id}`).removeClass("fa-solid fa-trash");
    $(`#btn-room-remove-icon-${data_id}`).addClass("fa-light fa-spinner-third fa-spin");
    $.ajax(
    {
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
                updateUnitRow(addedUnit)
                $("#add_unit_form").trigger('reset');
                $("#add-unit-message").html(`<span class="text-success"><b>New Unit Added</b></span>`);
                addedUnits = addedUnits.concat(addedUnit[0]);
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
                updateBuildingRow(addedBuilding)
                $("#add_building_form").trigger('reset');
                $("#add-building-message").html(`<span class="text-success"><b>New Building Added</b></span>`);
                addedBuildings = addedBuildings.concat(addedBuilding[0]);
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



$(document).ready(function(){
    $.ajax({
        type:'GET',
        url: '/all-added-beds/',
        data: {
            hospitalId: $("#id_hospital").val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response){
            $("#not-added").remove();
            for(i=0; i<response.beds.length; i++){
                bed = response.beds[i];
                var html =
                `<tr class="addedBed-table-row" id="addedBed-table-row-${bed.id}">
                    <td><i class="fa-solid fa-trash delete-added-bed" id="delete-added-bed-${bed.id}" style="cursor:pointer" data-value="${bed.id}"></i></td>
                    <th scope="row" class="table-serial-no"></th>
                    <td>${bed.Department__department}</td>
                    <td>${bed.Bed_No}</td>
                    <td>${bed.Ward}</td>
                    <td>${bed.Support}</td>
                    <td id="td-room-${bed.Room__id}">${bed.Room__Room == null ? '___': bed.Room__Room}</td>
                    <td>${bed.Floor}</td>
                    <td id="td-unit-${bed.Unit__id}">${bed.Unit__Unit== null ? '___': bed.Unit__Unit}</td>
                    <td id="td-building-${bed.Building__id}">${bed.Building__Building== null ? '___': bed.Building__Building}</td>
                </tr>`
                $("#added-bed-data-body").append(html);
            }
        }
    });
});

$(".registration-div").on('submit', "#hospitalRegistrationBedAdd", function(event){
    event.preventDefault();
    let theForm = new FormData(this);
    let csrf = $('input[name=csrfmiddlewaretoken]').val();
    emailOTP = $("#email_verification-otp").val(),
    mobileOTP = $("#mobile_verification-otp").val(),
    theForm.append('csrfmiddlewaretoken', csrf);
    theForm.append('emailOTP', emailOTP);
    theForm.append('mobileOTP', mobileOTP);
    $("#hospitalRegistrationBedAdd :input").prop("disabled", true);
    $("#hospitalRegistrationBedAddSubmit").html(`<i class="fa-light fa-loader fa-spin"></i>`);
    $("#add-bed-message").html('');
    $.ajax({
        type:'POST',
        url: $(this).attr('action'),
        data: theForm,
        contentType: false,
        processData: false,
        dataType: 'json',
        cache: false,
        success:function(response){
            $("#hospitalRegistrationBedAdd :input").prop("disabled", false);
            $("#hospitalRegistrationBedAddSubmit").html('Add Bed');
            if(response.success){
                $("#add-bed-message").html(`<span class="text-success">New bed added</span>`);
                $("#not-added").remove();
                createdBed = response.createdBed[0];
                var html =
                `<tr class="addedBed-table-row" id="addedBed-table-row-${createdBed.id}">
                    <td><i class="fa-solid fa-trash delete-added-createdBed" id="delete-added-createdBed-${createdBed.id}" style="cursor:pointer" data-value="${createdBed.id}"></i></td>
                    <th scope="row" class="table-serial-no"></th>
                    <td>${createdBed.Department__department}</td>
                    <td>${createdBed.Bed_No}</td>
                    <td>${createdBed.Ward}</td>
                    <td>${createdBed.Support}</td>
                    <td id="td-room-${createdBed.Room__id}">${createdBed.Room__Room == null ? '___': createdBed.Room__Room}</td>
                    <td>${createdBed.Floor}</td>
                    <td id="td-unit-${createdBed.Unit__id}">${createdBed.Unit__Unit== null ? '___': createdBed.Unit__Unit}</td>
                    <td id="td-building-${createdBed.Building__id}">${createdBed.Building__Building== null ? '___': createdBed.Building__Building}</td>
                </tr>`
                $("#added-bed-data-body").prepend(html);
            }
            else if(response.exists){
                $("#add-bed-message").html(`<span class="text-danger">Bed with the data already exists!</span>`);
            }
        },
        error:function(){
            $("#hospitalRegistrationBedAdd :input").prop("disabled", false);
            $("#hospitalRegistrationBedAddSubmit").html('Add Bed');
            $("#add-bed-message").html(`<span class="text-danger">Failed to add bed!</span>`);
        },
    });
});
$(".registration-div").on('reset', "#hospitalRegistrationBedAdd", function(){
    $("#add-bed-message").html('');
    $("#add-bed-support").html(`<option label="Select Support"></option>`);
    $("#add-bed-support").attr("data-toggle", "tooltip");
    $("#add-bed-support").attr("data-placement", "top");
    $("#add-bed-support").attr("title", "Select Ward First");
});
$(".registration-div").on('keyup', "#hospitalRegistrationBedAdd input", function(){
    $("#add-bed-message").html('');
});
$(".registration-div").on('change', "#hospitalRegistrationBedAdd select", function(){
    $("#add-bed-message").html('');
});

$("#added-bed-data-body").on('click', '.delete-added-bed', function(){
    let id = $(this).attr('data-value');
    $(`#delete-added-bed-${id}`).addClass(`fa-duotone fa-spinner-third fa-spin`);
    $(`#delete-added-bed-${id}`).removeClass(`fa-solid fa-trash`);
    let hospitalId = $("#id_hospital").val();
    $.ajax({
        type:'POST',
        url: "/hospital-remove-bed/",
        data: {
            hospitalId: hospitalId,
            bedId: id,
            emailOTP: $("#email_verification-otp").val(),
            mobileOTP: $("#mobile_verification-otp").val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response){
            $("#hospitalRegistrationBedAdd :input").prop("disabled", false);
            $("#hospitalRegistrationBedAddSubmit").html('Add Bed');
            if(response.success){
                $(`#addedBed-table-row-${id}`).remove();
            }
            else{
                $(`#delete-added-bed-${id}`).removeClass(`fa-duotone fa-spinner-third`);
                $(`#delete-added-bed-${id}`).addClass(`fa-solid fa-trash`);
                $(`#delete-added-bed-${id}`).prop('disabled', false);
                alert('Failed to remove bed.\nTry Again!');
            }
        },
        error:function(){
            $(`#delete-added-bed-${id}`).removeClass(`fa-duotone fa-spinner-third`);
            $(`#delete-added-bed-${id}`).addClass(`fa-solid fa-trash`);
            $(`#delete-added-bed-${id}`).prop('disabled', false);
            alert('Failed to remove bed.\nTry Again!');
        },
    });
});


$(".registration-div").on('submit', "#hospitalRegistration", function(event){
    event.preventDefault();
    if(mobileOtpSent && emailOtpSent){
        $('#registerMessage').html("");
        let hosLat = $("#selectedLatitude").val();
        let hosLng = $("#selectedLongitude").val();
        if(hosLat == '' || hosLng == ''){
            $('#registerMessage').html("Please pick hospital's location");
        }
        else{
            let theForm = new FormData(this);
            let csrf = $('input[name=csrfmiddlewaretoken]').val()
            theForm.append('csrfmiddlewaretoken', csrf);
            other_contacts = []
            $('input[name="other_contacts"]').each(function (index, member) {
                var value = $(member).val();
                other_contacts.push(value);
            });
            theForm.append('other_contacts', other_contacts);
            $("#hospitalRegistration :input").prop("disabled", true);
            $("#formSubmitBtn").html('Please Wait');
            $.ajax(
            {
                type:'POST',
                url: $(this).attr('action'),
                data: theForm,
                contentType: false,
                processData: false,
                dataType: 'json',
                cache: false,
                enctype: 'multipart/form-data',
                success:function(response)
                {   
                    if(response.error == '0'){
                        $("#hospitalID").html(response.hospitalId);
                        targetURL = response.next_step_url;
                        sendRequest({url: targetURL})
                            .then( function(response1) {
                                var title = $(response1).filter("title").html();
                                history.pushState({page: 2}, title, targetURL);
                                $(".registration-div").html($(response1).find(".registration-div").html());
                                onLoadOtpVerification();
                            }, function(error){
                                console.log(error);
                                $("#formSubmitBtn").html('Next');
                                $("#hospitalRegistration :input").prop("disabled", false);
                        });
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                    }
                    else{
                        $("#formSubmitBtn").html('Next');
                        $("#hospitalRegistration :input").prop("disabled", false);
                        if(response.error == '001' || response.error == '002'){
                            $("#registerMessage").html(response.message)
                        }
                        else if(response.error == '003'){
                            $('#registerMessage').html(response.message);
                            if(response.OTPinvalidFor.includes('Mobile')){
                                $('#register-hospital-otp-mobile').addClass('is-invalid');
                                $('#mobileotpvalidation').html("Invalid OTP");
                            }
                            if(response.OTPinvalidFor.includes('Email')){
                                $('#register-hospital-otp-email').addClass('is-invalid');
                                $('#emailotpvalidation').html("Invalid OTP");
                            }
                        }
                        else{
                            $('#registerMessage').html("Please provide correct input!");
                            responseErrors = response.data;
                            for(i=0; i<responseErrors.length; i++){
                                let error = responseErrors[i]['error'];
                                let message = responseErrors[i]['message']
                                if(error == '1'){
                                    $('#usernamevalidation').removeClass('feedback-valid');
                                    $('#usernamevalidation').addClass('feedback-invalid');
                                    $('#register-hospital-username').removeClass('is-valid');
                                    $('#register-hospital-username').addClass('is-invalid');
                                    $('#usernamevalidation').html(message);
                                }
    
                                if(error == '2'){
                                    $('#emailvalidation').removeClass('feedback-valid');
                                    $('#emailvalidation').addClass('feedback-invalid');
                                    $('#register-hospital-email').removeClass('is-valid');
                                    $('#register-hospital-email').addClass('is-invalid');
                                    $('#emailvalidation').html(message);
                                }
    
                                if(error == '3'){
                                    $('#mobilevalidation').removeClass('feedback-valid');
                                    $('#mobilevalidation').addClass('feedback-invalid');
                                    $('#register-hospital-mobile').removeClass('is-valid');
                                    $('#register-hospital-mobile').addClass('is-invalid');
                                    $('#mobilevalidation').html(message);
                                }
    
                                if(error == '4')
                                {
                                    $('#passwordcheck').removeClass('feedback-valid');
                                    $('#passwordcheck').addClass('feedback-invalid');
                                    $('#register-hospital-password2').removeClass('is-valid');
                                    $('#register-hospital-password2').addClass('is-invalid');
                                    $("passwordcheck").html(message);
                                }
    
                                if(error == '5')
                                {
                                    $('#checkpassword').removeClass('feedback-valid');
                                    $('#checkpassword').addClass('feedback-invalid');
                                    $('#register-hospital-password1').removeClass('is-valid');
                                    $('#register-hospital-password1').addClass('is-invalid');
                                    $("checkpassword").html("Password doesn't follow the rules");
                                }
    
                                if(error == '6' || error == '7')
                                {
                                    $('#imageError').removeClass('feedback-valid');
                                    $('#imageError').addClass('feedback-invalid');
                                    $('#picture').removeClass('is-valid');
                                    $('#picture').addClass('is-invalid');
                                    $('#imageError').html(message);
                                }

                                if(error == '8')
                                {
                                    $('#registration_no-error').removeClass('feedback-valid');
                                    $('#registration_no-error').addClass('feedback-invalid');
                                    $('#register-hospital-registration_no').removeClass('is-valid');
                                    $('#register-hospital-registration_no').addClass('is-invalid');
                                    $('#registration_no-error').html(message);
                                }

                                if(error == '9' || error == '10'){
                                    $("#registration_document").addClass('is-invalid');
                                    $("#registration_document-error").addClass('feedback-invalid');
                                    $('registration_document-error').html(message);
                                }
                            }
                        }
                    }
                },
                error: function(response)
                {
                    $("#formSubmitBtn").html('Next');
                    $('#registerMessage').html("Failed to Register yourself. Try Again!");
                    $("#hospitalRegistration :input").prop("disabled", false);
                }
            });
        }
    }
    else{
        $("#registerMessage").html(`Please send OTP to verify contact info`)
    }
});

$(".registration-div").on('click', "#doneRegistration", function(event){
    event.preventDefault();
    let antivenom = $("input[name=has-antivenom]:checked").val();
    var rowCount = $("#added-bed-data-body tr").length;
    
    if(antivenom == undefined){
        $("#registerDoneError").html('Choice antivenom availability!');
    }
    else if(rowCount > 1){
        $(this).prop('disabled', true);
        $(this).html('Submiting...');
        $("#registerDoneError").html('');
        $.ajax({
            type:'POST',
            url: "/register-hospital-submit/",
            data: {
                hospitalID: $("#id_hospital").val(),
                antivenom: antivenom,
                emailOTP: $("#email_verification-otp").val(),
                mobileOTP: $("#mobile_verification-otp").val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success:function(response){
                if(response.success){
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    $("#registration-success-message").show();
                    $("#main-registration-box").remove();
                    window.removeEventListener('beforeunload', function(){});
                }
                else{
                    $("#doneRegistration").prop('disabled', false);
                    $('#doneRegistration').html('Submit');
                    $("#registerDoneError").html('Error occurred. Try again!');
                }
            },
            error:function(){
                $("#doneRegistration").prop('disabled', false);
                $('#doneRegistration').html('Submit');
                $("#registerDoneError").html('Error occurred. Try again!');
            },
        });
    }
    else{
        $("#registerDoneError").html('Please add beds to complete the registration');
    }
});



$(".registration-div").on('click', "#mobile-otp-send-btn", mobileOtpSend);
function mobileOtpSend(){
    let mobile = $("#register-hospital-mobile").val();
    $("#mobilevalidation").removeClass('feedback-valid');
    $("#mobilevalidation").removeClass('feedback-invalid');
    $("#mobilevalidation").html(``);
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
            url: "/send-otp-register/",
            data:{
                contact: mobile,
                sendTo: 'mobile',
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success:function(response)
            {
                if(response.error == '0'){
                    clearInterval(interval2);
                    t = 120;
                    timer2(t);
                    $("#mobile-otp-sent-to").html(`OTP sent to ${mobile}`);
                    $("#register-hospital-otp-mobile").val('');
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
        $("#mobilevalidation").removeClass('feedback-valid');
        $("#mobilevalidation").addClass('feedback-invalid');
        $("#mobilevalidation").html(`Enter 10 digit mobile no`);
    }
}

$(".registration-div").on('click', "#email-otp-send-btn", emailOtpSend);
function emailOtpSend(){
    let email = $("#register-hospital-email").val();
    $("#email-otp-sent-to").html('');
    $("#emailotpvalidation").html('');
    clearInterval(interval1);
    $(this).prop('disabled', true);
    $(this).html('Sending...');
    otpSendToEmail = undefined;
    emailOtpSent = false;
    $.ajax(
    {
        type:'POST',
        url: "/send-otp-register/",
        data:{
            email: email,
            sendTo: 'email',
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            if(response.error == '0'){
                clearInterval(interval1);
                t = 120;
                timer1(t);
                $("#email-otp-sent-to").html(`OTP sent to ${email}`);
                $("#register-hospital-otp-email").val('');
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



function passwordmatch()
{
    password1 = $('#register-hospital-password1').val()
    password2 = $('#register-hospital-password2').val()
    document.getElementById('passwordcheck').innerHTML = ""

    if(password1 == '' || password2 == '')
    {
        $('#register-hospital-password2').removeClass('is-invalid');
        $('#register-hospital-password2').removeClass('is-valid');
        $("#passwordcheck").removeClass('feedback-invalid');
        $("#passwordcheck").removeClass('feedback-valid');
        document.getElementById('passwordcheck').innerHTML = ""
    }
    else if(password1 === password2)
    {
        $('#register-hospital-password2').removeClass('is-invalid');
        $('#register-hospital-password2').addClass('is-valid');
        $("#passwordcheck").removeClass('feedback-invalid');
        $("#passwordcheck").addClass('feedback-valid');
        document.getElementById('passwordcheck').innerHTML = "Password and Confirm Password matched!"
    }
    else if(password1 != password2)
    {
        $('#register-hospital-password2').removeClass('is-valid');
        $('#register-hospital-password2').addClass('is-invalid');
        $("#passwordcheck").addClass('feedback-invalid');
        $("#passwordcheck").removeClass('feedback-valid');
        document.getElementById('passwordcheck').innerHTML = "Password and Confirm Password didn't match!"
    }
}
$(".registration-div").on('keyup', "#register-hospital-password1", passwordmatch)
$(".registration-div").on('keyup', "#register-hospital-password2", passwordmatch)


function PasswordValidation()
{
    $("#register-hospital-password1").removeClass("is-valid");
    $("#register-hospital-password1").removeClass("is-invalid");
    document.getElementById("register-hospital-password2").disabled = true;
    document.getElementById('checkpassword').innerHTML = "";
    let password = $('#register-hospital-password1').val();
    var isFocused = $('#register-hospital-password1').is(':focus');
    if(password != '' || isFocused){
        $.ajax({
            type:'POST',
            url: "/check-password/",
            data: {
                password: password,
                username: $('#register-hospital-username').val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                if(response.password_error == 'No Error')
                {
                    $("#register-hospital-password1").addClass("is-valid");
                    document.getElementById("register-hospital-password2").disabled = false;
                }
                else
                {
                    $('#register-hospital-password1').addClass('is-invalid');
                    document.getElementById('checkpassword').innerHTML = `Password must be fulfill the below rules`;
                }
            },
        });
    }
}
$(".registration-div").on('keyup', "#register-hospital-username", PasswordValidation)
$(".registration-div").on('keyup', "#register-hospital-password1", PasswordValidation)


$(".registration-div").on('keyup', "#register-hospital-otp-email", function(){
    $(this).removeClass('is-invalid');
    $("#emailotpvalidation").html("");
});
$(".registration-div").on('keyup', "#register-hospital-otp-mobile", function(){
    $(this).removeClass('is-invalid');
    $("#mobileotpvalidation").html("");
});

$(".registration-div").on('keyup', "#register-hospital-username", UsernameCheck)
function UsernameCheck(){
    user = $('#register-hospital-username').val();
    $.ajax({
    type:'POST',
    url: "/username-validation/",
    data: {
        'username':user,
        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success: function(data)
        {
        if(data.hasError)
        {
            $('#register-hospital-username').addClass('is-invalid');
            $("#usernamevalidation").addClass('feedback-invalid');
            $('#register-hospital-username').removeClass('is-valid');
            $("#usernamevalidation").removeClass('feedback-valid');
            document.getElementById('usernamevalidation').innerHTML = data.message;
        }
        else
        {
            document.getElementById('usernamevalidation').innerHTML = "";
            $('#register-hospital-username').removeClass('is-invalid');
            $("#usernamevalidation").removeClass('feedback-invalid');
            $("#register-hospital-username").addClass('is-valid');
        }
        },
    });
}


$(".registration-div").on('keyup', "#register-hospital-mobile", function(){
    $('#register-hospital-mobile').removeClass('is-invalid');
    $('#register-hospital-mobile').removeClass('is-valid');
    $("#mobilevalidation").removeClass('feedback-valid');
    $("#mobilevalidation").removeClass('feedback-invalid');
    $("#mobilevalidation").html(``);
    let value = $(this).val();
    clearInterval(interval2);
    $("#mobile-otp-send-btn").prop('disabled', true);
    if(value == otpSendToMobile){
        mobileOtpSent = true;
        timer2(currentOTPTimer2);
    }
    else{
        mobileOtpSent = false;
        $("#mobile-otp-send-btn").prop('disabled', false);
        $("#mobile-otp-send-btn").html('Send OTP');
        $("#mobile-otp-sent-to").html('');
    }
});

$(".registration-div").on('keyup', "#register-hospital-email", emailcheck);
function emailcheck(){
    let email = $(this).val();
    clearInterval(interval1);
    $("#email-otp-send-btn").prop('disabled', true);
    if(email == otpSendToEmail){
        emailOtpSent = true;
        timer1(currentOTPTimer1);
    }
    else{
        emailOtpSent = false;
        $("#email-otp-send-btn").prop('disabled', false);
        $("#email-otp-send-btn").html('Send OTP');
        $("#email-otp-sent-to").html('');

        $('#register-hospital-email').removeClass('is-invalid');
        $('#register-hospital-email').removeClass('is-valid');
        $("#emailvalidation").removeClass('feedback-invalid');
        $('#emailvalidation').removeClass('is-valid');
        document.getElementById('emailvalidation').innerHTML = "";
        var positionOfAt = email.indexOf("@");
        var positionOfDot = email.lastIndexOf(".");

        if(email.search("@") == -1 || //if '@' is not present
        email.search(" ") >= 1 || //if blank space is present
        email.search(".") == -1 || //if "." is not present
        positionOfAt < 2 || //if there is no character before "@", at least 2 character should be present before "@"
        positionOfDot - positionOfAt <= 2 || //between '@' and '.', if there is not at least two character
        email.length - positionOfDot <= 2) //if after '.' there is not at least two character)
        {
            $('#register-hospital-email').removeClass('is-valid');
            $('#register-hospital-email').addClass('is-invalid');
            $("#emailvalidation").removeClass('feedback-valid');
            $("#emailvalidation").addClass('feedback-invalid');
            $('#emailvalidation').html("Invalid Email Id!");
            $("#email-otp-send-btn").prop('disabled', true);
        }
        else
        {
            if(email.length > 0)
            {
                $.ajax({
                    type:'POST',
                    url: "/email-validation/",
                    data: {
                        'email':email,
                        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
                    },
                    dataType: 'json',
                    cache: false,
                    success: function(data){
                        if(data.hasError == '1')
                        {
                            $('#register-hospital-email').removeClass('is-valid');
                            $('#register-hospital-email').addClass('is-invalid');
                            $("#emailvalidation").removeClass('feedback-valid');
                            $("#emailvalidation").addClass('feedback-invalid');
                            document.getElementById('emailvalidation').innerHTML = data.message;
                            $("#email-otp-send-btn").prop('disabled', true);
                        }
                        else
                        {
                            document.getElementById('emailvalidation').innerHTML = "";
                        }
                    },
                });
            }
        }
    }
}


$(".registration-div").on('change', "#register-hospital-state", loadDistrict)
function loadDistrict()
{
    state = $(this).val();
    $("#register-hospital-district").html(`<option label="Select District" selected></option>`);
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
                $("#register-hospital-district").append(`<option value="${response.districts[i]}">${response.districts[i]}</option>`);
            }
        },
    });
}

$(".registration-div").on('keyup', "#register-hospital-pin", loadAddress);
function loadAddress()
{
    pin = $(this).val();
    $("#register-hospital-pin").removeClass('is-valid');
    $("#register-hospital-pin").removeClass('is-invalid');
    if(pin.length == 6)
    {
        document.getElementById('formSubmitBtn').disabled = true;
        document.getElementById('pinLoader').style.visibility = 'visible';
        var select = document.getElementById("register-hospital-district");
        select.options.length = 0;
        $('#register-hospital-state').val('');
        $('#register-hospital-district').val('');
        $('#register-hospital-subdivision').val('');
        $('#register-hospital-city').val('');
        $('#register-hospital-state').prop('disabled', true)
        $('#register-hospital-district').prop('disabled', true)
        $('#register-hospital-subdivision').prop('disabled', true)
        $('#register-hospital-city').prop('disabled', true)
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
                $("#register-hospital-pin").removeClass('is-invalid');
                $("#register-hospital-pin").addClass('is-valid');

                document.getElementById('formSubmitBtn').disabled = false;
                
                $('#subdivision').val(response.city);
                $('#state').val();
                $('#register-hospital-state').val(response.state);
                $('#register-hospital-subdivision').val(response.division);
                $('#register-hospital-city').val(response.city);
                document.getElementById('pinLoader').style.visibility = 'hidden';
                select.options.length = 0;
                for(var i in response.districts)
                {
                    var newOption = new Option(response.districts[i], response.districts[i]);
                    select.add(newOption,undefined);
                }
                if(response.districtFind){
                    select.value = response.district;
                }
                else{
                    $("#register-hospital-district").prepend(`<option label="Select District" selected></option>`);
                }
                $('#register-hospital-state').prop('disabled', false)
                $('#register-hospital-district').prop('disabled', false)
                $('#register-hospital-subdivision').prop('disabled', false)
                $('#register-hospital-city').prop('disabled', false)
            },
            error: function(response)
            {
                $('#register-hospital-state').prop('disabled', false)
                $('#register-hospital-district').prop('disabled', false)
                $('#register-hospital-subdivision').prop('disabled', false)
                $('#register-hospital-city').prop('disabled', false)
                document.getElementById('formSubmitBtn').disabled = false;
                document.getElementById('pinLoader').style.visibility = 'hidden';
            }
        });

    }
    else{
        $("#register-hospital-pin").removeClass('is-valid');
        $("#register-hospital-pin").addClass('is-invalid');
    }
}


$(".registration-div").on('change', "#picture", upload_img);
function upload_img() {
    $(this).removeClass('is-valid');
    $(this).removeClass('is-invalid');
    $("#imageError").removeClass('feedback-valid');
    $("#imageError").removeClass('feedback-invalid');
    document.getElementById('imageError').innerHTML = "";
    $("#img_id").removeClass('profile-image-border');
    $('#img_id').attr('src', "/static/images/hospital-transparent.png");
    var fileUpload = this;
    if (typeof(fileUpload.files) != undefined) {
        var size = fileUpload.files[0].size / 1024;
        var fileType = fileUpload.files[0].type.split('/')[0];
        if(fileType != 'image')
        {
            $(this).val('')
            $(this).addClass('is-invalid');
            $("#imageError").addClass('feedback-invalid');
            document.getElementById('imageError').innerHTML = "This is not an image file. Select an image file.";
        }
        else if(size > 1024*5)
        {
            $(this).val('')
            $(this).addClass('is-invalid');
            $("#imageError").addClass('feedback-invalid');
            document.getElementById('imageError').innerHTML = "Image size should be maximum 5 MB.";
        }
        else if (fileUpload.files && fileUpload.files[0])
        {
            $(this).removeClass('is-invalid');
            $(this).addClass('is-valid');
            afterCropFunction = function(){
                $("#img_id").addClass('profile-image-border');
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                initializeImageCroper({image_src:e.target.result, aspect_ratio:16 / 9, display_image:'#img_id', image_input:'#picture', afterCropFunction:afterCropFunction,})
            }
            reader.readAsDataURL(fileUpload.files[0]);
            $(this).val('')
        }
    }
}

$(".registration-div").on('change', "#registration_document", checkDocument);
function checkDocument() {
    $(this).removeClass('is-valid');
    $(this).removeClass('is-invalid');
    $("#registration_document-error").removeClass('feedback-valid');
    $("#registration_document-error").removeClass('feedback-invalid');
    document.getElementById('registration_document-error').innerHTML = "";
    var fileUpload = this;
    var label = $(`label[for=registration_document]`);
    label.html(label.attr('data-placeholder'));
    if (typeof(fileUpload.files) != undefined) {
        var size = fileUpload.files[0].size / 1024;
        var fileType = fileUpload.files[0].type.split('/')[0];
        var fileExtension = fileUpload.files[0].type.split('/')[1];
        if(!(fileType == 'image' || fileExtension == "pdf" || fileExtension == "PDF"))
        {
            $(this).val('')
            $(this).addClass('is-invalid');
            $("#registration_document-error").addClass('feedback-invalid');
            document.getElementById('registration_document-error').innerHTML = "This is not an image or pdf file.";
        }
        else if(size > 1024*5)
        {
            $(this).val('')
            $(this).addClass('is-invalid');
            $("#registration_document-error").addClass('feedback-invalid');
            document.getElementById('registration_document-error').innerHTML = "Image size should be maximum 5 MB.";
        }
        else if (fileUpload.files && fileUpload.files[0]){
            label.html(fileUpload.files[0].name);
        }
    }
}

function addWardWith()
{
    let ward = $(this).val();
    let requireId = $(this).attr('data-support');
    $(requireId).html(`<option label='Select Support'></option>`)
    $(requireId).removeAttr("data-toggle");
    $(requireId).removeAttr("data-placement");
    $(requireId).removeAttr("title");
    if(ward == 'ICU' || ward == 'PICU' || ward == 'NICU')
    {
        let option1 = "<option value='With Ventilator'>With Ventilator</option>";
        let option2 = "<option value='Non-Ventilator'>Non-Ventilator</option>";
        $(requireId).append(option1 + option2);
    }
    else if(ward == 'General Ward' || ward == 'Female Ward' || ward == 'Male Ward' || ward == 'Child Ward')
    {
        let option1 = "<option value='With Oxygen'>With Oxygen</option>";
        let option2 = "<option value='Non-Oxygen'>Non-Oxygen</option>";
        $(requireId).append(option1 + option2);
    }
    else
    {
        $(requireId).attr("data-toggle", "tooltip");
        $(requireId).attr("data-placement", "top");
        $(requireId).attr("title", "Select Ward First");
    }
    return true;
}
$(".registration-div").on('change', '#add-bed-ward', addWardWith);

$(window).on("popstate", function () {
    location.reload();
});