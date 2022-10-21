
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
});

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
    $(".main-content").css('margin-left', '340px');
    $(".sidenav").css('transform', 'translateX(0)');
});

var deviceWidth = window.innerWidth;
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


// $(".btn-value-change").on('click', updateInputValue);
function updateInputValue(e){
    e.preventDefault();
    let btnParent = $(this).parent();
    let value = $(this).val();
    if(value == 'minus'){
        let input = $(btnParent).next('input');
        $(input).focus();
        let inputValue = Number($(input).val()) - 1;
        if(inputValue >= 1){
            let value = inputValue > 9 ? inputValue : `0${inputValue}`;
            $(input).val(value);
        }
    }
    if(value == 'plus'){
        let input = $(btnParent).prev('input');
        $(input).focus();
        let inputValue = Number($(input).val()) + 1;
        let value = inputValue > 9 ? inputValue : `0${inputValue}`;
        $(input).val(value);
    }
}
$(".btn-value-change").on('mousedown', updateInputValue); 
$(".blood-availability-input").on('focusout', function(){
    $(this).trigger('change');
});
$(".blood-availability-input").on('change', function(event){
    event.preventDefault();
    let form = document.getElementById("update-blood-form");
    let theFormData = new FormData(form);
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theFormData.append('csrfmiddlewaretoken', csrf);
    $.ajax({
        type:'POST',
        url: $(form).attr('action'),
        data: theFormData,
        contentType: false,
        processData: false,
        dataType: 'json',
        cache: false,
        success:function(response){
            if(response.success){
                last_update = formatDateTime(response.last_update);
                $("#last_update").html(last_update);
            }
        },
        error:function(){
            
        },
    });
});  


$("#generate-donor-certificate-form").on('submit', function(event){
    event.preventDefault();
    let theForm = new FormData(this);
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    $("#donor-certificate-button").prop('disabled', true);
    $("#donor-certificate-button").html('Generating....');
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
            $("#donor-certificate-button").prop('disabled', false);
            $("#donor-certificate-button").html('Generate');
            if(response.error){
                showSingleButtonAlert(response.messageTitle, response.message, "Okay");
            }
            else{
                $("#generate-donor-certificate-form").trigger("reset");
                showSingleButtonAlert("Generated", "Certificate has been sent to the donor via SMS", "Okay");
            }
        },
        error:function(response)
        {
            $("#donor-certificate-button").prop('disabled', false);
            $("#donor-certificate-button").html('Generate');
            showSingleButtonAlert("Failed", "Sorry! Certificated generation failed.", "Okay");
        },
    });
});

$("#add-collection-record-form").on('submit', function(event){
    event.preventDefault();
    let theForm = new FormData(this);
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    $("#collection-certificate-button").prop('disabled', true);
    $("#collection-certificate-button").html('Please Wait....');
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
            $("#collection-certificate-button").prop('disabled', false);
            $("#collection-certificate-button").html('Submit');
            $("#add-collection-record-form").trigger("reset");
            showSingleButtonAlert("Succeed", "Record has been created", "Okay");
        },
        error:function(response)
        {
            $("#collection-certificate-button").prop('disabled', false);
            $("#collection-certificate-button").html('Submit');
            showSingleButtonAlert("Failed", "Sorry! Record creation failed.", "Okay");
        },
    });
});


