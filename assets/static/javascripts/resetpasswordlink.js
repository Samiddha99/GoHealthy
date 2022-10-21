var latitude = undefined;
var longitude = undefined;
var locationPermission = undefined;

function showLocationRequireMessage(){
    alert("We will store your geographic location in the server to prevent unauthorized request.\nSo you have to allow location permission.");
}

$(document).ready(function(){
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
        locationPermission = result.state;
        if (result.state != 'granted') {
            showLocationRequireMessage()
        }
    });
})

function nearBySearchSuccess(position) {
    latitude  = position.coords.latitude;
    longitude = position.coords.longitude;
}
function nearBySearchError() {
    alert('Unable to retrieve your location. Check permissions on your browser. Allow the location permission');
}
var options = {
    enableHighAccuracy: true,
    maximumAge: 0
};
navigator.geolocation.getCurrentPosition(nearBySearchSuccess, nearBySearchError, options);

navigator.permissions.query({name:'geolocation'}).then(function(result) {
    result.onchange = function() {
        locationPermission = result.state;
        if (result.state != 'granted'){
            showLocationRequireMessage()
        }
    }
});



var is_reset_password_correct = "0";
$("#reset-password1").on('keyup', PasswordValidationResetPassword);
function PasswordValidationResetPassword()
{
    document.getElementById("passwordcheck").innerHTML = "";
    document.getElementById("changebtn").disabled = true;
    var password = $('#reset-password1').val();
    if(password.length != 0)
    {
        $.ajax({
            type:'POST',
            url: "/check-password/",
            data: {
                password: password,
                username: $('#username_for_reset').val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                if(response.password_error == 'No Error')
                {
                    $('#reset-password1').removeClass('is-invalid');
                    $('#reset-password1').addClass('is-valid');
                    $('.reset-password_validation').removeClass('far fa-dot-circle');
                    $('.reset-password_validation').addClass('far fa-check-circle');
                    is_reset_password_correct = "1";
                    document.getElementById('reset-password2').disabled = false;
                }
                else
                {
                    is_reset_password_correct = "0";
                    $('#reset-password1').removeClass('is-valid');
                    $('#reset-password1').addClass('is-invalid');
                    document.getElementById("changebtn").disabled = true;
                    document.getElementById('reset-password2').disabled = true;
                    $('.reset-password_validation').removeClass('far fa-dot-circle');
                    $('.reset-password_validation').addClass('far fa-check-circle');
                    for(i=0; i<response.password_error.length; i++){
                        $(`.reset-password_validation_${response.password_error[i]['error_code']}`).removeClass('far fa-check-circle');
                        $(`.reset-password_validation_${response.password_error[i]['error_code']}`).addClass('far fa-dot-circle');
                    }
                }
            },
        });
    }
    else
    {
        is_reset_password_correct = "0";
        document.getElementById("changebtn").disabled = true;
        $('#reset-password1').removeClass('is-valid');
        $('#reset-password1').addClass('is-invalid');

        $('.reset-password_validation').removeClass('far fa-check-circle');
        $('.reset-password_validation').addClass('far fa-dot-circle');
    }
}

$("#reset-password1").on('keyup', resetpasswordmatch);
$("#reset-password2").on('keyup', resetpasswordmatch);
function resetpasswordmatch()
{
    password1 = $('#reset-password1').val();
    password2 = $('#reset-password2').val();

    document.getElementById('sucmessage').innerHTML = "";
    document.getElementById("passwordcheck").innerHTML = "";
    if(password1 == '' || password2 == '')
    {
        document.getElementById('passwordcheck').innerHTML = ""
        $('#reset-password2').removeClass('is-invalid');
        $('#reset-password2').removeClass('is-valid');
        document.getElementById("changebtn").disabled = true;
    }
    else if(password1 == password2)
    {
        document.getElementById('passwordcheck').innerHTML = "<b style='color:green'>New Password and Confirm Password matched!</b>"
        $('#reset-password2').addClass('is-valid');
        $('#reset-password2').removeClass('is-invalid');
        if(is_reset_password_correct == "1")
        {
            document.getElementById("changebtn").disabled = false;
        }
    }
    else if(password1 != password2)
    {
        document.getElementById('passwordcheck').innerHTML = "<b style='color:red'>New Password and Confirm Password didn't match!</b>"
        $('#reset-password2').removeClass('is-valid');
        $('#reset-password2').addClass('is-invalid');
        document.getElementById("changebtn").disabled = true;
    }
}



$('#resetPasswordForm').on('submit', function(event){
    event.preventDefault();
    if(locationPermission == "granted"){
        if(is_reset_password_correct == '1')
        {
            document.getElementById("sucmessage").innerHTML = ""
            document.getElementById("changebtn").innerHTML = "<span<i class='far fa-circle-notch fa-spin'></i></span>";
            $.ajax(
            {
                type:'POST',
                url: $(this).attr('action'),
                data:{
                    password1:$('#reset-password1').val(),
                    password2:$('#reset-password2').val(),
                    latitude: latitude,
                    longitude: longitude,
                    locationPermission: locationPermission,
                    csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
                },
                dataType: 'json',
                cache: false,
                success:function(response)
                {
                    document.getElementById("changebtn").innerHTML = "Change";
                    document.getElementById("sucmessage").innerHTML = ""
                    if(response.password_error == "No Error")
                    {
                        alert('Password Reset Successful. Login with your New Password');
                        location.replace(response.login_url)
                    }
                    else
                    {
                        for(i=0; i<response.password_error.length; i++){
                            $(`.reset-password_validation_${response.password_error[i]['error_code']}`).removeClass('far fa-check-circle');
                            $(`.reset-password_validation_${response.password_error[i]['error_code']}`).addClass('far fa-dot-circle');
                        }
                        document.getElementById("passwordcheck").innerHTML = "<b class='text-danger'>Your entered password didn't follow the rules.</b>";
                    }
                },
                error: function(response)
                {
                    document.getElementById("changebtn").innerHTML = "Change";
                    if(response.status == 403){
                        $("#sucmessage").html(`<div class="text-danger">You can't reset password using VPN or Proxy or Tor or Relay.</div>`);
                    }
                    else{
                        document.getElementById("sucmessage").innerHTML = "<b class='text-danger'>Failed to Reset Password!</b>"
                    }
                },
            });
            
        }
    }
    else{
        $("#sucmessage").html(`<div class="text-danger">Location permission not allowed.<br>Allow location to reset password.</div>`);
    }
});
