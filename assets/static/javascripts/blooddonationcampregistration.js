var interval1;
var sendNumber = undefined
var verifiedNumber = undefined
var countDown1 =''
var otpVerified = false;
function resendTimer(t1)
{
    interval1 = setInterval(function(){
        if(t1 <= 0)
        {
            $("#resend-otp").show();
            $("#resend-otp-message").hide();
            $("#reset-btn").show();
            $("#reset-btn").prop('disabled', false);
            clearInterval(interval1);
            countDown1 = "off"
        }
        else if(t1 > 0)
        {
            $("#resend-otp").show();
            $("#resend-otp-message").show();
            $("#reset-btn").hide();
            $("#reset-btn").prop('disabled', true);
            document.getElementById("resend-otp-timer").innerHTML = `${t1}s`
            t1 = t1 - 1;
            countDown1 = "on"
        }
    }, 1000);
    return 0;
}
$("#reset-btn").on('click', function(){
    $("#reset-btn").prop('disabled', true);
    otpVerified = false;
    $("#otp-sent-to").html("");
    $("#OTP").val('');
    sendNumber = undefined;
    let contact = $("#Contact").val();
    $("#otp-error").html("");
    $("#reset-btn").html("Sending...")
    $("#campRegistrationSubmit").hide();
    $("#otp-verify").prop('disabled', false);
    $("#otp-verify").html('Verify');
    clearInterval(interval1);
    if(contact.length < 10 || contact.length > 10){
        $("#otp-error").html("Please enter valid mobile no");
        $("#reset-btn").html("Resend OTP");
    }
    else{
        $.ajax({
            type:'POST',
            url:"/send-otp-blood-donation/",
            data:{
                'contact':contact,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                $("#reset-btn").html("Resend OTP");
                if(response.error == '0'){
                    sendNumber = contact;
                    $("#otp-sent-to").html(`New OTP sent to ${response.contact}`);
                    t = 120;
                    resendTimer(t);
                }
                else{
                    $("#reset-btn").prop('disabled', false);
                    $("#otp-error").html("Error occurred. Try again!");
                }
            },
            error: function(response){
                $("#reset-btn").html("Resend OTP");
                $("#reset-btn").prop('disabled', false);
                $("#otp-error").html("Error occurred. Try again!");
            }
        });
    }
})

$("#otp-generate").on('click', function(){
    $('#otp-generate').prop('disabled', true);
    otpVerified = false;
    $("#otp-sent-to").html("");
    sendNumber = undefined;
    $("#resend-otp").hide();
    let contact = $("#Contact").val();
    $("#otp-error").html("");
    $("#otp-sent-to").html("");
    $('#otp-generate').html("Generating...");
    $("#campRegistrationSubmit").hide();
    $("#otp-verify").prop('disabled', false);
    $("#otp-verify").html('Verify');
    $(".row-verify-otp").hide();
    $("#resend-otp").hide();
    $("#resend-otp-message").hide()
    $("#reset-btn").hide();
    clearInterval(interval1);
    if(contact.length != 10){
        $("#otp-error").html("Please enter valid 10 digit mobile no");
        $('#otp-generate').html("Generate OTP");
    }
    else{
        $.ajax({
            type:'POST',
            url:"/send-otp-blood-donation/",
            data:{
                'contact':contact,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                $('#otp-generate').html("Generate OTP");
                if(response.error == '0'){
                    sendNumber = contact;
                    $('#otp-generate').hide();
                    $("#otp-sent-to").html(`OTP sent to ${response.contact}`);
                    $(".row-verify-otp").show();
                    t = 120;
                    resendTimer(t);
                }
                else{
                    $('#otp-generate').prop('disabled', false);
                    $("#otp-error").html("Error occurred. Try again!");
                }
            },
            error: function(response){
                $('#otp-generate').html("Generate OTP");
                $('#otp-generate').prop('disabled', false);
                $("#otp-error").html("Error occurred. Try again!");
            }
        });
    }
});

$("#otp-verify").on('click', function(){
    $("#otp-verify").prop('disabled', true);
    $("#otp-verify").html('Verifying');
    $("#otp-error").html("");
    verifiedNumber = undefined;
    let contact = $("#Contact").val();
    let otp = $("#OTP").val();
    if(otp.length < 6){
        $("#otp-error").html("Please enter 6 digit valid OTP");
        $("#otp-verify").prop('disabled', false);
        $("#otp-verify").html('Verify');
    }
    else{
        $.ajax({
            type:'POST',
            url:"/verify-otp-blood-donation/",
            data:{
                'contact':contact,
                'otp': otp,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                $("#otp-verify").html('Verify');
                if(response.error == '0'){
                    $("#otp-sent-to").html('');
                    verifiedNumber = contact;
                    otpVerified = true;
                    $(".row-verify-otp").hide();
                    $("#campRegistrationSubmit").show();
                }
                else if(response.error == '1'){
                    $("#otp-verify").prop('disabled', false);
                    $("#otp-error").html("Invalid OTP!");
                }
            },
            error: function(response){
                $("#otp-error").html("Failed to verify OTP. Try again!");
                $("#otp-verify").prop('disabled', false);
                $("#otp-verify").html('Verify');
            }
        });
    }
});

