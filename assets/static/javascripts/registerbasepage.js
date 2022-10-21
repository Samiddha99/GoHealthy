var action = ''
var OTPemail = 'not verified';
var OTPmobile = 'not verified';



var activeSection = document.querySelector(".div-form").getAttribute('id');
$(".btn-choice").prop('disabled', false);
$(`[data-target='#${activeSection}']`).prop('disabled', true);

$(".reg-choice-btn").removeClass("active");
$(`#${activeSection}_a`).addClass("active");


function registrationForm({JQuerySelector=this, customSelector=false}={}){
    $("#donorRegisterModal").modal('hide');
    $("#loading-error").html('');

    var targetURL = $(JQuerySelector).attr('data-href');
    var registration = $(JQuerySelector).attr("data-value");

    $(".btn-register").prop('disabled', false);
    $(JQuerySelector).prop('disabled', true);
    $(".reg-choice-btn").removeClass("active");
    data_target = $(JQuerySelector).attr('data-target')
    $(`${data_target}_a`).addClass('active');

    $("#div_registration-form").css('display', 'none');
    $(".form-background").addClass('loading')

    $('#donorEligibilityBtn').off('click');
    $('input[name="eligibiltyCheck"]').off('change');
    $(".more-scripts").remove();
    sendRequest({url: targetURL})
        .then( function(response) {
            let responsedHTML = $.parseHTML(response)
            var title = $(response).filter("title").html();
            document.title = title;
            if(! customSelector){
                history.pushState({page: 2}, title, targetURL);
            }
            $("#div_registration-form").html($(response).find(".div-form").html());
            var src = ($(response).filter(".more-scripts"));
            if((src[0] != undefined)){
                let newScript = document.createElement("script");
                newScript.src = src[0]['src'];
                newScript.classList.add("more-scripts");;
                body.append(newScript)
            }

            $(".form-background").removeClass('loading');
            $("#div_registration-form").css('display', 'block');
        }, function(error){
            console.log(error);
            $(".form-background").removeClass('loading');
            $("#loading-error").html('Ops! Something went wrong.');
        });
}
$(".btn-register").on('click', registrationForm)

$(window).on("popstate", function () {
    let targrtUrl = document.location.pathname
    registrationForm({JQuerySelector: `[data-href='${targrtUrl}']`, customSelector: true});
});


var interval1;
var countDown1 = "off";
var otpSendToMobile = undefined;
var otpSendToEmail = undefined;
function timer1(t1)
{
    interval1 = setInterval(function(){
        sendButton = document.getElementById("emailOtpResendBtn")
        if(sendButton == null || sendButton == undefined){
            clearInterval(interval1);
            countDown1 = "off"
        }
        else if(t1 <= 0)
        {
            sendButton.disabled = false;
            sendButton.innerHTML = "Resend OTP";
            clearInterval(interval1);
            countDown1 = "off"
            return 0;
        }
        else if(t1 > 0)
        {
            sendButton.disabled = true;
            sendButton.innerHTML = `Resend OTP in ${t1}s`
            t1 = t1 - 1;
            countDown1 = "on"
        }
    }, 1000);
    return 0;
}

var interval2;
var countDown2 = "off"
function timer2(t2)
{
    interval2 = setInterval(function(){
        sendButton = document.getElementById("mobileOtpResendBtn")
        if(sendButton == null || sendButton == undefined){
            clearInterval(interval2);
            countDown2 = "off"
        }
        else if(t2 <= 0)
        {
            sendButton.disabled = false;
            sendButton.innerHTML = "Resend OTP";
            clearInterval(interval2);
            countDown2 = "off"
            return 0;
        }
        else if(t2 > 0)
        {
            sendButton.disabled = true;
            sendButton.innerHTML = `Resend OTP in ${t2}s`
            t2 = t2 - 1;
            countDown2 = "on"
        }
    }, 1000);
    return 0;
}



$("#div_registration-form").on('keyup', "#contact", function(){
    action = 'otp not verified';
    OTPmobile = 'not verified'
    $(".otp-enter-input").val("");
    if($(this).val().length == 10){
        $("#contact-verify-open").prop('disabled', false)
    }
    else{
        $("#contact-verify-open").prop('disabled', true)
    }
    if(OTPmobile = 'Verified'){
        $("#contact-verify-open").html('Verify');
    }
})



