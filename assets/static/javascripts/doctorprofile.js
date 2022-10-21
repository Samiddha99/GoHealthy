var modalTarget;
var isEligible;

$("#openDonorUpgrade").on('click', openBloodEligibility);
function openBloodEligibility(){
    $('input[name="eligibiltyCheck"]').prop('checked', false)
    $('#donorEligibilityModal').modal('show');
    $("#eligibilityMessage").html("");
    $("#donorEligibilityBtn").prop('disabled', true);
    modalTarget = $(this).attr('data-target');
}

$('input[name="eligibiltyCheck"]').on('change', function(){
    $("#eligibilityMessage").html("");
    $('#donorEligibilityBtn').prop('disabled', false);
    isEligible = $('input[name="eligibiltyCheck"]:checked').val();
});
$('#donorEligibilityBtn').on('click', function(){
    if(isEligible == '0'){
        $('#donorEligibilityModal').modal('hide');
    }
    else{
        $('#donorEligibilityModal').modal('hide');
        $(modalTarget).modal('show');
    }
});



$('#donorupgradeform').on('submit', function(e) {
    e.preventDefault();
    document.getElementById("upgrademessage-donor").innerHTML = "<p style='color:green'>Upgrading..</p>"
    var group = document.getElementById('showgroup').getAttribute('data-value');
    $("#donorupgradeform :input").prop("disabled", true);
    $.ajax(
    {
        type:'POST',
        url: $(this).attr('action'),
        data:{
            upgradeto: 'Blood Donor',
            blood: group,
            dob: $('#dob').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            document.getElementById("upgrademessage-donor").innerHTML = "";
            if (response.error == '0')
            {
                alert(response.message)
                location.replace("/my-profile/")
            }
            $("#donorupgradeform :input").prop("disabled", false);
        },
        error: function(response)
        {
            document.getElementById("upgrademessage-donor").innerHTML = "<strong style='color:red'>Failed! Try Again</strong>";
            $("#donorupgradeform :input").prop("disabled", false);
        },
    });
});

$('#picShow').on('change', function(){
    $.ajax({
        type:'POST',
        url: "/display-pic/",
        data: {
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success: function(data)
        {  
            var checkbox = $(this);
            checkbox.prop('checked', !checkbox.prop('checked'));
        },
    });
});


$("#addressform").on('submit', function(event){
    event.preventDefault();
    let theForm = new FormData(this);
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    theForm.append('action', 'AddressUpdate');
    $("#addressUpgradeBtn").prop("disabled", true);
    $("#addressUpgradeBtn").html('Updating');
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
            $('#data_address').attr('data-value', response.address);
            $('#data_pin').attr('data-value', response.pin);
            $('#data_state').attr('data-value', response.state);
            $('#data_district').attr('data-value', response.district);
            $('#data_city').attr('data-value', response.city);
            $('#data_subdivision').attr('data-value', response.subdivision);

            $('#data_address').text(response.address);
            $('#data_pin').text(response.pin);
            $('#data_state').text(response.state);
            $('#data_district').text(response.district);
            $('#data_city').text(response.city);
            $('#data_subdivision').text(response.subdivision);

            $('#address').val(response.address);
            $('#pin').val(response.pin);
            $('#state').val(response.state);
            $('#district').val(response.district);
            $('#city').val(response.city);
            $('#subdivision').val(response.subdivision);
            $("#addressUpgradeBtn").html('Update');
            AddressShow();
        },
    });   
});


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
                initializeImageCroper({image_src:e.target.result, aspect_ratio:1 / 1, image_input:'#picture', afterCropFunction:afterCropFunction,})
            }
            reader.readAsDataURL(fileUpload.files[0]);
            $(this).val('')
        }
    }
})
function uploadImage(){
    form = document.getElementById('photo');
    let theForm = new FormData(form);
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    theForm.append('action', 'image');
    $(".btn-upload").prop('disabled', true);
    imageUploadButton = document.getElementById('image-upload-button');
    dotMovingAnimation(imageUploadButton, 8);
    $.ajax(
    {
        type:'POST',
        url: $("#photo").attr('action'),
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
                        }
                        reader.readAsDataURL(fileUpload.files[0]);
                    }
                }
            }
            else if(response.success == '0'){
                document.getElementById('imageError').innerHTML = `<p style='color:red'>${response.message}</p>`;
            }
            dotMovingAnimation(imageUploadButton, 0);
            imageUploadButton.innerHTML = "Change Profile Picture";
        },
        error:function(){
            $(".btn-upload").prop('disabled', false);
            document.getElementById('imageError').innerHTML = `<p style='color:red'>Sorry! Some Error Ocurred</p>`
            dotMovingAnimation(imageUploadButton, 0);
            imageUploadButton.innerHTML = "Change Profile Picture";
        }
    });
}



