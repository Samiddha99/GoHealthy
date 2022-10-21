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


$(".registration-div").on('reset', "#bloodBankRegistration", function(){
    
});
$(".registration-div").on('submit', "#bloodBankRegistration", function(event){
    event.preventDefault();
    if(mobileOtpSent && emailOtpSent){
        $("#bloodBankID").val('');
        $('#registerMessage').html("");
        let bankLat = $("#selectedLatitude").val();
        let bankLng = $("#selectedLongitude").val();
        if(bankLat == '' || bankLng == ''){
            $('#registerMessage').html("Please pick blood banks's location");
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
            $("#bloodBankRegistration :input").prop("disabled", true);
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
                        $("#id_blood_bank").html(response.bloodBankID);
                        targetURL = response.next_step_url;
                        sendRequest({url: targetURL})
                            .then( function(response1) {
                                var title = $(response1).filter("title").html();
                                history.pushState({page: 2}, title, targetURL);
                                $(".registration-div").html($(response1).find(".registration-div").html());
                                onLoadOtpVerification();
                            }, function(error){
                                console.log(error);
                                $$("#formSubmitBtn").html('Next');
                                $("#bloodBankRegistration :input").prop("disabled", false);
                            });
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                    }
                    else{
                        $("#formSubmitBtn").html('Next');
                        $("#bloodBankRegistration :input").prop("disabled", false);
                        if(response.error == '001' || response.error == '002'){
                            $("#registerMessage").html(response.message)
                        }
                        else if(response.error == '003'){
                            $('#registerMessage').html(response.message);
                            if(response.OTPinvalidFor.includes('Mobile')){
                                $('#register-blood-bank-otp-mobile').addClass('is-invalid');
                                $('#mobileotpvalidation').html("Invalid OTP");
                            }
                            if(response.OTPinvalidFor.includes('Email')){
                                $('#register-blood-bank-otp-email').addClass('is-invalid');
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
                                    $('#register-blood-bank-username').removeClass('is-valid');
                                    $('#register-blood-bank-username').addClass('is-invalid');
                                    $('#usernamevalidation').html(message);
                                }

                                if(error == '2'){
                                    $('#emailvalidation').removeClass('feedback-valid');
                                    $('#emailvalidation').addClass('feedback-invalid');
                                    $('#register-blood-bank-email').removeClass('is-valid');
                                    $('#register-blood-bank-email').addClass('is-invalid');
                                    $('#emailvalidation').html(message);
                                }

                                if(error == '3'){
                                    $('#mobilevalidation').removeClass('feedback-valid');
                                    $('#mobilevalidation').addClass('feedback-invalid');
                                    $('#register-blood-bank-mobile').removeClass('is-valid');
                                    $('#register-blood-bank-mobile').addClass('is-invalid');
                                    $('#mobilevalidation').html(message);
                                }

                                if(error == '4')
                                {
                                    $('#passwordcheck').removeClass('feedback-valid');
                                    $('#passwordcheck').addClass('feedback-invalid');
                                    $('#register-blood-bank-password2').removeClass('is-valid');
                                    $('#register-blood-bank-password2').addClass('is-invalid');
                                    $("passwordcheck").html(message);
                                }

                                if(error == '5')
                                {
                                    $('#checkpassword').removeClass('feedback-valid');
                                    $('#checkpassword').addClass('feedback-invalid');
                                    $('#register-blood-bank-password1').removeClass('is-valid');
                                    $('#register-blood-bank-password1').addClass('is-invalid');
                                    $("checkpassword").html("Password doesn't follow the rules");
                                }

                                if(error == '6')
                                {
                                    $('#registration_no-error').removeClass('feedback-valid');
                                    $('#registration_no-error').addClass('feedback-invalid');
                                    $('#register-blood-bank-registration_no').removeClass('is-valid');
                                    $('#register-blood-bank-registration_no').addClass('is-invalid');
                                    $('#registration_no-error').html(message);
                                }

                                if(error == '7' || error == '8'){
                                    $("#registration_document").addClass('is-invalid');
                                    $("#registration_document-error").addClass('feedback-invalid');
                                    $('registration_document-error').html(message)
                                }
                            }
                        }
                    }
                },
                error: function(response)
                {
                    $("#formSubmitBtn").html('Next');
                    $('#registerMessage').html("Failed to Register yourself. Try Again!");
                    $("#bloodBankRegistration :input").prop("disabled", false);
                }
            });
        }
    }
    else{
        $("#registerMessage").html(`Please send OTP to verify contact info`)
    }
});