$("#div_registration-form").on('keyup', ".otp-enter-input", function(event){
    currentField = Number($(this).attr('data-field'));
    fieldFor = $(this).attr('data-otp');
    if(currentField < 6 && $(this).val().length >= 1)
    {
        $(`#${fieldFor}-otp-${currentField+1}`).focus();
    }
});
$('#div_registration-form').on('keydown', ".otp-enter-input", function(event){
    currentField = Number($(this).attr('data-field'));
    fieldFor = $(this).attr('data-otp');
    if(event.key === 'Backspace'){
        fieldValue = $(this).val();
        if(fieldValue.length <= 0 && currentField > 1){
            $(`#${fieldFor}-otp-${currentField}`).blur();
            $(`#${fieldFor}-otp-${currentField-1}`).focus();
        }
    }
})



$("#div_registration-form").on('click', "#mobile-otp-close", function(){
    $("#contact-verifyModal").modal('hide');
    document.getElementById("contact").focus();
});
$("#div_registration-form").on('click', "#email-otp-close", function(){
    $("#email-verifyModal").modal('hide');
    document.getElementById("email").focus();
});

$("#div_registration-form").on('shown.bs.modal', "#contact-verifyModal", function(){
    document.getElementById('mobile-otp-1').focus();
});
$("#div_registration-form").on('shown.bs.modal', "#email-verifyModal", function(){
    document.getElementById('email-otp-1').focus();
});

function otpsend(forMobile, forEmail)
{
    var sendTo = ''
    var email = $('#email').val();
    var contact = $('#contact').val();
    document.getElementById('email-otp-validate-error').innerHTML = "";
    document.getElementById('contact-otp-validate-error').innerHTML = "";
    $(".otp-validate").prop('disabled', true);

    if(forEmail == 'yes' && forMobile != 'yes')
    {
        clearInterval(interval1);
        timer1(0)
        sendTo = 'email';
        $("#email_id_text").html(`Sending OTP....`);
        $("#email-otp-validate-error").html("");
    }
    else if(forEmail != 'yes' && forMobile == 'yes')
    {
        clearInterval(interval2);
        timer2(0)
        sendTo = 'mobile';
        $("#mobile_no_text").html(`Sending OTP....`);
        $("#contact-otp-validate-error").html("");
    }
    $.ajax(
    {
        type:'POST',
        url: "/send-otp-register/",
        data:{
            contact: contact,
            email: email,
            sendTo: sendTo,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            action = 'otp not verified';
            if(forEmail == 'yes' && forMobile != 'yes')
            {
                document.getElementById("email-otp-1").focus();
                $("[data-otp='email']").val("");
                OTPemail = 'not verified';
                otpSendToEmail = email;
                $("#email_id_text").html(email);
                clearInterval(interval1);
                let sec1 = 120;
                timer1(sec1);
            }
            else if(forEmail != 'yes' && forMobile == 'yes')
            {
                document.getElementById('mobile-otp-1').focus();
                $("[data-otp='mobile']").val("");
                OTPmobile = 'not verified';
                otpSendToMobile = contact
                $("#mobile_no_text").html(contact);
                clearInterval(interval2);
                let sec2 = 120;
                timer2(sec2);
            }
            $(".otp-validate").prop('disabled', false);
            
        },
        error: function(response)
        {
            $(".otp-validate").prop('disabled', false);
        },
    });
}

$("#div_registration-form").on('click', "#contact-verify-open", function(){
    $("#contact-verifyModal").modal('show');
    let contact = $('#contact').val();
    if(contact != otpSendToMobile){
        otpsend(forMobile='yes', forEmail='no');
    }
});

$("#div_registration-form").on('click', "#mobileOtpResendBtn", function(){
    otpsend(forMobile='yes', forEmail='no');
});

$("#div_registration-form").on('click', "#email-verify-open", function(){
    $("#email-verifyModal").modal('show');
    let email = $('#email').val();
    if(email != otpSendToEmail){
        otpsend(forMobile='no', forEmail='yes');
    }
});

$("#div_registration-form").on('click', "#emailOtpResendBtn", function(){
    otpsend(forMobile='no', forEmail='yes');
});