$("#address").on('keyup', checkAddressChange);$("#address").on('keyup', checkAddressChange);
$("#pin").on('keyup', checkAddressChange);
$("#city").on('keyup', checkAddressChange);
$("#subdivision").on('keyup', checkAddressChange);
$("#state").on('change', checkAddressChange);
$("#district").on('change', checkAddressChange);
function checkAddressChange()
{
    var address = document.getElementById('data_address').getAttribute('data-value');
    var pin = document.getElementById('data_pin').getAttribute('data-value');
    var state = document.getElementById('data_state').getAttribute('data-value');
    var district = document.getElementById('data_district').getAttribute('data-value');
    var city = document.getElementById('data_city').getAttribute('data-value');
    var subdivision = document.getElementById('data_subdivision').getAttribute('data-value');

    var input_address = $('#address').val();
    var input_pin = $('#pin').val();
    var input_state = $('#state').val();
    var input_district = $('#district').val();
    var input_city = $('#city').val();
    var input_subdivision = $('#subdivision').val();

    if(address != input_address || pin != input_pin || state != input_state || district != input_district || city != input_city || subdivision != input_subdivision)
    {
        document.getElementById('addressUpgradeBtn').disabled = false;
    }
    else
    {
        document.getElementById('addressUpgradeBtn').disabled = true;
    }
}


$("#detectLocationBtn").on('click', detectLocation);
function detectLocation() {

    function success(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;
        var select_dist = document.getElementById("district");
        select_dist.options.length = 0;
        $('#city').val('');
        $('#subdivision').val('');
        $('#state').val('');
        $('#pin').val('');
        $('#city').prop('disabled', true);
        $('#pin').prop('disabled', true);
        $('#subdivision').prop('disabled', true);
        $('#state').prop('disabled', true);
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
                    $('#city').prop('disabled', false);
                    $('#pin').prop('disabled', false);
                    $('#subdivision').prop('disabled', false);
                    $('#state').prop('disabled', false);

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
                console.log('ok');
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


$("#state").on('change', loadDistrict);
function loadDistrict()
{
    state = $('#state').val();
    $("#district").html(`<option label="Select District" selected></option>`);
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
                $("#district").append(`<option value="${response.districts[i]}">${response.districts[i]}</option>`);
            }
        },
    });
}

$("#pin").on('keyup', loadAddress);
function loadAddress()
{
    pin = $('#pin').val();
    if(pin.length == 6)
    {
        document.getElementById('addressUpgradeBtn').disabled = true;
        document.getElementById("pinLoading").innerHTML = "<button class='btn btn-primary' type='button' disabled><span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Fetching Address...</button>"
        $("#district").html("");
        $('#city').val('');
        $('#subdivision').val('');
        $('#state').val('');

        $('#city').prop('disabled', true);
        $('#subdivision').prop('disabled', true);
        $('#state').prop('disabled', true);
        $('#district').prop('disabled', true);
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
                document.getElementById('addressUpgradeBtn').disabled = false;
                document.getElementById("pinLoading").innerHTML = ""
                $('#city').val(response.city);
                $('#subdivision').val(response.division);
                $('#state').val(response.state);

                $("#district").html("");
                for(var i in response.districts)
                {
                    $("#district").append(`<option value="${response.districts[i]}">${response.districts[i]}</option>"`);
                }
                if(response.districtFind){
                    $("#district").val(response.district);
                }
                else{
                    $("#district").prepend(`<option label="Select District" selected></option>`);
                }
                $('#city').prop('disabled', false);
                $('#subdivision').prop('disabled', false);
                $('#state').prop('disabled', false);
                $('#district').prop('disabled', false);
            },
            error: function(response)
            {
                document.getElementById('addressUpgradeBtn').disabled = false;
                document.getElementById("pinLoading").innerHTML = ""
                $('#city').prop('disabled', false);
                $('#subdivision').prop('disabled', false);
                $('#state').prop('disabled', false);
                $('#district').prop('disabled', false);
            },
        });
    }
}