$(".registration-div").on('reset', "#bloodBankRegistrationAddBlood", function(){
    $("#registerDoneError").html('');
});
$(".registration-div").on('submit', "#bloodBankRegistrationAddBlood", function(event){
    event.preventDefault();
    let theForm = new FormData(this);
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    emailOTP = $("#email_verification-otp").val(),
    mobileOTP = $("#mobile_verification-otp").val(),
    theForm.append('csrfmiddlewaretoken', csrf);
    theForm.append('emailOTP', emailOTP);
    theForm.append('mobileOTP', mobileOTP);

    $("#doneRegistration").prop('disabled', true);
    $("#doneRegistration").html('Submiting...');
    $("#registerDoneError").html('');
    $.ajax({
        type:'POST',
        url: $(this).attr('action'),
        data: theForm,
        contentType: false,
        processData: false,
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
});


$(".registration-div").on('click', "#mobile-otp-send-btn", mobileOtpSend);
function mobileOtpSend(){
    let mobile = $("#register-blood-bank-mobile").val();
    $("#mobilevalidation").removeClass('feedback-valid');
    $("#mobilevalidation").removeClass('feedback-invalid');
    $("#mobilevalidation").html(``);
    $("#mobileotpvalidation").html('');
    if(mobile.length == 10){
        $("#mobile-otp-sent-to").html('');
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
                    $("#register-blood-bank-otp-mobile").val('');
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
    let email = $("#register-blood-bank-email").val();
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
                $("#register-blood-bank-otp-email").val('');
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
    password1 = $('#register-blood-bank-password1').val()
    password2 = $('#register-blood-bank-password2').val()
    document.getElementById('passwordcheck').innerHTML = ""

    if(password1 == '' || password2 == '')
    {
        $('#register-blood-bank-password2').removeClass('is-invalid');
        $('#register-blood-bank-password2').removeClass('is-valid');
        $("#passwordcheck").removeClass('feedback-invalid');
        $("#passwordcheck").removeClass('feedback-valid');
        document.getElementById('passwordcheck').innerHTML = ""
    }
    else if(password1 === password2)
    {
        $('#register-blood-bank-password2').removeClass('is-invalid');
        $('#register-blood-bank-password2').addClass('is-valid');
        $("#passwordcheck").removeClass('feedback-invalid');
        $("#passwordcheck").addClass('feedback-valid');
        document.getElementById('passwordcheck').innerHTML = "Password and Confirm Password matched!"
    }
    else if(password1 != password2)
    {
        $('#register-blood-bank-password2').removeClass('is-valid');
        $('#register-blood-bank-password2').addClass('is-invalid');
        $("#passwordcheck").addClass('feedback-invalid');
        $("#passwordcheck").removeClass('feedback-valid');
        document.getElementById('passwordcheck').innerHTML = "Password and Confirm Password didn't match!"
    }
}
$(".registration-div").on('keyup', "#register-blood-bank-password1", passwordmatch)
$(".registration-div").on('keyup', "#register-blood-bank-password2", passwordmatch)


function PasswordValidation()
{
    $("#register-blood-bank-password1").removeClass("is-valid");
    $("#register-blood-bank-password1").removeClass("is-invalid");
    document.getElementById("register-blood-bank-password2").disabled = true;
    document.getElementById('checkpassword').innerHTML = "";
    let password = $('#register-blood-bank-password1').val();
    var isFocused = $('#register-blood-bank-password1').is(':focus');
    if(password != '' || isFocused){
        $.ajax({
            type:'POST',
            url: "/check-password/",
            data: {
                password: password,
                username: $('#register-blood-bank-username').val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                if(response.password_error == 'No Error')
                {
                    $("#register-blood-bank-password1").addClass("is-valid");
                    document.getElementById("register-blood-bank-password2").disabled = false;
                }
                else
                {
                    $('#register-blood-bank-password1').addClass('is-invalid');
                    document.getElementById('checkpassword').innerHTML = `Password must be fulfill the below rules`;
                }
            },
        });
    }
}
$(".registration-div").on('keyup', "#register-blood-bank-username", PasswordValidation)
$(".registration-div").on('keyup', "#register-blood-bank-password1", PasswordValidation)


$(".registration-div").on('keyup', "#register-blood-bank-otp-email", function(){
    $(this).removeClass('is-invalid');
    $("#emailotpvalidation").html("");
});
$(".registration-div").on('keyup', "#register-blood-bank-otp-mobile", function(){
    $(this).removeClass('is-invalid');
    $("#mobileotpvalidation").html("");
});

$(".registration-div").on('keyup', "#register-blood-bank-username", UsernameCheck)
function UsernameCheck(){
    user = $('#register-blood-bank-username').val();
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
            $('#register-blood-bank-username').addClass('is-invalid');
            $("#usernamevalidation").addClass('feedback-invalid');
            $('#register-blood-bank-username').removeClass('is-valid');
            $("#usernamevalidation").removeClass('feedback-valid');
            document.getElementById('usernamevalidation').innerHTML = data.message;
        }
        else
        {
            document.getElementById('usernamevalidation').innerHTML = "";
            $('#register-blood-bank-username').removeClass('is-invalid');
            $("#usernamevalidation").removeClass('feedback-invalid');
            $("#register-blood-bank-username").addClass('is-valid');
        }
        },
    });
}