$('#edit-email').on('keyup', function(){
    email = $(this).val();
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
            url: "/bloodbank-edit-otp-send/",
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
        url: "/bloodbank-edit-otp-send/",
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
        enctype: 'multipart/form-data',
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
            if(!response.emailExists && !response.mobileExists && !response.invalidEmailOtp && !response.invalidMobileOtp)
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
            $("#BloodBankNameTitle").html(response.name.toUpperCase());
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


$("[data-target='#site-content-show-donor-certificates']").on('click', function(){
    donorSearch({action:'All'});
});
$('#donorFilter').on('submit', function(event){
    event.preventDefault();
    $('#donorSearchBtnText').html('Searching')
    donorSearch({action:'Searching'})
});
$('#donorSearchClearBtn').on("click", function() {
    $('#donorSearchClearBtn').html('Clearing')
    donorSearch({action:'All'});
});
$('#donorDataRefresh').on("click", function() {
    donorSearch({action:'All'});
});

var donorPage = 1;
$("#donorDataBody").on('click', "#donor-loadMore", function(){
    donorPage += 1;
    $(this).prop('disabled', true);
    $(this).html('Loading......');
    donorSearch({action:'Searching', page:donorPage});
});

function donorSearch({action='Searching', page=1}={})
{
    if(action == 'All')
    {
        donorPage = 1;
        $("#donorFilter").trigger('reset');
        searchFor = 'All';
    }
    if(page == 1){
        html = `<tr id='donorLoading'> 
                    <td colspan='100%' align='center' style='text-align:center'><h4 class='text-muted'>Loading....</h4></td> 
                </tr>`
        $('#donorDataBody').html(html);
    }

    data = $(`[form='donorFilter']`).serializeToJSON({
        parseBooleans: false,
    });
    data['page'] = page;
    $.ajax(
    {
        type:'GET',
        url: "/blood-certificates-search/",
        data: data,
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $('#donorSearchClearBtn').html('Clear');
            $('#donorSearchBtnText').html('Search');
            $('#donorBtnSpin').removeClass('fa-spin');
            if(page == 1){
                $('#donorDataBody').html('');
            }
            if(response.certificates.length <= 0 && page == 1)
            {
                html = `<tr id='donorLoading'> 
                            <td colspan='100%' align='center' style='text-align:center'><h4 class='text-muted'>No Data Found</h4></td> 
                        </tr>`
                $('#donorDataBody').html(html);
            }
            else
            {
                for(var i=0; i<response.certificates.length; i++)
                {
                    var issuedDate = formatDate(response.certificates[i]['Issued_at']);
                    var html =
                        `<tr class='donorDataClass' id='donorData${response.certificates[i]['Certificate_Id']}'> 
                            <td class='table-serial-no left-column-sticky' align="center"></td>
                            <td class="left-column-sticky-1">${response.certificates[i]['Name']}</td> 
                            <td>${response.certificates[i]['Gender']}</td> 
                            <td>${response.certificates[i]['Age']}</td> 
                            <td>${response.certificates[i]['Email']}</td> 
                            <td>${response.certificates[i]['Phone']}</td> 
                            <td>${response.certificates[i]['Blood_Group']}</td> 
                            <td>${response.certificates[i]['Component']}</td> 
                            <td>${response.certificates[i]['Unit']}</td> 
                            <td>${issuedDate}</td> 
                            <td class="right-column-sticky">
                                <a href="/blood-certificate/${response.certificates[i]['Certificate_Id']}" target="_blank" class="btn btn-primary btn-sm">View Certificate</a>
                            </td>  
                        </tr>`
                    $(`#donorDataBody`).append(html)
                }
                $("#tr-donor-loadMore").remove();
                if(!response.is_last){
                    var loadMoreBtn = 
                        `<tr style="background-color:white" id="tr-donor-loadMore">
                            <td colspan='16' align='center' style='text-align:center'>
                                <div class="text-center">
                                    <button class="btn btn-primary" id="donor-loadMore">Load More</button>
                                </div>
                            </td>
                        </tr>`
                    $(`#donorDataBody`).append(loadMoreBtn);
                }
            }
            $("#donor-loadMore").html('Load More');
            $("#donor-loadMore").prop('disabled', false);
        },
        error:function(response)
        {
            if(page == 1){
                $('#donorDataBody').html('');
            }
            $('#donorSearchClearBtn').html('Clear');
            $('#donorSearchBtnText').html('Search');
            $('#donorDataBody').removeClass('fa-spin');
            $("#donor-loadMore").html('Load More');
            $("#donor-loadMore").prop('disabled', false);
        }
    });
}


$("[data-target='#site-content-show-collection-certificates']").on('click', function(){
    collectorSearch({action:'All'});
});
$('#collectorFilter').on('submit', function(event){
    event.preventDefault();
    $('#collectorSearchBtnText').html('Searching')
    collectorSearch({action:'Searching'})
});
$('#collectorSearchClearBtn').on("click", function() {
    $('#collectorSearchClearBtn').html('Clearing')
    collectorSearch({action:'All'});
});
$('#collectorDataRefresh').on("click", function() {
    collectorSearch({action:'All'});
});

var collectorPage = 1;
$("#collectorDataBody").on('click', "#collector-loadMore", function(){
    collectorPage += 1;
    $(this).prop('disabled', true);
    $(this).html('Loading......');
    collectorSearch({action:'Searching', page:collectorPage});
});

function collectorSearch({action='Searching', page=1}={})
{
    if(action == 'All')
    {
        collectorPage = 1;
        $("#collectorFilter").trigger('reset');
        searchFor = 'All';
    }
    if(page == 1){
        html = `<tr id='collectorLoading'> 
                <td colspan='100%' align='center' style='text-align:center'><h4 class='text-muted'>Loading....</h4></td> 
            </tr>`
        $('#collectorDataBody').html(html);
    }

    data = $(`[form='collectorFilter']`).serializeToJSON({
        parseBooleans: false,
    });
    data['page'] = page;
    $.ajax(
    {
        type:'GET',
        url: "/blood-certificates-search/",
        data: data,
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $('#collectorSearchClearBtn').html('Clear');
            $('#collectorSearchBtnText').html('Search');
            $('#collectorBtnSpin').removeClass('fa-spin');
            if(page == 1){
                $('#collectorDataBody').html('');
            }
            if(response.certificates.length <= 0 && page == 1)
            {
                html = `<tr id='collectorLoading'> 
                            <td colspan='100%' align='center' style='text-align:center'><h4 class='text-muted'>No Data Found</h4></td> 
                        </tr>`
                $('#collectorDataBody').html(html);
            }
            else
            {
                for(var i=0; i<response.certificates.length; i++)
                {
                    var issuedDate = formatDate(response.certificates[i]['Issued_at']);
                    var html =
                        `<tr class='collectorDataClass' id='collectorData${response.certificates[i]['Certificate_Id']}'> 
                            <td class='table-serial-no left-column-sticky' align="center"></td>
                            <td class="left-column-sticky-1">${response.certificates[i]['Name']}</td> 
                            <td>${response.certificates[i]['Gender']}</td> 
                            <td>${response.certificates[i]['Age']}</td>
                            <td>${response.certificates[i]['Email']}</td> 
                            <td>${response.certificates[i]['Phone']}</td> 
                            <td>${response.certificates[i]['Blood_Group']}</td> 
                            <td>${response.certificates[i]['Component']}</td> 
                            <td>${response.certificates[i]['Unit']}</td> 
                            <td>${issuedDate}</td>
                        </tr>`
                    $(`#collectorDataBody`).append(html)
                }
                $("#tr-collector-loadMore").remove();
                if(!response.is_last){
                    var loadMoreBtn = 
                        `<tr style="background-color:white" id="tr-collector-loadMore">
                            <td colspan='16' align='center' style='text-align:center'>
                                <div class="text-center">
                                    <button class="btn btn-primary" id="collector-loadMore">Load More</button>
                                </div>
                            </td>
                        </tr>`
                    $(`#collectorDataBody`).append(loadMoreBtn);
                }
            }
        },
        error:function(response)
        {
            if(page == 1){
                $('#collectorDataBody').html('');
            }
            $('#collectorSearchClearBtn').html('Clear');
            $('#collectorSearchBtnText').html('Search');
            $('#collectorDataBody').removeClass('fa-spin');
            $("#collector-loadMore").html('Load More');
            $("#collector-loadMore").prop('disabled', false);
        }
    });
}