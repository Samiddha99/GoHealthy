
var interval1;
var sendNumber = undefined
var verifiedNumber = undefined
var otpVerified = false;
var countDown1 =''
function resendTimer(t1)
{
    interval1 = setInterval(function(){
        if(t1 <= 0)
        {
            $("#edit-sent-otp-button").prop('disabled', false);
            $('#edit-sent-otp-button').html('Send OTP');
            clearInterval(interval1);
            countDown1 = "off"
        }
        else if(t1 > 0)
        {
            $("#edit-sent-otp-button").prop('disabled', true);
            document.getElementById("edit-sent-otp-button").innerHTML = `Send OTP (${t1}s)`
            t1 = t1 - 1;
            countDown1 = "on"
        }
    }, 1000);
    return 0;
}

$(".step-select").on('click', function(){
    var currentStarus = $(this).attr('data-status');
    if(currentStarus == 'done' || currentStarus == 'current'){
        var target = $(this).attr('data-target');
        $(".step-select").removeClass('active');
        $(this).addClass('active');
        $(".form-box").removeClass('active');
        $(target).addClass('active');
    }
});


$("#edit-sent-otp-button").on('click', function(event){
    event.preventDefault();
    contact = $("#event-edit-mobile").val();
    $("#event-edit-otp").val('')
    $("#otp-error").html('');
    $("#otp-sent-to").html('');
    $("#no-register-found").html('');
    $("#donationCampEditForm").trigger('reset');
    if(contact.length == 10){
        $("#edit-verify-otp-button").html('Verify');
        $("#edit-verify-otp-button").prop('disabled', false);

        $("[data-target='#step-2-form']").removeClass('active');
        $("[data-target='#step-2-form']").removeClass('done');
        $("[data-target='#step-2-form']").removeClass('current');
        $("[data-target='#step-2-form']").addClass('undone');
        $("[data-target='#step-2-form']").attr('data-status', 'undone');

        $("[data-target='#step-3-form']").removeClass('active');
        $("[data-target='#step-3-form']").removeClass('done');
        $("[data-target='#step-3-form']").removeClass('current');
        $("[data-target='#step-3-form']").addClass('undone');
        $("[data-target='#step-3-form']").attr('data-status', 'undone');
        $("#event-edit-otp").prop('readonly', false);
        sendNumber = undefined;
        verifiedNumber = undefined
        otpVerified = false;
        $(this).prop('disabled', true);
        $(this).html('Sending....');
        $.ajax({
            type:'POST',
            url:"/send-otp-blood-donation-camp-edit/",
            data:{
                'contact':contact,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                $('#edit-sent-otp-button').html("Send OTP");
                if(response.error == '0'){
                    sendNumber = contact;
                    $("#otp-sent-to").html(`OTP sent to ${response.contact}`);
                    t = 120;
                    resendTimer(t);
                }
                else{
                    $('#edit-sent-otp-button').prop('disabled', false);
                    $('#edit-sent-otp-button').html('Send OTP');
                    $("#otp-error").html("Error occurred. Try again!");
                }
            },
            error: function(response){
                $('#edit-sent-otp-button').prop('disabled', false);
                $('#edit-sent-otp-button').html('Send OTP');
                $("#otp-error").html("Error occurred. Try again!");
            }
        });
    }
    else{
        $("#otp-error").html("Enter 10 digit valid mobile no");
    }
});


