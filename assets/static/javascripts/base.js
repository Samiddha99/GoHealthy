
var log = $("#display-username").text();

$(document).ready(function(){
    $("[data-toggle=popover]").popover()
});
$(document).ready(function(){
    $('body').tooltip({
        selector: '[data-toggle=tooltip]'
    });
});

function sendRequest({url, data='', method='GET', mode='cors', cache='no-cache', credentials='same-origin', refererPolicy='same-origin', keepalive=false, headers={}}={}){
    return new Promise(function(resolve, reject){
        let options = {
            method: method,
            mode: mode, // no-cors, *cors, same-origin
            cache: cache, // *default, no-cache, reload, force-cache, only-if-cached
            credentials: credentials, // include, *same-origin, omit
            refererPolicy: refererPolicy, // no-referer, *no-referer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            redirect: 'follow', // manual, *follow, error
            keepalive: keepalive,
        };
        headers_default = {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        }
        options.headers = {
            ...headers_default,
            ...headers

        }
        if (method == 'GET') {
            if(data != ''){
                url += '?' + (new URLSearchParams(data)).toString();
            }
        }
        else {
            options.body = data  //JSON.stringify(data);
        }
        return fetch(url, options)
            .then(function(response){
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response
            }).then(function(response){
                if(response.headers.get("content-type") == 'application/json'){
                    resolve(response.json());
                }
                else if(response.headers.get("content-type") == 'text/html; charset=utf-8'){
                    resolve(response.text());
                }
                else{
                    resolve(response.text());
                }
            }).catch(function(error){
                reject(error);
            });
    });
}



$('.lazy').Lazy({
    // your configuration goes here
    scrollDirection: 'both',
    effect: 'fadeIn',
    visibleOnly: false,
    defaultImage: $("#lazy-pre-load-image").attr('data-value'),
    beforeLoad: function(element) {
        console.log('## about to load ' + element.data('src') + ' ' + (new Date()).toISOString())
    },
    afterLoad: function(element) {
        console.log('## finished to load ' + element.data('src') + ' ' + (new Date()).toISOString())
    },
    onError: function(element) {
        console.log('error loading ' + element.data('src'));
    },
    onFinishedAll: function() {
        console.log("All loaded")
    },
    onError: function(element) {
        console.log('error loading ' + element.data('src'));
    }
});


$(document).on('click', ".table-sort-column", function(){
    index = $(this).index()
    table = $(this).parent().parent().parent()
    sort_icon = $(this).children(".table-sort-icon")
    $(".table-sort-icon").removeClass('fad fa-sort-up');
    $(".table-sort-icon").removeClass('fad fa-sort-down');
    $(".table-sort-icon").addClass('fas fa-sort');
    sortTable(index, table, sort_icon);
})

function sortTable(column_index, table, target_col_sort_icon) {
    var rows, i, x, y, shouldSwitch, switchcount = 0;
    var switching = true;
    // Set the sorting direction to ascending:
    var dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = $(table).children("tbody").children("tr")
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 0; i < (rows.length - 1); i++) {
			$(target_col_sort_icon).removeClass('fas fa-sort');
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[column_index];
            y = rows[i + 1].getElementsByTagName("TD")[column_index];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                $(target_col_sort_icon).removeClass('fad fa-sort-down');
                $(target_col_sort_icon).addClass('fad fa-sort-up');
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
                }
            } else if (dir == "desc") {
                $(target_col_sort_icon).removeClass('fad fa-sort-up');
                $(target_col_sort_icon).addClass('fad fa-sort-down');
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

$("#navbar-button-bar").on('click', '#navbar-toggler-button', changeToggleButton);
$("#navbar-button-close").on('click', '#navbar-toggler-button', changeToggleButton);
function changeToggleButton(){
    $("#_id-navbar-toggler-text").toggleClass("far fa-bars");
    $("#_id-navbar-toggler-text").toggleClass("fal fa-times");

    if($("#_id-navbar-toggler-text").hasClass('fal fa-times')){
        $('.navbar-toggler').addClass('mr-3');
        $('.navbar-brand').addClass('ml-5');
        htmlContentNavBar = $("#navbar-button-bar").html();
        $("#navbar-button-bar").css('display', 'none');
        $("#navbar-button-bar").html("");
        $("#navbar-button-close").css('display', 'block');
        $("#navbar-button-close").html(htmlContentNavBar);
    }
    else{
        htmlContentNavBar = $("#navbar-button-close").html();
        $("#navbar-button-close").css('display', 'none');
        $("#navbar-button-close").html("");
        $("#navbar-button-bar").css('display', 'block');
        $("#navbar-button-bar").html(htmlContentNavBar);
        $('.navbar-toggler').removeClass('mr-3');
        $('.navbar-brand').removeClass('ml-5');
    }
}





$(document).on('mouseup', function(e) 
{
    var container = $(".dropdown-input-field-area");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        $('.dropdown-options-menu').removeClass('show');
    }
});