function otpverify(forMobile, forEmail)
{
    let verificationFor = '';
    document.getElementById('email-otp-validate-error').innerHTML = ""
    document.getElementById('contact-otp-validate-error').innerHTML = ""
    if(forEmail == 'yes' && forMobile != 'yes')
    {
        document.getElementById('emailOtpVerifyBtn').innerHTML = "Validating....";
        document.getElementById('emailOtpVerifyBtn').disabled = true;
        var otp = '';
        for(i=1; i<=6; i++){
            otp += $(`#email-otp-${i}`).val()
        }
        verificationFor = 'Email'
    }
    else if(forEmail != 'yes' && forMobile == 'yes')
    {
        document.getElementById('mobileOtpVerifyBtn').innerHTML = "Validating....";
        document.getElementById('mobileOtpVerifyBtn').disabled = true;
        var otp = '';
        for(i=1; i<=6; i++){
            otp += $(`#mobile-otp-${i}`).val()
        }
        verificationFor = 'Mobile'
    }
    $.ajax(
    {
        type:'POST',
        url: "/verify-otp-register/",
        data:{
            otp: otp,
            email:$('#email').val(),
            contact:$('#contact').val(),
            verificationFor: verificationFor,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            if(response.error === "1")
            {
                action = 'otp not verified';
                if(forEmail == 'yes' && forMobile != 'yes')
                {
                    document.getElementById('email-otp-validate-error').innerHTML = response.message;
                    document.getElementById('emailOtpVerifyBtn').innerHTML = "Validate";
                    document.getElementById('emailOtpVerifyBtn').disabled = false;
                }
                else if(forEmail != 'yes' && forMobile == 'yes')
                {
                    document.getElementById('contact-otp-validate-error').innerHTML = response.message;
                    document.getElementById('mobileOtpVerifyBtn').innerHTML = "Validate";
                    document.getElementById('mobileOtpVerifyBtn').disabled = false;
                }
            }
            else if(response.error === "0")
            {
                if(forEmail == 'yes' && forMobile != 'yes')
                {
                    document.getElementById('emailOtpVerifyBtn').innerHTML = "Validate";
                    OTPemail = 'verified';
                    $("#email-verifyModal").modal('hide');
                    $("#email-verify-open").prop('disabled', true)
                    $("#email-verify-open").html("Verified");
                    clearInterval(interval2);
                    timer2(0);
                }
                else if(forEmail != 'yes' && forMobile == 'yes')
                {
                    document.getElementById('mobileOtpVerifyBtn').innerHTML = "Validate";
                    OTPmobile = 'verified';
                    $("#contact-verifyModal").modal('hide');
                    $("#contact-verify-open").prop('disabled', true);
                    $("#contact-verify-open").html("Verified");
                    clearInterval(interval1);
                    timer1(0);
                }
                if(OTPemail == 'verified' && OTPmobile == 'verified')
                {
                    action = "otp verified"
                }
                else
                {
                    action = "otp not verified";
                }
            }
        },
        error: function(response)
        {
            action = 'otp not verified';
            if(forEmail == 'yes' && forMobile != 'yes')
            {
                document.getElementById('email-otp-validate-error').innerHTML = "OTP validation Failed!";
                document.getElementById('emailOtpVerifyBtn').innerHTML = "Validate";
                document.getElementById('emailOtpVerifyBtn').disabled = false;
            }
            else if(forEmail != 'yes' && forMobile == 'yes')
            {
                document.getElementById('contact-otp-validate-error').innerHTML = "OTP validation Failed!";
                document.getElementById('mobileOtpVerifyBtn').innerHTML = "Validate";
                document.getElementById('mobileOtpVerifyBtn').disabled = false;
            }
        },
    });
}
$("#div_registration-form").on('click', "#mobileOtpVerifyBtn", function(){
    otpverify(forMobile="yes", forEmail="no")
})
$("#div_registration-form").on('click', "#emailOtpVerifyBtn", function(){
    otpverify(forMobile="no", forEmail="yes")
})


$("#div_registration-form").on('click', "#submit", function(event){
    event.preventDefault();
    ajaxRegisterFormSubmit();
});

$("#div_registration-form").on('submit', "#registrationForm", function(event){
    event.preventDefault();
    let errorInputField = document.getElementsByClassName("is-invalid1");
    console.log(errorInputField)
    console.log($("#is-invalid1"))
    if(errorInputField == undefined || errorInputField == null || errorInputField == ''){
        errorInputField.focus();
    }
    else{
        $("#submit-declarationModal").modal('show');
    }
});