$("#addressbtn").on('click', function(){
    let isEdit = $(this).attr('data-edit');
    if(isEdit == 'true'){
        AddressShow();
    }
    else if(isEdit == 'false'){
        AddressEdit();
    }
});
function AddressEdit()
{
    document.getElementById('address_data').style.display = "none"
    document.getElementById('address_edit').style.display = "block"
    var address = document.getElementById('data_address').getAttribute('data-value');
    var pin = document.getElementById('data_pin').getAttribute('data-value');
    var state = document.getElementById('data_state').getAttribute('data-value');
    var district = document.getElementById('data_district').getAttribute('data-value');
    var city = document.getElementById('data_city').getAttribute('data-value');
    var subdivision = document.getElementById('data_subdivision').getAttribute('data-value');
    $('#address').val(address);
    $('#pin').val(pin);
    $('#state').val(state);
    $('#district').val(district);
    $('#city').val(city);
    $('#subdivision').val(subdivision);
    document.getElementById('addressUpgradeBtn').disabled = true;
    $("#addressbtn").attr("data-edit", 'true');
}
function AddressShow()
{
    document.getElementById('address_data').style.display = "block"
    document.getElementById('address_edit').style.display = "none"
    $("#addressbtn").attr("data-edit", 'false');
}




$("#contactbtn").on('click', function(){
    let isEdit = $(this).attr('data-edit');
    if(isEdit == 'true'){
        ContactShow()
    }
    else if(isEdit == 'false'){
        ContactEdit()
    }
});
function ContactEdit()
{
    document.getElementById('contact_data').style.display = "none"
    document.getElementById('contact_edit').style.display = "block"
    document.getElementById('submit_btn').style.display = "none"
    document.getElementById('mobile-otp').style.display = "none"
    document.getElementById('email-otp').style.display = "none"
    var email = document.getElementById('data_email').getAttribute('data-value');
    var contact = document.getElementById('data_contact').getAttribute('data-value');
    $('#email').val(email);
    $('#contact').val(contact);
    $('#contactbtn').attr("data-edit", "true");
    document.getElementById("message").innerHTML = "";
    $('#submit_btn').html('Send OTP');
    $('#submit_btn').attr('data-value', 'Send OTP');
    $('#submit_btn').css('width', '');
    $('#emailotp').val('');
    $('#mobileotp').val('');
}
function ContactShow()
{
    document.getElementById('contact_data').style.display = "block"
    document.getElementById('contact_edit').style.display = "none"
    document.getElementById('submit_btn').style.display = "none"
    document.getElementById('mobile-otp').style.display = "none"
    document.getElementById('email-otp').style.display = "none"
    $('#contactbtn').attr("data-edit", "false");
    document.getElementById("message").innerHTML = "";
    $('#submit_btn').html('Send OTP');
    $('#submit_btn').attr('data-value', 'Send OTP');
    $('#submit_btn').css('width', '');
    $('#emailotp').val('');
    $('#mobileotp').val('');
}

$("#contact").on('keyup', detectchange);
$("#email").on('keyup', detectchange);
function detectchange()
{
    document.getElementById('submit_btn').style.display = "none"
    document.getElementById('mobile-otp').style.display = "none"
    document.getElementById('email-otp').style.display = "none"
    $('#submit_btn').html('Send OTP');
    $('#submit_btn').attr('data-value', 'Send OTP');
    $('#submit_btn').css('width', '');
    $('#emailotp').val('');
    $('#mobileotp').val('');
    document.getElementById("message").innerHTML = ""
    var email = document.getElementById('data_email').getAttribute('data-value');
    var contact = document.getElementById('data_contact').getAttribute('data-value');
    var input_email = $('#email').val()
    var input_contact = $('#contact').val()
    var positionOfAt = input_email.indexOf("@");
    var positionOfDot = input_email.lastIndexOf(".");

    if(input_email.search("@") == -1 || //if '@' is not present
    input_email.search(" ") >= 1 || //if blank space is present
    input_email.search(".") == -1 || //if "." is not present
    positionOfAt < 1 || //if there is no character before "@", at least one character should be present before "@"
    positionOfDot - positionOfAt <= 2 || //between '@' and '.', if there is not at least two character
    input_email.length - positionOfDot <= 2) //if after '.' there is not at least two character)
    {
        $('#email').addClass('is-invalid')
        $('#emailMessage').html('Please enter valid email id!');
        document.getElementById('submit_btn').disabled = true;
    }
    else
    {
        if(email.length > 0 && email != input_email)
        {
            $.ajax({
                type:'POST',
                url: "/email-validation/",
                data: {
                    'email':input_email,
                    csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
                },
                dataType: 'json',
                cache: false,
                success: function(data){
                    if(data.hasError == '1')
                    {
                        $('#email').addClass('is-invalid')
                        $('#emailMessage').html(data.message);
                        document.getElementById('submit_btn').disabled = true;
                    }
                    else
                    {
                        $('#email').removeClass('is-invalid')
                        $('#emailMessage').html('');
                        document.getElementById('submit_btn').disabled = false;
                    }
                }
            });
        }
    }
    if(email != input_email || contact != input_contact)
    {
        document.getElementById('submit_btn').style.display = "block"
    }
    else
    {
        document.getElementById('submit_btn').style.display = "none"
    }
}