$(document).on('keydown', function(e){
    if(String(e.key) == "Tab"){
        $('.dropdown-options-menu').removeClass('show');
    }
})

$(document).on('focusout', ".dropdown-input", dropdownInputFocusOut);
function dropdownInputFocusOut(){
    let dropdown = $(this).attr('data-dropdown');
    if($(`${dropdown}-area:hover`).length == 0){
        $('.dropdown-options-menu').removeClass('show');
    }
}

$(document).on('focus', ".dropdown-input", dropdownInputFocus);
function dropdownInputFocus(){
    let dropdownInputSearch = $(this).attr('data-dropdown_search');
    $(dropdownInputSearch).val('')
    let dropdown = $(this).attr('data-dropdown');
    $('.dropdown-options-menu').removeClass('show');
    $(dropdown).addClass('show');
}

$(document).on('click', ".dropdown-item", selectInputDropdownItem);
function selectInputDropdownItem()
{
    let id = $(this).attr('data-value');
    var text = $(this).attr('data-text');

    parrentElement = $(this).parent();
    textInput = parrentElement.attr("data-label-input")
    valueInput = parrentElement.attr("data-value-input")

    $(textInput).val(text);
    $(valueInput).val(id);
    console.log(this)
    $('.dropdown-options-menu').removeClass('show');
    $('.dropdown-input-search').val('');
}


var movingDot;
function dotMovingAnimation(domElement, noOfDot){
    var id = 1;
    time = 190;
    var forwardMoving = true;
    var htmlContent = ''
    if(noOfDot > 0){
        for(i=1; i<=noOfDot; i++){
            htmlContent += `<i class="fas fa-circle dot" style="font-size: 13px; color:#ffffffaf" id="dot-${i}"></i> `
        }
        domElement.innerHTML = htmlContent;
        movingDot = setInterval(function(){
            var zoomOutStyle = {
                'font-size': '13px',
                'color': '#ffffffaf',
            }
            $(".dot").css(zoomOutStyle)
            var zoomInStyle = {
                'font-size': '14.5px',
                'color': 'white',
            }
            $(`#dot-${id}`).css(zoomInStyle);
            if(forwardMoving){
                id = id + 1
            }
            else{
                id = id - 1
            }
            if(id > noOfDot){
                id = noOfDot;
                forwardMoving = false;
            }
            else if(id < 1){
                id = 1;
                forwardMoving = true;
            }
        }, time);
    }
    else{
        clearInterval(movingDot)
    }
}



var overflowY = 'auto';
var single_button_alert = ''
var clickAfterFunction = undefined;
function showSingleButtonAlert(title, message, buttonText, functionName=undefined){
    single_button_alert = document.getElementById("id_SingleButton-Alert");
    overflowY = document.body.style.overflowY;
    clickAfterFunction = functionName;
    $('#id_SingleButton-Alert-header').html(title)
    $('#id_SingleButton-Alert-message').html(message)
    $('#id_SingleButton-Alert-button').html(buttonText)
    single_button_alert.style.display = "block";
    document.body.style.overflowY = 'hidden';
}
$('#id_SingleButton-Alert-button').on('click', function(){
    if(clickAfterFunction != undefined){
        clickAfterFunction();
    }
    single_button_alert.style.display = "none";
    document.body.style.overflowY = overflowY;
});