$("#OTP").on('keyup', function(){
    value = $(this).val();
    if(value.length == 6){
        $("#otp-verify").prop('disabled', false);
    }
    else{
        $("#otp-verify").prop('disabled', true);
    }
});

$("#campRegistration").on('submit', function(event){
    event.preventDefault()
    if(otpVerified){
        let theForm = new FormData(this)
        let csrf = $('input[name=csrfmiddlewaretoken]').val()
        theForm.append('csrfmiddlewaretoken', csrf);
        $(this).prop('disabled', true);
        $("#campRegistrationSubmit").html("Submiting.....");
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
                $("#campRegistration").prop('disabled', false);
                $("#campRegistrationSubmit").html("Submit");
                if(response.error == '0'){
                    $("#campRegistration").trigger('reset');
                    $('#otp-generate').prop('disabled', false);
                    showSingleButtonAlert('Event Created', `We will send the event details to everybody`, 'Okay');
                }
                else if(response.error == '2'){
                    $("#otp-generate").show();
                    $("#campRegistrationSubmit").hide();
                    $("#otp-error").html('Please send OTP to verify mobile no');
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
                $("#campRegistration").prop('disabled', false);
                $("#campRegistrationSubmit").html("Submit");
                $("#submit-error").html("Error occurred. Try again!")
            },
        });
    }
});

$("#campRegistration").on('reset', function(){
    $("#District").html(`<option label="Select District"></option>`);
    $("#campRegistration").prop('disabled', false);
    $("#campRegistrationSubmit").html("Submit");
    $(".feedback").html('');
    $("#submit-error").html('');
    $(".row-verify-otp").hide();
    $("#resend-otp").hide();
    $("#resend-otp-message").hide();
    $("#reset-btn").hide();
    $("#campRegistrationSubmit").hide();
    $("#otp-generate").show();
    verifiedNumber = undefined;
    sendNumber = undefined;
    otpVerified = true;
});



$("#Contact").on('keyup', function(){
    let contact = $(this).val();
    $("#otp-error").html("");
    $("#otp-sent-to").html("");
    if(contact === verifiedNumber){
        $("#campRegistrationSubmit").show();
        $(".row-verify-otp").hide();
        $("#otp-generate").hide();
        otpVerified = true
    }
    else if(contact === sendNumber){
        $("#otp-generate").hide();
        $(".row-verify-otp").show();
        otpVerified = false
    }
    else{
        $("#campRegistrationSubmit").hide();
        $(".row-verify-otp").hide();
        $("#otp-generate").show();
        $("#otp-generate").prop('disabled', false);
        otpVerified = false
    }
})


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
        $("#campRegistrationSubmit").prop('disabled', false);
    }
    if(endDate != ''){
        endDate = new Date(endDate);
        if(endDate - startDate <= 0){
            startDateValidationError = true;
            $("#campRegistrationSubmit").prop('disabled', true);
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
        $("#campRegistrationSubmit").prop('disabled', false);
        $("#otp-generate").prop('disabled', false);
    }
    if(startDate != ''){
        startDate = new Date(startDate);
        if(endDate - startDate <= 0){
            endDateValidationError = true;
            $("#campRegistrationSubmit").prop('disabled', true);
            $("#otp-generate").prop('disabled', true);
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
        $("#campRegistrationSubmit").prop('disabled', false);
        $("#otp-generate").prop('disabled', false);
    }
    if(toTime != ''){
        toTime = new Date(`1/1/1999 ${toTime}`);
        if(toTime - fromTime < 1800000){ //30 minute in milisecond
            fromTimeValidationError = true;
            $("#campRegistrationSubmit").prop('disabled', true);
            $("#otp-generate").prop('disabled', true);
            $("#From-error").html(`From time must be at least 30 minutes lower than To time.`)
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
        $("#campRegistrationSubmit").prop('disabled', false);
        $("#otp-generate").prop('disabled', false);
    }
    if(fromTime != ''){
        fromTime = new Date(`1/1/1999 ${fromTime}`);
        if(toTime - fromTime < 1800000){
            toTimevalidationError = true;
            $("#campRegistrationSubmit").prop('disabled', true);
            $("#otp-generate").prop('disabled', true);
            $("#To-error").html(`To time must be at least 30 minutes greater than From time.`)
        }
    }
}

$("#State").on('change', loadDistrict)
function loadDistrict()
{
    state = $(this).val();
    var select_dist = $(this).attr("data-district_option");
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
        },
    });
}