$("#mobile-verification").on('submit', function(event){
    event.preventDefault()
    $("#otp-error").html("");
    $("#donationCampEditForm").trigger('reset');
    verifiedNumber = undefined;
    otpVerified = false
    let contact = $("#event-edit-mobile").val();
    let otp = $("#event-edit-otp").val();

    $("[data-target='#step-2-form']").removeClass('active');
    $("[data-target='#step-2-form']").removeClass('done');
    $("[data-target='#step-2-form']").removeClass('current');
    $("[data-target='#step-2-form']").addClass('undone');
    $("[data-target='#step-2-form']").attr('data-status', 'undone');

    $("[data-target='#step-3-form']").removeClass('active');
    $("[data-target='#step-3-form']").removeClass('done');
    $("[data-target='#step-3-form']").removeClass('current');
    $("[data-target='#step-3-form']").addClass('undone');
    $("[data-target='#step-3-form']").attr('data-status', 'undone');

    if(contact.length != 10){
        $("#otp-error").html("Enter 10 digit valid mobile no");
    }
    else if(otp.length < 6){
        $("#otp-error").html("Please enter 6 digit valid OTP");
    }
    else{
        $('#edit-verify-otp-button').prop('disabled', true);
        $('#edit-verify-otp-button').html('Verifing...');
        $.ajax({
            type:'POST',
            url:"/verify-otp-blood-donation-camp-edit/",
            data:{
                'contact':contact,
                'otp': otp,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                if(response.error == '0'){
                    $("#otp-sent-to").html('');
                    $("#event-edit-otp").prop('readonly', true);
                    verifiedNumber = contact;
                    otpVerified = true;
                    clearInterval(interval1);
                    $('#edit-sent-otp-button').html('Send OTP');
                    $("#edit-sent-otp-button").prop('disabled', false);
                    getAllRegisteredEvents();
                }
                else if(response.error == '1'){
                    $("#edit-verify-otp-button").html('Verify');
                    $("#edit-verify-otp-button").prop('disabled', false);
                    $("#otp-error").html("Invalid OTP!");
                }
            },
            error: function(response){
                $("#otp-error").html("Failed to verify OTP. Try again!");
                $("#edit-verify-otp-button").prop('disabled', false);
                $("#edit-verify-otp-button").html('Verify');
            }
        });
    }
});

$("#mobile-verification").on('reset', function(){
    clearInterval(interval1);
    $('#edit-sent-otp-button').html('Send OTP');
    $("#otp-error").html("");
    $("#event-edit-otp").prop('readonly', true);
    $("#edit-verify-otp-button").html('Verify');
    $("#edit-verify-otp-button").prop('disabled', false);
    $("#otp-sent-to").html('');
    $("#edit-sent-otp-button").prop('disabled', false);
    $("#donationCampEditForm").trigger('reset');

    sendNumber = undefined
    verifiedNumber = undefined
    otpVerified = false;
});

$("#event-edit-mobile").on('keyup', function(){
    let contact = $(this).val();
    $("#otp-error").html("");
    $("#otp-sent-to").html("");
    if(contact != verifiedNumber){
        $("#edit-verify-otp-button").html('Verify');
        otpVerified = false
    }
    else{
        $("#edit-verify-otp-button").html('Verified');
        otpVerified = true
    }
});


function displayDate(startDate, endDate){
    startDate = formatDate(startDate);
    if(endDate != null){
        endDate = formatDate(endDate);
        return `<span>${startDate} - ${endDate}</span>`;
    }
    else{
        return `<span>Date: ${startDate}</span>`
    }
}
function getAllRegisteredEvents(){
    let contact = $("#event-edit-mobile").val();
    let otp = $("#event-edit-otp").val();
    $("#no-register-found").html('');
    $("#step-2-form").html('');
    if(otpVerified){
        $("#edit-verify-otp-button").html('Please Wait');
        $.ajax({
            type:'POST',
            url:"/get-registered-blood-donation-camps/",
            data:{
                'contact':contact,
                'otp': otp,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                if(response.verified){
                    
                    var registeredCamps = response.registeredCamps;
                    if(registeredCamps.length <= 0){
                        $("#edit-verify-otp-button").html('Verified');
                        $("#no-register-found").html('No ongoing or future events found with this mobile no');
                    }
                    else{
                        $("#step-2-form").html(`<div class="text-dark text-center"><h6>Upcoming Registered Events</h6></div>`)
                        for(i=0; i<registeredCamps.length; i++){
                            var registeredCamp = registeredCamps[i]
                            var html = 
                            `<div class="registered-camp-records mb-3">
                                <div class="camp-data-field field-1">
                                    <div class="data-heading">
                                        Organizer:
                                    </div>
                                    <div class="data-value">
                                        ${registeredCamp.Organizer}
                                    </div>
                                </div>
                                <div class="camp-data-field">
                                    <div class="data-heading">
                                        Landmark:
                                    </div>
                                    <div class="data-value">
                                        ${registeredCamp.Landmark}
                                    </div>
                                </div>
                                <div class="row no-gutters">
                                    <div class="col-md col-date">
                                        <div class="camp-data-field">
                                            <div class="data-heading">
                                                Date:
                                            </div>
                                            <div class="data-value">
                                                ${displayDate(registeredCamp.Start_Date, registeredCamp.End_Date)}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md">
                                        <div class="camp-data-field">
                                            <div class="data-heading">
                                                Time:
                                            </div>
                                            <div class="data-value">
                                                ${formatTime(registeredCamp.Start_Time)} - ${formatTime(registeredCamp.End_Time)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" class="btn-select w-100" data-id="${registeredCamp.camp_id}">Click to Select</button>
                            </div>`
                            $("#step-2-form").append(html);
                        }
                        $("#edit-verify-otp-button").html('Verified');
                        $('.step-select').removeClass('active');

                        $("[data-target='#step-1-form']").removeClass('active');
                        $("[data-target='#step-1-form']").removeClass('current');
                        $("[data-target='#step-1-form']").removeClass('undone');
                        $("[data-target='#step-1-form']").addClass('done');
                        $("[data-target='#step-1-form']").attr('data-status', 'done');

                        $("[data-target='#step-2-form']").removeClass('done');
                        $("[data-target='#step-2-form']").removeClass('undone');
                        $("[data-target='#step-2-form']").addClass('current active');
                        $("[data-target='#step-2-form']").attr('data-status', 'current');

                        $('.form-box').removeClass('active');
                        $("#step-2-form").addClass('active');
                    }
                }
                else{
                    $("#edit-verify-otp-button").html('Verify');
                    $("#edit-verify-otp-button").prop('disabled', false);
                    $("#otp-error").html("Invalid OTP!");
                    otpVerified = false
                }
            },
            error: function(response){
                $("#no-register-found").html('Error! Try again!');
                $("#edit-verify-otp-button").html('Verify');
                $("#edit-verify-otp-button").prop('disabled', false);
            }
        });
    }
}