function twoButtonAlert(message, buttonCloseText, buttonOkayText, functionName=undefined){
    two_button_alert = document.getElementById("id_TwoButton-Alert");
    overflowY = document.body.style.overflowY;
    clickAfterFunction = functionName;
    $('#id_TwoButton-Alert-message').html(message)
    $('#id_TwoButton-Alert-button-close').html(buttonCloseText)
    $('#id_TwoButton-Alert-button-okay').html(buttonOkayText)
    two_button_alert.style.display = "block";
    document.body.style.overflowY = 'hidden';
}
$('#id_TwoButton-Alert-button-okay').on('click', function(){
    if(clickAfterFunction != undefined){
        clickAfterFunction();
    }
    two_button_alert.style.display = "none";
    document.body.style.overflowY = overflowY;
});
$('#id_TwoButton-Alert-button-close').on('click', function(){
    two_button_alert.style.display = "none";
    document.body.style.overflowY = overflowY;
});



function getCookiesValue(cookies_name){
    var cookies = document.cookie; //read all cookies
    var value = null;
    cookies = cookies.split('; ');
    for(var i=0; i<cookies.length; i++)
    {
        var name = cookies[i].split('=')[0];
        if(name == cookies_name)
        {
            value = cookies[i].split('=')[1];
            break;
        }
    }
    return value
}



function findAge(dob){
    dob = dob.split("-");
    dob_year = Number(dob[0])
    dob_month = Number(dob[1])
    dob_day = Number(dob[2])
    today = new Date()
    today_day = Number(today.toLocaleString('default', { day: 'numeric' }));
    today_month = Number(today.toLocaleString('default', { month: 'numeric' }));
    today_year = Number(today.toLocaleString('default', { year: 'numeric' }));
    age = today_year - dob_year - ((today_month, today_day) < (dob_month, dob_day))
    return age
}

function formatDateTime(dateTime)
{
    if(dateTime == '' || dateTime == undefined || dateTime == null || dateTime == 'None'){
        return `N/A`
    }
    else{
        var dt = new Date(dateTime);
        var hours = dt.getHours();
        var minutes = dt.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM'; //AM or PM
        hours = hours % 12; //convert in 12-hour format;
        hours = hours ? hours : 12; //display 0 as 12
        day = dt.toLocaleString('default', { day: 'numeric' });
        month = dt.toLocaleString('default', { month: 'long' });
        year = dt.toLocaleString('default', { year: 'numeric' });
        
        dt = `${(day <= 9) ? '0'+day : day} ${(month <= 9) ? '0'+month : month} ${(year <= 9) ? '0'+year : year}, ${(hours <= 9) ? '0'+hours : hours}:${(minutes <= 9) ? '0'+minutes : minutes} ${ampm}`;
        return dt;
    }
}


function formatDate(date)
{
    var dt = new Date(date);
    day = dt.toLocaleString('default', { day: 'numeric' });
    month = dt.toLocaleString('default', { month: 'long' });
    year = dt.toLocaleString('default', { year: 'numeric' });
    
    dt = `${(day <= 9) ? '0'+day : day} ${(month <= 9) ? '0'+month : month} ${(year <= 9) ? '0'+year : year}`;
    return dt;
}
function formatTime(time)
{
    time = time.split(":")
    let hour = time[0]
    let ampm = hour >= 12 ? 'PM' : 'AM'; //AM or PM
    hour = hour % 12; //convert in 12-hour format;
    hour = hour ? hour : 12; //display 0 as 12
    let minute = time[1]
    
    dt = `${hour <=9 ? '0'+hour : hour}:${minute} ${ampm}`
    return dt;
}

$("#passChange").on('hide.bs.modal', function(){
    $('#old_password').val('');
    $('#new_password1').val('');
    $('#new_password2').val('');
    $('#new_password1').removeClass('invalid-password-input-field');
    $('#new_password2').removeClass('invalid-password-input-field');
    $('.changePasswordValidation').css('color', 'red');
    $('#message').html("");
    $('#newpasswordcheck').html("");
});