$(".registration-div").on('keyup', "#register-blood-bank-mobile", function(){
    $('#register-blood-bank-mobile').removeClass('is-invalid');
    $('#register-blood-bank-mobile').removeClass('is-valid');
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

$(".registration-div").on('keyup', "#register-blood-bank-email", emailcheck);
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

        $('#register-blood-bank-email').removeClass('is-invalid');
        $('#register-blood-bank-email').removeClass('is-valid');
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
            $('#register-blood-bank-email').removeClass('is-valid');
            $('#register-blood-bank-email').addClass('is-invalid');
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
                            $('#register-blood-bank-email').removeClass('is-valid');
                            $('#register-blood-bank-email').addClass('is-invalid');
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


$(".registration-div").on('change', "#register-blood-bank-state", loadDistrict)
function loadDistrict()
{
    state = $(this).val();
    $("#register-blood-bank-district").html(`<option label="Select District" selected></option>`);
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
                $("#register-blood-bank-district").append(`<option value="${response.districts[i]}">${response.districts[i]}</option>`);
            }
        },
    });
}

$(".registration-div").on('keyup', "#register-blood-bank-pin", loadAddress);
function loadAddress()
{
    pin = $(this).val();
    $("#register-blood-bank-pin").removeClass('is-valid');
    $("#register-blood-bank-pin").removeClass('is-invalid');
    if(pin.length == 6)
    {
        document.getElementById('formSubmitBtn').disabled = true;
        document.getElementById('pinLoader').style.visibility = 'visible';
        var select = document.getElementById("register-blood-bank-district");
        select.options.length = 0;
        $('#register-blood-bank-state').val('');
        $('#register-blood-bank-district').val('');
        $('#register-blood-bank-subdivision').val('');
        $('#register-blood-bank-city').val('');
        $('#register-blood-bank-state').prop('disabled', true)
        $('#register-blood-bank-district').prop('disabled', true)
        $('#register-blood-bank-subdivision').prop('disabled', true)
        $('#register-blood-bank-city').prop('disabled', true)
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
                $("#register-blood-bank-pin").removeClass('is-invalid');
                $("#register-blood-bank-pin").addClass('is-valid');

                document.getElementById('formSubmitBtn').disabled = false;
                
                $('#subdivision').val(response.city);
                $('#state').val();
                $('#register-blood-bank-state').val(response.state);
                $('#register-blood-bank-subdivision').val(response.division);
                $('#register-blood-bank-city').val(response.city);
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
                    $("#register-blood-bank-district").prepend(`<option label="Select District" selected></option>`);
                }
                $('#register-blood-bank-state').prop('disabled', false)
                $('#register-blood-bank-district').prop('disabled', false)
                $('#register-blood-bank-subdivision').prop('disabled', false)
                $('#register-blood-bank-city').prop('disabled', false)
            },
            error: function(response)
            {
                $('#register-blood-bank-state').prop('disabled', false)
                $('#register-blood-bank-district').prop('disabled', false)
                $('#register-blood-bank-subdivision').prop('disabled', false)
                $('#register-blood-bank-city').prop('disabled', false)
                document.getElementById('formSubmitBtn').disabled = false;
                document.getElementById('pinLoader').style.visibility = 'hidden';
            }
        });

    }
    else{
        $("#register-blood-bank-pin").removeClass('is-valid');
        $("#register-blood-bank-pin").addClass('is-invalid');
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

$(window).on("popstate", function () {
    location.reload();
});