function ajaxRegisterFormSubmit(){
    if(action == 'otp verified')
    {
        $('#registerMessage').html("");
        formField = document.getElementById("registrationForm")
        let theForm = new FormData(formField)
        let csrf = $('input[name=csrfmiddlewaretoken]').val()
        theForm.append('csrfmiddlewaretoken', csrf);
        $("#registrationForm :input").prop("disabled", true);
        $("#submit-declarationModal").modal('hide');
        $('.loading-image-background').css('display', 'block');
        document.body.style.overflowY = 'hidden';
        $.ajax(
        {
            type:'POST',
            url: $("#registrationForm").attr('action'),

            data: theForm,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            success:function(response)
            {
                $("#submit-declarationModal").modal('hide');
                $("#registrationForm :input").prop("disabled", false);
                $(".verify-open").prop('disabled', true);

                $('.loading-image-background').css('display', 'none');
                document.body.style.overflowY = 'auto';
                
                if(response.error == '0'){
                    document.getElementById('cardRegister').style.display = 'none';
                    document.getElementById('successMessage').innerHTML = "You have successfully registered as "+response.userType+" with username "+response.username;
                    document.body.scrollTop = 3;
                    document.documentElement.scrollTop = 3;
                    document.getElementById('successRegister').style.display = 'block';
                    $("#right_tick").removeClass('hidden');
                    $("#right_tick").addClass('visible');
                    $("#registrationForm").trigger('reset');
                    var audio = document.getElementById('successSound');
                    audio.volume = 0.5;
                    audio.play();
                    window.removeEventListener('beforeunload', function(){});
                }
                else if(response.error == '001' || response.error == '002'){
                    $("#registerMessage").html(response.message)
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
                            $('#username').removeClass('is-valid');
                            $('#username').addClass('is-invalid');
                            $('#usernamevalidation').html(message);
                        }

                        if(error == '2'){
                            $("#email-verify-open").prop('disabled', false);
                            $("#email-verify-open").html('Verify');
                            $('#emailvalidation').removeClass('feedback-valid');
                            $('#emailvalidation').addClass('feedback-invalid');
                            $('#emailvalidation').html(message);
                        }
                        else if(error == '3'){
                            $('#emailvalidation').removeClass('feedback-valid');
                            $('#emailvalidation').addClass('feedback-invalid');
                            $('#email').removeClass('is-valid');
                            $('#email').addClass('is-invalid');
                            $('#emailvalidation').html(message);
                        }

                        if(error == '4'){
                            $("#contact-verify-open").prop('disabled', false);
                            $("#contact-verify-open").html('Verify');
                            $('#contactvalidation').removeClass('feedback-valid');
                            $('#contactvalidation').addClass('feedback-invalid');
                            $('#contactvalidation').html(message);
                        }
                        else if(error == '5'){
                            $('#contactvalidation').removeClass('feedback-valid');
                            $('#contactvalidation').addClass('feedback-invalid');
                            $('#contact').removeClass('is-valid');
                            $('#contact').addClass('is-invalid');
                            $('#contactvalidation').html(message);
                        }

                        if(error == '6')
                        {
                            $('#passwordcheck').removeClass('feedback-valid');
                            $('#passwordcheck').addClass('feedback-invalid');
                            if(responseErrors[i]['validationError']){
                                $('#password1').removeClass('is-valid');
                                $('#password1').addClass('is-invalid');

                                html = ''
                                for(j=0; j<message.length; j++){
                                    if(j == message.length-1){
                                        html += `${message[j]['error_message']}`
                                    }
                                    else{
                                        html += `${message[j]['error_message']}<br>`
                                    }
                                }
                                document.getElementById('checkpassword').innerHTML = html;
                            }
                            else{
                                $('#password2').removeClass('is-valid');
                                $('#password2').addClass('is-invalid');
                                $('#passwordcheck').html(message);
                            }
                        }
                        if(error == '7' || error == '8')
                        {
                            $('#imageError').removeClass('feedback-valid');
                            $('#imageError').addClass('feedback-invalid');
                            $('#picture').removeClass('is-valid');
                            $('#picture').addClass('is-invalid');
                            $('#imageError').html(message);
                        }

                        if(error == '9'){
                            if(responseErrors[i].Registration_No_Not_Matched){
                                $('#registrationNovalidation').removeClass('feedback-valid');
                                $('#registrationNovalidation').addClass('feedback-invalid');
                                $('#registrationNo').removeClass('is-valid');
                                $('#registrationNo').addClass('is-invalid');
                                $('#registrationNovalidation').html(message);
                            }
                            else{
                                document.getElementById("registerMessage").innerHTML += message;
                            }
                        }

                        if(error == '10'){
                            $("#dobMessage").removeClass('feedback-valid');
                            $("#dobMessage").addClass('feedback-invalid');
                            $("#dob").removeClass('feedback-valid');
                            $("#dob").addClass('feedback-invalid');
                            $("#dobMessage").html(message);
                        }
                    }
                }
            },
            error: function(response)
            {
                $('.loading-image-background').css('display', 'none');
                document.body.style.overflowY = 'auto';
                $("#submit-declarationModal").modal('hide');
                $('#registerMessage').html("Failed to Register yourself. Try Again!");
                $("#registrationForm :input").prop("disabled", false);
                $(".verify-open").prop('disabled', true);
            }
        });
    }
}