$("#bloodrequest").on('submit', function(event){
    event.preventDefault();
    if(otpStatus == 'Sent')
    {
        document.getElementById('sendrequestsubmit').disabled = true;
        $('#sendrequestsubmit').html(`<i class='fad fa-spinner-third fa-spin'></i>`);
        $('#bloodrequestmessage').html('');
        $.ajax(
        {
            type:'POST',
            url: $(this).attr('action'),
            data:{
                name: $('#patient_name').val(),
                group: $('#patient_bloodGroup').val(),
                unit: $('#request_blood_unit').val(),
                phone: $('#your_contact').val(),
                otp: $("#blood_otp").val(),
                hospital: $('#patient_hospital').val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success:function(response)
            {
                $('#sendrequestsubmit').html('Send Request');
                $("#otp_send_message").html("");
                if(response.success == '1')
                {
                    $("#bloodrequest").trigger('reset');
                    $('#bloodrequestmessage').html(`<span style='color:green'>Request Sent</span>`);
                }
                else if(response.error == '1')
                {
                    $('#bloodrequestmessage').html(`<span style='color:red'>Invalid OTP</span>`);
                }
                else if(response.error == '2')
                {
                    $('#bloodrequestmessage').html(`<span style='color:red'>Send OTP Again</span>`);
                }
                document.getElementById('sendrequestsubmit').disabled = false;
                clearInterval(interval);
                $("#button-otp_send").prop('disabled', true);
                $("#button-otp_send").html("Send OTP");
                
            },
            error:function(response)
            {
                $('#sendrequestsubmit').html('Please Try Again');
                document.getElementById('sendrequestsubmit').disabled = false;
                $('#bloodrequestmessage').html(`<span style='color:red'>Request Send Failed</span>`);
                
            },
        });
        return false;
    }
    else
    {
        $('#bloodrequestmessage').html(`<span style='color:red'>Send OTP first</span>`);
    }
});




$("#feedbackform").on('submit', function(event){
    event.preventDefault();
    document.getElementById('feedbacksubmit').disabled = true;
    $('#feedbacksubmitmessage').html('');
    $('#feedbacksubmitmessage').html('Submitting....');
    $.ajax(
    {
        type:'POST',
        url: $(this).attr('action'),
        data:{
            email: $('#feedbackEmail').val(),
            feedback: $('#feedback').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $('#feedbacksubmitmessage').html('');
            if(response.success == '1')
            {
                $('#feedbackEmail').val('');
                $('#feedback').val('');
                $('#feedbacksubmitmessage').html(`Thanks for the feedback`);
            }
            document.getElementById('feedbacksubmit').disabled = false;
            
        },
        error:function(response)
        {
            $('#feedbacksubmitmessage').html(`Failed to submit feedback`);
            document.getElementById('feedbacksubmit').disabled = false;
            
        },
    });
    return false;
});



$("#new_password1").on('keyup', newpasswordmatch);
$("#new_password2").on('keyup', newpasswordmatch);
function newpasswordmatch()
{
    document.getElementById("message").innerHTML = ""
    password1 = $('#new_password1').val();
    password2 = $('#new_password2').val();

    document.getElementById('newpasswordcheck').innerHTML = ""

    if(password1 == '' || password2 == '')
    {
       document.getElementById('newpasswordcheck').innerHTML = ""
        $('#new_password1').addClass('invalid-password-input-field');
        $('#new_password2').addClass('invalid-password-input-field');
        document.getElementById("changePasswordBtn").disabled = true;
    }
    else if(password1 === password2)
    {
        document.getElementById('newpasswordcheck').innerHTML = "<b style='color:green'>New Password and Confirm Password matched!</b>"
        $('#new_password2').removeClass('invalid-password-input-field');
        if(is_change_password_correct == "1")
        {
            document.getElementById("changePasswordBtn").disabled = false;
        }
    }
    else if(password1 !== password2)
    {
        document.getElementById('newpasswordcheck').innerHTML = "<b style='color:red'>New Password and Confirm Password didn't match!</b>"
        $('#new_password2').addClass('invalid-password-input-field');
        document.getElementById("changePasswordBtn").disabled = true;
    }
}


var is_change_password_correct = "0";
$("#new_password1").on('keyup', PasswordValidationChangePassword);
function PasswordValidationChangePassword()
{
    var password = $('#new_password1').val();
    if(password.length != 0)
    {
        document.getElementById("changePasswordBtn").disabled = true;
        $.ajax({
            type:'POST',
            url: "/check-password/",
            data: {
                password:password,
                username:$('#get-username').val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                $('.changePasswordValidation').css('color', 'green');
                if(response.password_error == 'No Error')
                {
                    $('#new_password1').removeClass('invalid-password-input-field');
                    is_change_password_correct = "1";
                }
                else
                {
                    is_change_password_correct = "0";
                    $('#new_password1').addClass('invalid-password-input-field');

                    for(i=0; i<response.password_error.length; i++){
                        $(`.password_validation_${response.password_error[i]['error_code']}`).css('color', 'red');
                    }
                    document.getElementById("changePasswordBtn").disabled = true;
                }
                
            },
        });
    }
    else
    {
        is_change_password_correct = "0";
        document.getElementById("changePasswordBtn").disabled = true;
        $('#new_password1').addClass('invalid-password-input-field');
        $('.changePasswordValidation').css('color', 'red');
    }
}


$( "#changePassword" ).on('submit', function( event ) {
    event.preventDefault();
    if(is_change_password_correct == '1')
    {
        var old_password = $('#old_password').val();
        var new_password1 = $('#new_password1').val();
        var new_password2 = $('#new_password2').val();
        document.getElementById('newpasswordcheck').innerHTML = "";
        document.getElementById("message").innerHTML = "";
        document.getElementById("loading").innerHTML = "<span style='color:green;float:right'>LOADING........</span>"
        $.ajax(
        {
            type:'POST',
            url: $(this).attr('action'),
            data:{
                old_password:old_password,
                new_password1:new_password1,
                new_password2:new_password2,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success:function(response)
            {
                document.getElementById("loading").innerHTML = "";
                $('.changePasswordValidation').css('color', 'green');
                if(response.password_error == "No Error")
                {
                    
                    $('#passChange').modal('hide');
                    var functionToExecute = function(){
                        location.replace(response.login_url);
                    }
                    showSingleButtonAlert('Password Changed', 'You will be redirect to login page.<br>You have to login with the new password.', 'OK', functionToExecute);
                }
                else
                {
                    for(i=0; i<response.password_error.length; i++){
                        $(`.password_validation_${response.password_error[i]['error_code']}`).css('color', 'red');
                        if(response.password_error[i]['input_error']){
                            document.getElementById("message").innerHTML += `<p style='color:red; margin-bottom: -3px !important;'>${response.password_error[i]['error_message']}</p>`
                        }
                    }
                }
                return true;
            },
            error: function(response)
            {
                document.getElementById("message").innerHTML = "<p style='color:red'>Password Change Failed!</p>"
                document.getElementById("loading").innerHTML = "";
                return false;
            },
        });
    }
});



function countVisitor()
{
    var keyName = 'isVisited';
    var value = getCookiesValue(keyName)
    var value1 = localStorage.getItem(keyName)
    
    if (value == null && value1 == null) //if user is not visited
    {
        $.ajax(
        {
            type:'POST',
            url: "/count-visitor/",
            data:{
                isVisited: value1,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success:function(response)
            {
                if(response.success == '1')
                {
                    localStorage.setItem('isVisited', '1');
                }
                
            },
        });
    }
}
$(window).on('load', function(){
    setTimeout(countVisitor, 20000);
});


$(document).ready(function(){
    value = localStorage.getItem('tcAccepted')
    if(value == null || value == undefined || value == '')
    {
        sendRequest({url: "/terms-and-conditions/"})
            .then( function(response) {
                $("#id_tcScroll").html($(response).find(".tc-contents").html());
                $(".tc-modal-header").html($(response).find(".tc-heading-div").html());
                $('#tcModal').modal('show');
                document.body.style.overflowY = 'hidden';
            }, function(error){
                console.log(error);
            });
        
    }
})

$(document).ready(function(){
    sendRequest({url: "/blood-donor-eligibility/"})
        .then( function(response) {
            $("#id_donorEligibilityScroll").html($(response).find(".donor-eligible-contents").html());
            $(".donor-eligibility-modal-header").html($(response).find(".donor-eligible-main-heading-div").html());
        }, function(error){
            console.log(error);
        });
})


$('.tcScroll').scroll(function(){
    var topScroll = $('.tcScroll').scrollTop(); //how much has been scrolled (measurement of the distance from the element's top to its topmost visible content)
    var heightInner = $('.tcScroll').innerHeight() // inner height of the element
    var heightScroll = document.getElementById('id_tcScroll').scrollHeight; //height of an element's content including content not visible on the screen due to overflow
    if(topScroll >= ((heightScroll - heightInner)-40))
    {
        $('#tcUnderstoodBtn').prop('disabled', false);
        var btnEle = $('#tcUnderstoodBtn');
        btnEle.html("I Read It")
        btnEle.removeAttr("title", '');
        
    }
    else
    {
        $('#tcUnderstoodBtn').prop('disabled', true);
        var btnEle = $('#tcUnderstoodBtn');
        btnEle.html("Read the T & C")
        btnEle.attr("title", "Read the Terms & Conditions");
    }
});
document.getElementById('tcUnderstoodBtn').addEventListener('click', function(){
    $('#tcModal').modal('hide');
    document.body.style.overflowY = 'auto';
    localStorage.setItem('tcAccepted', '1')
    //document.cookie="tcAccepted=1; samesite=lax; secure; expires=Tue, 10 Jan 2038 04:14:07 GMT";
});



var countDown = 'off';
var interval;
function otpSendTimer(t)
{
    interval = setInterval(function() {
    if(t <= -1)
    {
        $("#button-otp_send").prop('disabled', false);
        $("#button-otp_send").html("Send OTP");
        countDown = 'off'
        clearInterval(interval);
        return 0;
    }
    else if(t == 0)
    {
        $("#button-otp_send").html("Resend OTP");
        $("#button-otp_send").prop('disabled', false);
        countDown = 'off'
        clearInterval(interval);
        return 0;
    }
    else if(t > 0)
    {
        $("#button-otp_send").prop('disabled', true);
        $("#button-otp_send").html("Resend OTP ("+t+"s)");
        countDown = 'on'
        t = t-1;
    }
    }, 1000);
    return 0;
}



var otpStatus;
$('#button-otp_send').on('click', function(){
    var mobile = $('#your_contact').val();
    if(mobile.length == 10)
    {
        $(this).prop('disabled', true);
        $(this).html('Sending...')
        $('#otp_send_message').html('&nbsp;')
        otpStatus = 'Not Sent';
        clearInterval(interval);
        $.ajax({
            url: "/send-otp-blood-request/",
            type: 'POST',
            data:{
                mobile: mobile,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response){
                otpStatus = 'Sent';
                $('#otp_send_message').css('color', 'green');
                $('#otp_send_message').html('OTP Sent')
                otpSendTimer(60);
            },
            error: function(){
                $('#otp_send_message').css('color', 'red');
                $('#otp_send_message').html('OTP Send Failed!')
                otpSendTimer(0);
            },
        })
    }
    else
    {
        $('#your_contact').focus();
    }
});



$('#your_contact').on('keyup', function(){
    otpStatus = 'Not Sent';
    $('#blood_otp').val('');
    if(($(this).val()).length == 10)
    {
        $('#button-otp_send').prop('disabled', false);
    }
    else
    {
        $('#button-otp_send').prop('disabled', true);
    }
});



$("#staticBackdropBloodRequest").on('show.bs.modal', function(){
    $('#bloodrequestmessage').html('');
    $('#sendrequestsubmit').html('Send Request');
    document.getElementById('sendrequestsubmit').disabled = false;
    document.getElementById('refetch-hospitals').style.display = 'none';
    $("#otp_send_message").html("");
    $("#bloodrequest :input").val('');
    clearInterval(interval);
    $("#button-otp_send").prop('disabled', true);
    $("#button-otp_send").html("Send OTP");
    loadNearestHospitals()
});


$('#refetch-hospitals').on('click', function(){
    loadNearestHospitals();
});

function userCurrentLocationSuccess(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    $.ajax({
        url: "/get-hospitals-by-cord/",
        data:{
            latitude:latitude,
            longitude:longitude,
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            document.getElementById('refetch-hospitals').style.display = 'none';
            if(response.hospitals.length > 0)
            {
                $("#fetching_hospital").html('')
                detect_request_pin = response.pin;
                //load hospitals
                var select_hospitals = document.getElementById("patient_hospital");
                select_hospitals.options.length = 0;
                select_hospitals.innerHTML = `<option label="Select Hospital"></option>`;
                for(var key in response.hospitals)
                {
                    var newOption = new Option(response.hospitals[key]['Name'], response.hospitals[key]['id']);
                    select_hospitals.add(newOption,undefined);
                }
            }
            else
            {
                $("#patient_hospital").html(`<option label="Select Hospital"></option>`);
                $("#fetching_hospital").html("<span style='color:red'>No Nearest Hospital Found!</span>");
                document.getElementById('refetch-hospitals').style.display = 'inline-block';
            }
            
        },
        error :function(response)
        {
            $("#fetching_hospital").html("<span style='color:red'>Hospital Fetch Failed!</span>")
            document.getElementById('refetch-hospitals').style.display = 'inline-block';
            
        },
    });
}
function userCurrentLocationError() {
    $("#fetching_hospital").html("<span style='color:red'>Hospital Fetch Failed!</span>")
    alert('Unable to retrieve your location. Check permissions on your browser. Allow the location permission');
}
function loadNearestHospitals()
{
    document.getElementById('refetch-hospitals').style.display = 'none';
    $("#fetching_hospital").html("<span class='text-muted'>Fetching Nearest Hospitals......</span>")

    if(!navigator.geolocation) {
        $("#fetching_hospital").html("<span style='color:red'>Hospital Fetch Failed!</span>")
        alert('Geolocation is not supported by your browser');
    }
    else {
        var options = {
            enableHighAccuracy: true,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(userCurrentLocationSuccess, userCurrentLocationError, options);
    }
}


//When display will scroll execute the function
window.onscroll = function(){scrollFunction()};

function scrollFunction()
{
    //When display scroll down to 1200px then show the top down button
    if(document.documentElement.scrollTop > 1200)
    {
        $("#scrolltopbtn").css('transform', 'translateY(0)');
    }
    else
    {
        $("#scrolltopbtn").css('transform', 'translateY(1000%)');
    }
}

$('#scrolltopbtn').on('click', topFunction);
function topFunction()
{
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


var eventSource;
var countNotification =  function() {
    if(log.length != 0)
    {        
        var uri = `/events/live-notification/`;

        // var lastNotificationEventId = $("#last-notification-event-id").val();
        // lastNotificationEventId = lastNotificationEventId.split(":")
        // lastNotificationEventId = `${lastNotificationEventId[0]}:${lastNotificationEventId[1]-1}`
        
        eventSource =  new ReconnectingEventSource(uri);
        eventSource.addEventListener('message', function (event) {
            var eventData = JSON.parse(event.data)
            var totalChats = eventData['total_chat'];
            var totalBooks = eventData['total_book'];
            var chat_changed = eventData['chat_changed'];
            var book_changed = eventData['book_changed'];

            if(chat_changed == '1')
            {
                if(totalChats != '0')
                {
                    document.getElementById('mychatscount').style.display = 'inline-block'
                    $('#mychatscount').html(`${totalChats} New`);
                }
                else (totalChats == '0')
                {
                    document.getElementById('mychatscount').style.display = 'none'
                }
            }
            if(book_changed == '1')
            {
                if(totalBooks != '0')
                {
                    document.getElementById('mybookscount').style.display = 'inline-block'
                    $('#mybookscount').html(totalBooks);
                }
                else if(totalBooks == '0')
                {
                    document.getElementById('mybookscount').style.display = 'none'
                }
            }
            
        }, false);
    }
    return true;
}
if(log.length != 0)
{
    $(document).ready(function(){
        countNotification();
    });
}


$(document).on('focus', ".datetime-placeholder", function(event){
    $(this).attr('type', 'date');
});
$(document).on('focusout', ".datetime-placeholder", function(event){
    placeholder = $(this).attr('placeholder');
    if($(this).val() == '' && placeholder != undefined){
        $(this).attr('type', 'text');
    }
});



$(document).on('keyup', 'input:not([type="file"])', whitespace_validation);
$(document).on('keyup', 'textarea', whitespace_validation);
function whitespace_validation(){
    inputValue = String($(this).val());
    inputValue = inputValue.replace(/ +/g, " "); // remove any number of space occurrences with a single space
    inputValue = inputValue.replace(/\n+/g, "\n"); // remove any number of new line occurrences with a single new line
    $(this).val(inputValue);
}

$(document).on('change', 'input:not([type="file"])', leading_trailing_whitespace_validation);
$(document).on('change', 'textarea', leading_trailing_whitespace_validation);
function leading_trailing_whitespace_validation(){
    inputValue = String($(this).val());
    inputValue = inputValue.trim() // Remove leading and trailing whitespace and new lines
    $(this).val(inputValue);
}

$(document).on('keyup', 'input[type=tel]', contact_validation);
$(document).on('keyup', 'input[inputmode=tel]', contact_validation);
function contact_validation(){
    inputValue = String($(this).val());
    inputValue = inputValue.replace(/[^0-9^ ^.^+^(^)^*^#^-]/g, "")
    $(this).val(inputValue)
}

$(document).on('keyup', 'input[inputmode=numeric]', only_numeric);
function only_numeric(){
    inputValue = String($(this).val());
    inputValue = inputValue.replace(/[^0-9]/g, "")
    $(this).val(inputValue)
}

$(document).on('keyup', 'input[data-validation=basic_name_validation]', basic_name_validation);
function basic_name_validation(){
    let name = $(this).val()
    name = name.replace(/[^a-z^A-Z^ ^.^(^)]/g, "").replace(/\.+/g, ".")
    name = name.replace(/^\./g, "").replace(/^\)/g, "") // remove dot and open bracket at begaining position
    $(this).val(name)
}
$(document).on('change', 'input[data-validation=basic_name_validation]', function(){
    let name = $(this).val()
    name = name.replace(/[.] {0,}/g, ". ").replace(/\.$/g, "").replace(/\($/g, "")
    $(this).val(name)
});


$(document).on('keyup', 'input[data-validation=office_name_validation]', office_name_validation);
function office_name_validation(){
    let name = $(this).val()
    name = name.replace(/[^a-z^A-Z^ ^.^-^:^,^&^(^)^`^']/g, "").replace(/\.+/g, ".")
    name = name.replace(/^\./g, "").replace(/^\-/g, "").replace(/^\:/g, "").replace(/^\,/g, "").replace(/^\&/g, "").replace(/^\)/g, "").replace(/^\`/g, "").replace(/^\'/g, "")
    $(this).val(name)
}
$(document).on('change', 'input[data-validation=office_name_validation]', function(){
    let name = $(this).val()
    name = name.replace(/[.] {0,}/g, ". ").replace(/\.$/g, "").replace(/\-$/g, "").replace(/\:$/g, "").replace(/\,$/g, "").replace(/\&$/g, "").replace(/\($/g, "")
    $(this).val(name)
});


var timeZoneOffsetValue = new Date().getTimezoneOffset();
$('#timezonevalue').val(timeZoneOffsetValue);
document.cookie=`TimeZoneOffset=${timeZoneOffsetValue}; samesite=lax; secure;`;


// Initialize the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/Service-Worker.js').then(registration => {
        console.log('SW registration succeeded:', registration);
        navigator.serviceWorker.ready
          .then(function (registration) {
            console.log('SW is active:', registration.active);
          });
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