$("#mobileotp").on('keyup', showSubmit);
$("#emailotp").on('keyup', showSubmit);
function showSubmit()
{
    var eotp = $('#emailotp').val().length;
    var motp = $('#mobileotp').val().length;
    if (eotp == 6 || motp == 6)
    {
        $('#submit_btn').html('Submit');
        $('#submit_btn').css('width', '100%');
        $('#submit_btn').show();
        $('#submit_btn').prop('disabled', false);
    }
    else
    {
        $('#submit_btn').hide();
    }
}



function otpsend()
{
    document.getElementById("message").innerHTML = ""
    document.getElementById("submit_btn").disabled = true
    $("#submit_btn").html('Sending...')
    $.ajax(
    {
        type:'POST',
        url: "/edit-otp-send/",
        data:{
            contact:$('#contact').val(),
            email:$('#email').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $("#submit_btn").hide();
            if (response.emailChange == "yes")
            {
                document.getElementById('email-otp').style.display = "block"
            }
            if (response.mobileChange == "yes")
            {
                document.getElementById('mobile-otp').style.display = "block"
            }
            $('#submit_btn').attr('data-value', 'Submit');
        },
        error: function(response)
        {
            document.getElementById("submit_btn").disabled = false
            $("#submit_btn").html('Send OTP')
            document.getElementById("message").innerHTML = "<strong style='color:red'>OTP Send Failed!</strong>"
        },
    });
}





$('#contacteditform').on('submit', function(e) {
    e.preventDefault();
    var atr = $('#submit_btn').attr('data-value');
    if(atr == 'Send OTP')
    {
        otpsend();
    }
    else if(atr == 'Submit')
    {
        document.getElementById('submit_btn').disabled = true;
        document.getElementById('submit_btn').innerHTML = "<i class='fad fa-spinner fa-spin'></i> Submit";
        $.ajax(
        {
            type:'POST',
            url: $(this).attr('action'),
            data:{
                contact:$('#contact').val(),
                email:$('#email').val(),
                emailotp:$('#emailotp').val(),
                mobileotp:$('#mobileotp').val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success:function(response)
            {
                document.getElementById('submit_btn').innerHTML = "Submit";
                if (response.error == "0")
                {
                    $('#data_email').html(response.email);
                    $('#data_contact').html(response.contact);
                    $('#data_email').attr('data-value', response.email);
                    $('#data_contact').attr('data-value', response.contact);
                    $('#email').val(response.email)
                    $('#contact').val(response.contact)
                    ContactShow();
                }
                else
                {
                    document.getElementById('submit_btn').disabled = false;
                    document.getElementById("contactmessage").innerHTML = `<strong style="color:red">${response.message}</strong>`
                }
            },
            error: function(response)
            {
                document.getElementById('submit_btn').disabled = false;
                document.getElementById('submit_btn').innerHTML = "Submit";
                document.getElementById("contactmessage").innerHTML = "<strong style='color:red'>Failed!</strong>"
            },
        });
    }
});

$("#groupbtn").on('click', function(){
    let isEdit = $('#groupbtn').attr("data-edit");
    if(isEdit == 'true'){
        hidegroup();
    }
    else if(isEdit == 'false'){
        editgroup();
    }
});
function editgroup()
{
    document.getElementById('editgroupfield').style.display = "block"
    $('#groupbtn').attr("data-edit", 'true');
}
function hidegroup()
{
    document.getElementById('editgroupfield').style.display = "none"
    $('#groupbtn').attr("data-edit", 'false');
}

$('#editgroupform').on('submit', function(e) {
    var group = $('#bloodGroup').val();
    e.preventDefault();
    $.ajax(
    {
        type:'POST',
        url: $(this).attr('action'),
        data:{
            bloodGroup:$('#bloodGroup').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            document.getElementById("showgroup").innerHTML = "Blood Group: "+group+""
            $('#showgroup').attr('data-value', group);
            $('#bloodGroup').val('');
            hidegroup()
        },
        error: function(response)
        {
            document.getElementById("groupmessage").innerHTML = "<strong style='color:red'>Failed!</strong>"
        },
    });
});

$("#dob").on('change', ageCheck);
function ageCheck()
{
    document.getElementById("dobMessage1").innerHTML = ""
    dob = $('#dob').val();
    age = findAge(dob)
    if(age < 18 || age > 65)
    {
        document.getElementById("dobMessage1").innerHTML = `<p style="color:red">You are not eligible to be a blood donor.<br>Your age must be between 18 and 65 years.<br>Your current age is ${age}</p>`
        $("#upgradeBtn").prop('disabled', true);
    }
    else
    {
        document.getElementById("dobMessage1").innerHTML = ""
        $("#upgradeBtn").prop('disabled', false);
    }
}