var checkbox = false
$("#div_registration-form").on('change', "#permanent_state", loadDistrict);
$("#div_registration-form").on('change', "#state", loadDistrict);
function loadDistrict()
{
    var state = $(this).val();
    var districtId = $(this).attr('data-district_option');

    $("#"+districtId).html(`<option label="Select District" selected></option>`);
    $.ajax({
        url:"/get-district/",
        data:{
            'state':state,
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        {
            select_dist.options.length = 0;
            for(var i in response.districts)
            {
                $("#"+districtId).append(`<option value="${response.districts[i]}">${response.districts[i]}</option>`)
            }
        },
    });
}

$("#div_registration-form").on('keyup', "#permanent_pin", loadAddress);
$("#div_registration-form").on('keyup', "#pin", loadAddress);
function loadAddress()
{
    var arg = $(this).attr('data-address');
    if(arg == 'permanent')
    {
        var pin = $('#permanent_pin').val();
        $("#permanent_pin").removeClass("is-valid");
        $("#permanent_pin").removeClass("is-invalid");

        var select_state = document.getElementById("permanent_state");
        var select_dist = document.getElementById("permanent_district");
        var select_distJquery = $("#permanent_district");
    }
    else if(arg == 'current')
    {
        var pin = $('#pin').val();
        $("#pin").removeClass("is-valid");
        $("#pin").removeClass("is-invalid");

        var select_state = document.getElementById("state");
        var select_dist = document.getElementById("district");
        var select_distJquery = $("#district");
    }
    if(pin.length == 6)
    {
        select_dist.options.length = 0;
        if(arg == 'permanent')
        {
            document.getElementById("permanent_pinLoading").innerHTML = "<button class='btn btn-primary' type='button' disabled><span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Fetching Address...</button>"

            $('#permanent_city').val('');
            $('#permanent_subdivision').val('');
            $('#permanent_state').val('');

            $('#permanent_city').prop('disabled', true);
            $('#permanent_subdivision').prop('disabled', true);
            $('#permanent_state').prop('disabled', true);
            $('#permanent_district').prop('disabled', true);
        }
        else if(arg == 'current')
        {
            document.getElementById("current_pinLoading").innerHTML = "<button class='btn btn-primary' type='button' disabled><span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Fetching Address...</button>"

            $('#city').val('');
            $('#subdivision').val('');
            $('#state').val('');

            $('#city').prop('disabled', true);
            $('#subdivision').prop('disabled', true);
            $('#state').prop('disabled', true);
            $('#district').prop('disabled', true);
        }
        if(checkbox == true && arg == 'permanent')
        {
            $('#pin').val('');
            $('#city').val('');
            $('#subdivision').val('');
            $('#state').val('');
            $('#district').val('');
        }
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
                if(arg == 'permanent'){
                    document.getElementById("permanent_pinLoading").innerHTML = "";
                    $('#permanent_city').prop('disabled', false);
                    $('#permanent_subdivision').prop('disabled', false);
                    $('#permanent_state').prop('disabled', false);
                    $('#permanent_district').prop('disabled', false);
                }
                else if(arg == 'current'){
                    document.getElementById("current_pinLoading").innerHTML = "";
                    $('#city').prop('disabled', false);
                    $('#subdivision').prop('disabled', false);
                    $('#state').prop('disabled', false);
                    $('#district').prop('disabled', false);
                }
                if(response.status == 'Success')
                {
                    if(arg == 'permanent')
                    {
                        $('#permanent_city').val(response.city);
                        $('#permanent_subdivision').val(response.division);
                        $('#permanent_state').val(response.state);
                    }
                    else if(arg == 'current')
                    {
                        $('#city').val(response.city);
                        $('#subdivision').val(response.division);
                        $('#state').val(response.state);
                    }
                    for(var i in response.districts)
                    {
                        var opt = document.createElement('option');
                        opt.value = response.districts[i];
                        opt.innerHTML = response.districts[i];
                        select_dist.appendChild(opt);
                    }
                    if(response.districtFind){
                        select_dist.value = response.district;
                    }
                    else{
                        select_distJquery.prepend(`<option label="Select District" selected></option>`);
                    }
                    if(checkbox == true && arg == 'permanent')
                    {
                        let address = $('#permanent_address').val();
                        let pin = $('#permanent_pin').val();
                        let city = $('#permanent_city').val();
                        let subdivision = $('#permanent_subdivision').val();
                        let state = $('#permanent_state').val();
                        let district = $('#permanent_district').val();

                        $('#address').val(address);
                        $('#pin').val(pin);
                        $('#city').val(city);
                        $('#subdivision').val(subdivision);
                        $('#state').val(state);
                        let opts = $("#permanent_district").html();
                        $("#district").html(opts);
                        $("#district").val(district);
                    }
                }
                else
                {
                    if(arg == 'permanent')
                    {
                        $("#permanent_pin").removeClass("is-valid");
                        $("#permanent_pin").addClass("is-invalid");

                        $('#permanent_city').val('');
                        $('#permanent_subdivision').val('');
                        $('#permanent_state').val('');
                        $('#permanent_district').val('');
                    }
                    else if(arg == 'current')
                    {
                        $("#pin").removeClass("is-valid");
                        $("#pin").addClass("is-invalid");

                        $('#city').val('');
                        $('#subdivision').val('');
                        $('#state').val('');
                        $('#district').val('');
                    }
                    if(checkbox == true && arg == 'permanent')
                    {
                        $('#pin').val('');
                        $('#city').val('');
                        $('#subdivision').val('');
                        $('#state').val('');
                        $('#district').val('');
                    }
                }
            },
            error: function(response)
            {
                select_dist.options.length = 0;
                if(arg == 'permanent')
                {
                    document.getElementById("permanent_pinLoading").innerHTML = ""
                    $('#permanent_city').val('');
                    $('#permanent_subdivision').val('');
                    $('#permanent_state').val('');
                    $('#permanent_district').val('');
                }
                else if(arg == 'current')
                {
                    document.getElementById("current_pinLoading").innerHTML = ""
                    $('#city').val('');
                    $('#subdivision').val('');
                    $('#state').val('');
                    $('#district').val('');
                }
                if(checkbox == true && arg == 'permanent')
                {
                    $('#pin').val('');
                    $('#city').val('');
                    $('#subdivision').val('');
                    $('#state').val('');
                    $('#district').val('');
                }
            },
        });
    }
    else{
        select_dist.options.length = 0;
        if(arg == 'permanent')
        {
            $("#permanent_pin").removeClass("is-valid");
            $("#permanent_pin").addClass("is-invalid");

            $('#permanent_city').val('');
            $('#permanent_subdivision').val('');
            $('#permanent_state').val('');

            $('#permanent_city').prop('disabled', true);
            $('#permanent_subdivision').prop('disabled', true);
            $('#permanent_state').prop('disabled', true);
            $('#permanent_district').prop('disabled', true);
        }
        else if(arg == 'current')
        {
            $("#pin").removeClass("is-valid");
            $("#pin").addClass("is-invalid");

            $('#city').val('');
            $('#subdivision').val('');
            $('#state').val('');

            $('#city').prop('disabled', true);
            $('#subdivision').prop('disabled', true);
            $('#state').prop('disabled', true);
            $('#district').prop('disabled', true);
        }
        if(checkbox == true && arg == 'permanent')
        {
            $('#pin').val('');
            $('#city').val('');
            $('#subdivision').val('');
            $('#state').val('');
            $('#district').val('');
        }
    }
}