$("#step-2-form").on('click', ".btn-select", function(){
    let campId = $(this).attr('data-id');
    let clickedButton = $(this)
    $(".btn-select").prop('disabled', true);
    $(".btn-select").html('Click to Select');
    $(this).html('Please Wait');
    $("#donationCampEditForm").trigger('reset');
    $.ajax({
        type:'POST',
        url:"/get-registered-blood-donation-camp-data/",
        data:{
            'id':campId,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            let donationCamp = response.camp[0]
            $("#id").val(donationCamp.camp_id);
            $("#Organization").val(donationCamp.Organizer);
            $("#Website").val(donationCamp.Organizer_Website);
            $("#Contact").val(donationCamp.Organizer_Contact);
            $("#Email").val(donationCamp.Email);
            $("#State").val(donationCamp.State__Name);
            $("#City").val(donationCamp.City);
            $("#Subdivision").val(donationCamp.Subdivision);
            $("#Pin").val(donationCamp.Pin);
            $("#Landmark").val(donationCamp.Landmark);
            $("#Start_Date").val(donationCamp.Start_Date);
            $("#End_Date").val(donationCamp.End_Date);
            $("#From").val(donationCamp.Start_Time);
            $("#To").val(donationCamp.End_Time);

            loadDistrict(donationCamp.District__Name);

            $(".btn-select").prop('disabled', false);
            clickedButton.prop('disabled', true);
            clickedButton.html('Selected');

            $("[data-target='#step-2-form']").removeClass('active');
            $("[data-target='#step-2-form']").removeClass('current');
            $("[data-target='#step-2-form']").removeClass('undone');
            $("[data-target='#step-2-form']").addClass('done');
            $("[data-target='#step-2-form']").attr('data-status', 'done');

            $("[data-target='#step-3-form']").removeClass('done');
            $("[data-target='#step-3-form']").removeClass('undone');
            $("[data-target='#step-3-form']").addClass('current active');
            $("[data-target='#step-3-form']").attr('data-status', 'current');

            $('.form-box').removeClass('active');
            $("#step-3-form").addClass('active');
        },
        error: function(response){
            $(".btn-select").prop('disabled', false);
            $(".btn-select").html('Click to Select');
        }
    });
});


