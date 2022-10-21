
var latitude = undefined;
var longitude = undefined;
var locationPermission = undefined;

$(document).ready(function(){
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
        locationPermission = result.state;
        if (result.state == 'granted') {
            $("#loginLocationAlert").modal('hide')
        }
        else{
            $("#loginLocationAlert").modal('show')
        }
    });
})

function getLocationSuccess(position) {
    latitude  = position.coords.latitude;
    longitude = position.coords.longitude;
}
function getLocationError() {
    alert('Unable to retrieve your location. Check permissions on your browser. Allow the location permission');
}
var options = {
    enableHighAccuracy: true,
    maximumAge: 0
};
navigator.geolocation.getCurrentPosition(getLocationSuccess, getLocationError, options);

navigator.permissions.query({name:'geolocation'}).then(function(result) {
    result.onchange = function() {
        locationPermission = result.state;
        if (result.state == 'granted'){
            $("#loginLocationAlert").modal('hide')
        }
        else{
            $("#loginLocationAlert").modal('show')
        }
    }
});




$('#login').on('submit', function(event){
    event.preventDefault();
    if(locationPermission == "granted"){
        let theForm = new FormData(this);
        let csrf = $('input[name=csrfmiddlewaretoken]').val()
        theForm.append('csrfmiddlewaretoken', csrf);
        theForm.append('locationPermission', locationPermission);
        theForm.append('latitude', latitude);
        theForm.append('longitude', longitude);
        $("#id_loginsubmit").prop('disabled', true);
        $("#login-error-message").html("&nbsp;");
        var loginButton = document.getElementById("id_loginsubmit")
        dotMovingAnimation(loginButton, 4)
        $.ajax(
        {
            type:'POST',
            url: $(this).attr('action'),
            data: theForm,
            contentType: false,
            processData: false,
            dataType: 'json',
            cache: false,
            success:function(response){
                if(response.error == '1'){
                    $("#login-error-message").html(response.message);
                    $("#id_loginsubmit").prop('disabled', false);
                    dotMovingAnimation(loginButton, 0)
                    loginButton.innerHTML = 'Login';
                }
                else if(response.error == '0'){
                    location.replace(response.redirect)
                }
            },
            error:function(response){
                if(response.status == 418){
                    $("#login-error-message").html("You can't login using VPN or Proxy or Tor or Relay.");
                }
                else{
                    $("#login-error-message").html("Error! Try Again");
                }
                $("#id_loginsubmit").prop('disabled', false);
                dotMovingAnimation(loginButton, 0)
                loginButton.innerHTML = 'Login';
            }
        });
    }
    else{
        $("#login-error-message").html("Location permission not allowed.<br>Allow location to login.");
    }
});

function showPassword(){
    var checkBox = document.getElementById('showPassword').checked;
    if(checkBox == true){
        $("#login-password").attr('type', 'text');
    }
    else{
        $("#login-password").attr('type', 'password');
    }

}
$("#showPassword").on('click', showPassword);