$("#div_registration-form").on('click', "#locationbtn", detectLocation);
function detectLocation() {
    function success(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;
        var select_dist = document.getElementById("district");
        select_dist.options.length = 0;
        $('#city').val('');
        $('#pin').val('');
        $('#subdivision').val('');
        $('#state').val('');
        $.ajax(
        {
            url: "/get-address-gps/",
            data:{
                'latitude':latitude,
                'longitude':longitude,
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                $('#location-spinner').css('display', 'none');
                if(response.success == "1")
                {
                    $('#city').val(response.city);
                    $('#pin').val(response.pin);
                    $('#subdivision').val(response.division);
                    $('#state').val(response.state);
                    select_dist.options.length = 0;
                    for(var i in response.districts)
                    {
                        var opt = document.createElement('option');
                        opt.value = response.districts[i];
                        opt.innerHTML = response.districts[i];
                        select_dist.appendChild(opt);
                    }
                    select_dist.value = response.district;
                }
                },
                error: function(response)
                {
                $('#location-spinner').css('display', 'none');
                document.getElementById("current_pinLoading").innerHTML = ""
                },
        });

    }

    function error() {
        $('#location-spinner').css('display', 'none');
        alert('Unable to retrieve your location. Check permissions on your browser. Allow the location permission');
    }

    if(!navigator.geolocation) {
        $('#location-spinner').css('display', 'none');
        alert('Geolocation is not supported by your browser');
    }
    else {
        $('#location-spinner').css('display', 'inline-block');
        var options = {
            enableHighAccuracy: true,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(success, error, options);
    }

}


$("#div_registration-form").on('click', '#samecurrent', showCurrentAddress);
$("#div_registration-form").on('keyup', '#permanent_address', showCurrentAddress);
$("#div_registration-form").on('keyup', '#permanent_pin', showCurrentAddress);
$("#div_registration-form").on('keyup', '#permanent_city', showCurrentAddress);
$("#div_registration-form").on('keyup', '#permanent_subdivision', showCurrentAddress);
$("#div_registration-form").on('change', '#permanent_state', showCurrentAddress);
$("#div_registration-form").on('change', '#permanent_district', showCurrentAddress);
function showCurrentAddress()
{
    checkbox = document.getElementById('samecurrent').checked;
    if(checkbox == false)
    {
        document.getElementById('locationbtn').disabled = false;
        document.getElementById('address').readOnly = false;
        document.getElementById('pin').readOnly = false;
        document.getElementById('city').readOnly = false;
        document.getElementById('subdivision').readOnly = false;
        document.getElementById('state').disabled = false;
        document.getElementById('district').disabled = false
    }
    else if(checkbox == true)
    {
        document.getElementById('locationbtn').disabled = true;
        document.getElementById('address').readOnly = true;
        document.getElementById('pin').readOnly = true;
        document.getElementById('city').readOnly = true;
        document.getElementById('subdivision').readOnly = true;
        document.getElementById('state').disabled = true;
        document.getElementById('district').disabled = true;

        let address = $('#permanent_address').val();
        let pin = $('#permanent_pin').val();
        let city = $('#permanent_city').val();
        let subdivision = $('#permanent_subdivision').val();
        let state = $('#permanent_state').val();
        let district = $('#permanent_district').val();

        $('#address').val(address);
        $('#pin').val(pin);
        $('#city').val(city);
        $('#subdivision').val(subdivision);
        $('#state').val(state);
        let dis = document.getElementById('district');
        let opt = $("#permanent_district").html();
        dis.innerHTML = opt
        dis.value = district;
    }
}

$(document).on('keyup', 'input[name=name]', namePrefixCheck);
$(document).on('change', 'input[name=name]', namePrefixCheck);
function namePrefixCheck(){
    titles = ['dr', 'esq', 'hon', 'jr', 'sr', 'mr', 'mrs', 'ms', 'prof', 'sri', 'smt']
    let name = $(this).val()
    first_word_in_name = name.split(" ")[0]
    let pattern = /\.$/g;
    dot_at_end = pattern.test(first_word_in_name);
    if(dot_at_end || titles.includes(first_word_in_name.toLowerCase())){
        $('#name').addClass('is-invalid');
        $("#namevalidation").addClass('feedback-invalid');
        $('#namevalidation').html("Don't use prefix (title) in name");
    }
    else{
        $('#name').removeClass('is-invalid');
        $("#namevalidation").removeClass('feedback-invalid');
        $('#namevalidation').html("")
    }
}

$("#div_registration-form").on('keyup', '#username', UsernameCheck)
function UsernameCheck(){
    $('#username').removeClass('is-valid');
    $('#username').removeClass('is-invalid');
    $("#usernamevalidation").removeClass('feedback-valid');
    $("#usernamevalidation").removeClass('feedback-invalid');
    $("#usernamevalidation").html('');
    user = $('#username').val();
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
            $('#username').addClass('is-invalid');
            $("#usernamevalidation").addClass('feedback-invalid');
            document.getElementById('usernamevalidation').innerHTML = data.message;
        }
        else
        {
            document.getElementById('usernamevalidation').innerHTML = "";
            $("#username").addClass('is-valid');
        }
        },
    });
}