$("#donationCampEditForm").on('submit', function(event){
    event.preventDefault()
    if(otpVerified){
        let theForm = new FormData(this)
        let csrf = $('input[name=csrfmiddlewaretoken]').val()
        theForm.append('csrfmiddlewaretoken', csrf);
        theForm.append('otp', $('#event-edit-otp').val());
        $(this).prop('disabled', true);
        $("#donationCampEditFormSubmit").html("Please Wait");
        $("#submit-error").html("")
        $.ajax(
        {
            type:'POST',
            url: $(this).attr('action'),
            data: theForm,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            success:function(response)
            {
                $("#donationCampEditForm").prop('disabled', false);
                $("#donationCampEditFormSubmit").html("Save Changes");
                if(response.error == '0'){
                    $("#donationCampEditForm").trigger('reset');
                    var functionAfterExecute = function(){
                        $("[data-target='#step-1-form']").addClass('current active');
                        $("[data-target='#step-1-form']").removeClass('undone');
                        $("[data-target='#step-1-form']").removeClass('done');
                        $("[data-target='#step-1-form']").attr('data-status', 'current');

                        $("[data-target='#step-2-form']").removeClass('active');
                        $("[data-target='#step-2-form']").removeClass('done');
                        $("[data-target='#step-2-form']").removeClass('current');
                        $("[data-target='#step-2-form']").addClass('undone');
                        $("[data-target='#step-2-form']").attr('data-status', 'undone');

                        $("[data-target='#step-3-form']").removeClass('active');
                        $("[data-target='#step-3-form']").removeClass('done');
                        $("[data-target='#step-3-form']").removeClass('current');
                        $("[data-target='#step-3-form']").addClass('undone');
                        $("[data-target='#step-3-form']").attr('data-status', 'undone');

                        $("#mobile-verification").trigger('reset');

                        $('.form-box').removeClass('active');
                        $("#step-1-form").addClass('active');
                    }
                    showSingleButtonAlert('Event Changed', `We successfully changed the event details`, 'Okay', functionAfterExecute);
                }
                else if(response.error == '1'){
                    $("#submit-error").html(response.message)
                }
                else{
                    $("#submit-error").html("Error occurred. Try again!")
                }
            },
            error:function(response)
            {
                $("#donationCampEditForm").prop('disabled', false);
                $("#donationCampEditFormSubmit").html("Save Changes");
                $("#submit-error").html("Error occurred. Please try again!")
            },
        });
    }
});

$("#donationCampEditForm").on('reset', function(){
    $("#District").html(`<option label="Select District"></option>`);
    $("#donationCampEditForm").prop('disabled', false);
    $("#donationCampEditFormSubmit").html("Save Changes");
    $(".feedback").html('');
    $("#cancel-error").html('');
    $("#submit-error").html('');
});