$("#div_registration-form").on('keyup', "#email", emailcheck);
function emailcheck(){
    $('#email').removeClass('is-invalid');
    $('#email').removeClass('is-valid');
    $("#emailvalidation").removeClass('feedback-invalid');
    $("#emailvalidation").removeClass('feedback-valid');
    document.getElementById('emailvalidation').innerHTML = "";
    document.getElementById('email-verify-open').innerHTML = "Verify";
    action = 'otp not verified';
    OTPemail = 'not verified'
    email = $("#email").val()
    $('#emailotp').val('');
    $("#email-verify-open").prop('disabled', true);
    $("#email-verify-open").html('Verify');
    var positionOfAt = email.indexOf("@");
    var positionOfDot = email.lastIndexOf(".");

    if(email.search("@") == -1 || //if '@' is not present
    email.search(" ") >= 1 || //if blank space is present
    email.search(".") == -1 || //if "." is not present
    positionOfAt < 2 || //if there is no character before "@", at least 2 character should be present before "@"
    positionOfDot - positionOfAt <= 2 || //between '@' and '.', if there is not at least two character
    email.length - positionOfDot <= 2) //if after '.' there is not at least two character)
    {
        $('#email').addClass('is-invalid');
        $("#emailvalidation").addClass('feedback-invalid');
        $('#emailvalidation').html("Invalid Email Id!")
        $("#email-verify-open").prop('disabled', true);
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
                        $('#email').addClass('is-invalid');
                        $("#emailvalidation").addClass('feedback-invalid');
                        document.getElementById('emailvalidation').innerHTML = data.message;
                        $("#email-verify-open").prop('disabled', true);
                    }
                    else
                    {
                        document.getElementById('emailvalidation').innerHTML = "";
                        $('#email').removeClass('is-invalid');
                        $('#email').addClass('is-valid');
                        $("#email-verify-open").prop('disabled', false);
                    }
                },
            });
        }
    }
}