function cancelEvent(){
    $("#cancel-error").html('');
    if(otpVerified){
        $("#cancel-event").prop('disabled', true);
        $("#cancel-event").html('Please Wait');
        $.ajax(
        {
            type:'POST',
            url:"/blood-donation-camp-cancel/",
            data:{
                'id':$("#id").val(),
                'otp': $("#event-edit-otp").val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success:function(response)
            {
                $("#cancel-event").prop('disabled', false);
                if(response.error == '0'){
                    $("#donationCampEditForm").trigger('reset');
                    var functionAfterExecute = function(){
                        $("[data-target='#step-1-form']").addClass('current active');
                        $("[data-target='#step-1-form']").removeClass('undone');
                        $("[data-target='#step-1-form']").removeClass('done');
                        $("[data-target='#step-1-form']").attr('data-status', 'current');

                        $("[data-target='#step-2-form']").removeClass('active');
                        $("[data-target='#step-2-form']").removeClass('done');
                        $("[data-target='#step-2-form']").removeClass('current');
                        $("[data-target='#step-2-form']").addClass('undone');
                        $("[data-target='#step-2-form']").attr('data-status', 'undone');

                        $("[data-target='#step-3-form']").removeClass('active');
                        $("[data-target='#step-3-form']").removeClass('done');
                        $("[data-target='#step-3-form']").removeClass('current');
                        $("[data-target='#step-3-form']").addClass('undone');
                        $("[data-target='#step-3-form']").attr('data-status', 'undone');

                        $("#mobile-verification").trigger('reset');

                        $('.form-box').removeClass('active');
                        $("#step-1-form").addClass('active');
                    }
                    showSingleButtonAlert('Event Postponed', `We successfully Postponed the event`, 'Okay', functionAfterExecute);
                }
                else{
                    $("#cancel-event").html('Postpone The Event');
                    $("#cancel-error").html("Error occurred. Please try again!")
                }
            },
            error:function(response)
            {
                $("#cancel-event").prop('disabled', false);
                $("#cancel-event").html('Postpone The Event');
                $("#cancel-error").html("Error occurred. Try again!")
            },
        });
    }
};


$("#cancel-event").on('click', function(){
    message = "Do you want to postpone the event?"
    twoButtonAlert(message, 'No', 'Yes', cancelEvent)
});


var today = new Date().toISOString().split('T')[0];
$("#Start_Date").attr('min', today);

var today = new Date()
today.setDate(today.getDate() + 1);
today = today.toISOString().split('T')[0];
$("#End_Date").attr('min', today);


var startDateValidationError = false;
var endDateValidationError = false;
var fromTimeValidationError = false;
var toTimevalidationError = false;
$("#Start_Date").on('change', function(){
    let start_date = $(this).val();
    start_date = new Date(start_date);
    start_date.setDate(start_date.getDate() + 1);
    min_end_date = start_date.toISOString().split('T')[0];
    $("#End_Date").attr('min', min_end_date);

    startDateValidation();
    endDateValidation();
});
$("#End_Date").on('change', function(){
    startDateValidation();
    endDateValidation();
});
function startDateValidation(){
    startDateValidationError = false;
    $("#Start_Date-error").html(``)
    let startDate = $("#Start_Date").val();
    startDate = new Date(startDate);
    let endDate = $("#End_Date").val();
    if(fromTimeValidationError == false && toTimevalidationError == false){
        $("#donationCampEditFormSubmit").prop('disabled', false);
    }
    if(endDate != ''){
        endDate = new Date(endDate);
        if(endDate - startDate <= 0){
            startDateValidationError = true;
            $("#donationCampEditFormSubmit").prop('disabled', true);
            $("#Start_Date-error").html(`Start date must be lower than End date.`)
        }
    }
}
function endDateValidation(){
    endDateValidationError = false;
    $("#End_Date-error").html(``)
    let startDate = $("#Start_Date").val();
    let endDate = $("#End_Date").val();
    endDate = new Date(endDate);
    if(fromTimeValidationError == false && toTimevalidationError == false){
        $("#donationCampEditFormSubmit").prop('disabled', false);
    }
    if(startDate != ''){
        startDate = new Date(startDate);
        if(endDate - startDate <= 0){
            endDateValidationError = true;
            $("#donationCampEditFormSubmit").prop('disabled', true);
            $("#End_Date-error").html(`End date must be greater than Start date.`);
        }
    }
}

$("#From").on('change', function(){
    let Time = $(this).val();
    $("#To").attr('min', Time);
    
    fromTimeValidation();
    toTimeValidation();
});
$("#To").on('change', function(){
    fromTimeValidation();
    toTimeValidation();
});
function fromTimeValidation(){
    fromTimeValidationError = false;
    $("#From-error").html(``)
    let fromTime = $("#From").val();
    fromTime = new Date(`1/1/1999 ${fromTime}`);
    let toTime = $("#To").val();
    if(startDateValidationError == false && endDateValidationError == false){
        $("#donationCampEditFormSubmit").prop('disabled', false);
    }
    if(toTime != ''){
        toTime = new Date(`1/1/1999 ${toTime}`);
        if(toTime - fromTime < 1800000){
            fromTimeValidationError = true;
            $("#donationCampEditFormSubmit").prop('disabled', true);
            $("#From-error").html(`From time must be lower than To time.`)
        }
    }
}
function toTimeValidation(){
    toTimevalidationError = false;
    $("#To-error").html(``)
    let fromTime = $("#From").val();
    let toTime = $("#To").val();
    toTime = new Date(`1/1/1999 ${toTime}`);
    if(startDateValidationError == false && endDateValidationError == false){
        $("#donationCampEditFormSubmit").prop('disabled', false);
    }
    if(fromTime != ''){
        fromTime = new Date(`1/1/1999 ${fromTime}`);
        if(toTime - fromTime < 1800000){ //30 minute in milisecond
            toTimevalidationError = true;
            $("#donationCampEditFormSubmit").prop('disabled', true);
            $("#To-error").html(`To time must be greater than From time.`)
        }
    }
}

$("#State").on('change', loadDistrict)
function loadDistrict(setDistrict='')
{
    state = $("#State").val();
    var select_dist = $("#State").attr("data-district_option");
    $(select_dist).html(`<option label="Select District" selected></option>`);
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
                $(select_dist).append(`<option value="${response.districts[i]}">${response.districts[i]}</option>`);
            }
            if(setDistrict != ''){
                $(select_dist).val(setDistrict);
            }
        },
    });
}