function passwordmatch()
{
    password1 = $('#password1').val()
    password2 = $('#password2').val()
    document.getElementById('passwordcheck').innerHTML = ""

    if(password1 == '' || password2 == '')
    {
        $('#password2').removeClass('is-invalid');
        $('#password2').removeClass('is-valid');
        $("#passwordcheck").removeClass('feedback-invalid');
        $("#passwordcheck").removeClass('feedback-valid');
        document.getElementById('passwordcheck').innerHTML = ""
    }
    else if(password1 === password2)
    {
        $('#password2').removeClass('is-invalid');
        $('#password2').addClass('is-valid');
        $("#passwordcheck").removeClass('feedback-invalid');
        $("#passwordcheck").addClass('feedback-valid');
        document.getElementById('passwordcheck').innerHTML = "Password and Confirm Password matched!"
    }
    else if(password1 != password2)
    {
        //timer(0);
        $('#password2').removeClass('is-valid');
        $('#password2').addClass('is-invalid');
        $("#passwordcheck").addClass('feedback-invalid');
        $("#passwordcheck").removeClass('feedback-valid');
        document.getElementById('passwordcheck').innerHTML = "Password and Confirm Password didn't match!"
    }
}
$("#div_registration-form").on('keyup', '#password1', passwordmatch)
$("#div_registration-form").on('keyup', '#password2', passwordmatch)


function PasswordValidation()
{
    $("#password1").removeClass("is-valid");
    $("#password1").removeClass("is-invalid");
    document.getElementById("password2").disabled = true;
    document.getElementById('checkpassword').innerHTML = "";
    let password = $('#password1').val();
    var isFocused = $('#password1').is(':focus');
    if(password != '' || isFocused){
        $.ajax({
            type:'POST',
            url: "/check-password/",
            data: {
                password: password,
                username: $('#username').val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                if(response.password_error == 'No Error')
                {
                    $("#password1").addClass("is-valid");
                    document.getElementById("password2").disabled = false;
                }
                else
                {
                    $('#password1').addClass('is-invalid');
                    html = ''
                    for(i=0; i<response.password_error.length; i++){
                        if(i == response.password_error.length-1){
                            html += `${response.password_error[i]['error_message']}`
                        }
                        else{
                            html += `${response.password_error[i]['error_message']}<br>`
                        }
                    }
                    document.getElementById('checkpassword').innerHTML = html;
                }
            },
        });
    }
    else{

    }
}
$("#div_registration-form").on('keyup', '#username', PasswordValidation)
$("#div_registration-form").on('keyup', '#password1', PasswordValidation)


$("#div_registration-form").on('change', "#picture", upload_img);
function upload_img() {
    $(this).removeClass('is-valid');
    $(this).removeClass('is-invalid');
    $("#imageError").removeClass('feedback-valid');
    $("#imageError").removeClass('feedback-invalid');
    document.getElementById('imageError').innerHTML = "";
    $('#img_id').removeClass('profile-image-border');
    $('#img_id').attr('src', "/static/images/GoHealthy_Profile Image icon.png");
    var fileUpload = this;

    if (typeof(fileUpload.files) != undefined) {
        var size = fileUpload.files[0].size / 1024;
        var fileType = fileUpload.files[0].type.split('/')[0];
        if(fileType != 'image')
        {
            $(this).val('')
            $(this).addClass('is-invalid');
            $("#imageError").addClass('feedback-invalid');
            document.getElementById('imageError').innerHTML = "This is not an image file.<br>Select an image file.";
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
                initializeImageCroper({image_src:e.target.result, aspect_ratio:1 / 1, display_image:'#img_id', image_input:'#picture', afterCropFunction:afterCropFunction,})
            }
            reader.readAsDataURL(fileUpload.files[0]);
            $(this).val('')
        }
    }
}