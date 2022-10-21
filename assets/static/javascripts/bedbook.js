
var child_age_max = 10;

$("#disease").on('change', function(){
    val = $(this).val()
    $("#department").val(val)
    $("#icuMessage").html("")
    $("#O2Message").html("")
    $("#ageMessage").html('')
    $("#genderMessage").html("")
    $("#departmentMessage").html("")
    $("#O2Support").css('display', 'none')
    $("[form=bookbed]").prop('disabled', false)
    if(val != ''){
        $.ajax({
            url:"/get-department-beds-availibility/",
            data:{
                'department': val,
                'hospitalId': $("#hospital_id").val(),
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                totalAvailableBed = response.totalAvailableBed
                hasICU = response.hasICU
                hasPICU = response.hasPICU
                NonICU = response.NonICU
                femaleWithO2 = response.femaleWithO2
                femaleNonO2 = response.femaleNonO2
                maleWithO2 = response.maleWithO2
                maleNonO2 = response.maleNonO2
                childWithO2 = response.childWithO2
                childNonO2 = response.childNonO2
                availableO2Beds = response.availableO2Beds
                availableNonO2Beds = response.availableNonO2Beds
                ventilation = response.ventilation
                NonVentilation = response.NonVentilation
                $('input[name="NeedICU"]').prop('disabled', false)
                $('input[name="NeedICU"]').prop('checked', false)
                $('input[name="NeedO2"]').prop('disabled', false)
                $('input[name="NeedO2"]').prop('checked', false)
                if(totalAvailableBed <= 0){
                    $("[form=bookbed]").prop('disabled', true)
                    $("#disease").prop('disabled', false)
                    $("#departmentMessage").html("This departmet has not any available beds at the moment.<br>So now booking is not possible.")
                }
                else{
                    if(hasICU == false && hasPICU == false){
                        $("#ICUyes").prop('disabled', true)
                        $("#ICUno").prop('checked', true)
                        $("#icuMessage").append('No ICU beds are available in the department.<br>')
                    }
                    if((NonICU == false)){
                        $("#ICUno").prop('disabled', true)
                        $("#ICUyes").prop('checked', true)
                        $("#icuMessage").append('No Non-ICU beds are available in the department.')
                    }
                    $('input[name="NeedICU"]').trigger("change")
                    if(availableO2Beds <= 0){
                        $("#O2Yes").prop('disabled', true)
                        $("#O2Message").append('No O2 beds are available in the department.<br>')
                    }
                    else{
                        $("#O2Yes").prop('disabled', false)
                    }
                    if(availableNonO2Beds <= 0){
                        $("#O2No").prop('disabled', true)
                        $("#O2Message").append('No Non-O2 beds are available in the department.')
                    }
                    else{
                        $("#O2No").prop('disabled', false)
                    }
                }
            },
        });
    }
});


$('input[name="NeedICU"]').on('change', needICU);
function needICU()
{
    needICU = $('input[name="NeedICU"]:checked').val();
    $(`input[name="NeedO2"]`).prop('checked', false);
    if(needICU == 'Yes')
    {
        document.getElementById('O2Support').style.display = 'none';
        $(`input[name="NeedO2"]`).prop('required', false);
    }
    else if(needICU == 'No')
    {
        document.getElementById('O2Support').style.display = 'block';
        $(`input[name="NeedO2"]`).prop('required', true);
    }
    return true;
}

$('input[name="NeedICU"]').on('change', inputCheck);
$('input[name="NeedO2"]').on('change', inputCheck);
$("#age").on('change', inputCheck);
$('input[name="gender"]').on('change', inputCheck);

function inputCheck()
{
    var age = $('#age').val();
    var gender = $('input[name="gender"]:checked').val();
    let needICU = $('input[name="NeedICU"]:checked').val();
    let needO2 = $('input[name="NeedO2"]:checked').val();
    $("#ageMessage").html("")
    $("#genderMessage").html("")
    $('input[name="gender"]').prop('disabled', false)
    var genderChecked = $('input[name="gender"]').is(":checked")
    if(age == undefined || age == ''){
        age = ''
    }
    else{
        age = Number(age)
    }

    if(needICU == 'Yes'){
        // if only in ICU
        if(hasICU == true && hasPICU == false)
        {
            document.getElementById('ageMessage').innerHTML = "No available bed in PICU.<br>So patient's age must be minimum 11."
            if(age <= child_age_max && age != ''){
                showSingleButtonAlert("Invalid Age", `Patient's age must be minimum 11.\nYour entered age is: ${age}`, "Okay")
                $('#age').val('');
                document.getElementById("age").focus();
            }
        }
        // if only in PICU
        else if(hasICU == false && hasPICU == true)
        {
            document.getElementById('ageMessage').innerHTML = "Only PICU has available bed.<br>So patient's age must be maximum 10."
            if(age > child_age_max && age != ''){
                showSingleButtonAlert("Invalid Age", `Patient's age must be maximum 10.\nYour entered age is: ${age}`, "Okay")
                $('#age').val('');
                document.getElementById("age").focus();
            }
        }
    }
    else if(needICU == 'No'){
        if(needO2 == 'Yes'){
            // only in O2 child ward
            if(femaleWithO2 <= 0 && maleWithO2 <= 0 && childWithO2 > 0){
                document.getElementById('ageMessage').innerHTML = "Only O2 Child Ward has available bed.<br>So patient's age must be maximum 10."
                if(age > child_age_max && age != ''){
                    showSingleButtonAlert("Invalid Age", `Patient's age must be maximum 10.\nYour entered age is: ${age}`, "Okay")
                    $('#age').val('');
                    document.getElementById("age").focus();
                }
            }
            // no bed in O2 child ward
            else if(childWithO2 <= 0){
                document.getElementById('ageMessage').innerHTML = "No available beds in O2 Child Ward.<br>So patient's age must be minimum 11."
                if(age <= child_age_max && age != ''){
                    showSingleButtonAlert("Invalid Age", `Patient's age must be minimum 11.\nYour entered age is: ${age}`, "Okay")
                    $('#age').val('');
                    document.getElementById("age").focus();
                }
            }
            // only in O2 female ward
            if(femaleWithO2 > 0 && maleWithO2 <= 0){
                document.getElementById('genderMessage').innerHTML = "Only O2 Female Ward has available bed.<br>So patient's gender must be female if age is above 10 years."
                if(gender != "Female" && age > child_age_max && age != '' && genderChecked == true){
                    showSingleButtonAlert("Invalid Gender", `Patient's gender must be female.\nYour entered gender is: ${gender}`, "Okay")
                    $('input[name="gender"]').prop('checked', false)
                }
            }
            // no bed in O2 female ward
            else if(femaleWithO2 <= 0){
                document.getElementById('genderMessage').innerHTML = "No available beds in O2 Female Ward.<br>So patient's gender must not be female if age is above 10 years."
                if(gender == "Female" && age > child_age_max && age != '' && genderChecked == true){
                    showSingleButtonAlert("Invalid Gender", `Patient's gender must not be female.\nYour entered gender is: ${gender}`, "Okay")
                    $('input[name="gender"]').prop('checked', false)
                }
            }
            // only in O2 male ward
            else if(femaleWithO2 <= 0 && maleWithO2 > 0){
                document.getElementById('genderMessage').innerHTML = "Only O2 Male Ward has available bed.<br>So patient's gender must be male if age is above 10 years."
                if(gender != "Male" && age > child_age_max && age != '' && genderChecked == true){
                    showSingleButtonAlert("Invalid Gender", `Patient's gender must be male.\nYour entered gender is: ${gender}`, "Okay")
                    $('input[name="gender"]').prop('checked', false)
                }
            }
            // no bed in O2 male ward
            else if(maleWithO2 <= 0){
                document.getElementById('genderMessage').innerHTML = "No available beds in O2 Male Ward.<br>So patient's gender must not be male if age is above 10 years."
                if(gender == "Male" && age > child_age_max && age != '' && genderChecked == true){
                    showSingleButtonAlert("Invalid Gender", `Patient's gender must not be male.\nYour entered gender is: ${gender}`, "Okay")
                    $('input[name="gender"]').prop('checked', false)
                }
            }
        }
        else if(needO2 == 'No'){
            // only in Non-O2 child ward
            if(femaleNonO2 <= 0 && maleNonO2 <= 0 && childNonO2 > 0){
                document.getElementById('ageMessage').innerHTML = "Only Non-O2 Child Ward has available bed.<br>So patient's age must be maximum 10."
                if(age > child_age_max && age != ''){
                    showSingleButtonAlert("Invalid Age", `Patient's age must be maximum 10.\nYour entered age is: ${age}`, "Okay")
                    $('#age').val('');
                    document.getElementById("age").focus();
                }
            }
            // no bed in Non-O2 child ward
            else if(childNonO2 <= 0){
                document.getElementById('ageMessage').innerHTML = "No available beds in Non-O2 Child Ward.<br>So patient's age must be minimum 11."
                if(age <= child_age_max && age != ''){
                    showSingleButtonAlert("Invalid Age", `Patient's age must be minimum 11.\nYour entered age is: ${age}`, "Okay")
                    $('#age').val('');
                    document.getElementById("age").focus();
                }
            }
            // only in Non-O2 female ward
            if(femaleNonO2 > 0 && maleNonO2 <= 0){
                document.getElementById('genderMessage').innerHTML = "Only Non-O2 Female Ward has available bed.<br>So patient's gender must be female if age is above 10 years.."
                if(gender != "Female" && age > child_age_max && age != '' && genderChecked == true){
                    showSingleButtonAlert("Invalid Gender", `Patient's gender must be female.\nYour entered gender is: ${gender}`, "Okay")
                    $('input[name="gender"]').prop('checked', false)
                }
            }
            // no bed in Non-O2 female ward
            else if(femaleNonO2 <= 0){
                document.getElementById('genderMessage').innerHTML = "No available beds in Non-O2 Female Ward.<br>So patient's gender must not be female if age is above 10 years.."
                if(gender == "Female" && age > child_age_max && age != '' && genderChecked == true){
                    showSingleButtonAlert("Invalid Gender", `Patient's gender must not be female.\nYour entered gender is: ${gender}`, "Okay")
                    $('input[name="gender"]').prop('checked', false)
                }
            }
            // only in Non-O2 male ward
            else if(femaleNonO2 <= 0 && maleNonO2 > 0){
                document.getElementById('genderMessage').innerHTML = "Only Non-O2 Male Ward has available bed.<br>So patient's gender must be male if age is above 10 years.."
                if(gender != "Male" && age > child_age_max && age != '' && genderChecked == true){
                    showSingleButtonAlert("Invalid Gender", `Patient's gender must be male.\nYour entered gender is: ${gender}`, "Okay")
                    $('input[name="gender"]').prop('checked', false)
                }
            }
            // no bed in Non-O2 male ward
            else if(maleNonO2 <= 0){
                document.getElementById('genderMessage').innerHTML = "No available beds in Non-O2 Female Ward.<br>So patient's gender must not be male if age is above 10 years.."
                if(gender == "Male" && age > child_age_max && age != '' && genderChecked == true){
                    showSingleButtonAlert("Invalid Gender", `Patient's gender must not be male.\nYour entered gender is: ${gender}`, "Okay")
                    $('input[name="gender"]').prop('checked', false)
                }
            }
        }
    }
}


$("#state").on('change', loadDistrict)
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




var loadingAddress = '0';
$("#pin").on('keyup', loadAddress);
function loadAddress()
{
    pin = $('#pin').val();
    if(pin.length == 6)
    {
        document.getElementById('submit').disabled = true;
        document.getElementById('pinLoader').style.display = 'block';
        loadingAddress = '1'
        var select = document.getElementById("district");
        select.options.length = 0;
        $('#subdivision').val('');
        $('#state').val('');
        $('#district').val('');
        $('#state').prop('disabled', true)
        $('#subdivision').prop('disabled', true)
        $('#district').prop('disabled', true)
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
                if(submitting == 'no')
                {
                    document.getElementById('submit').disabled = false;
                }
                $('#subdivision').val(response.city);
                $('#state').val(response.state);
                document.getElementById('pinLoader').style.display = 'none';
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
                    $("#district").prepend(`<option label="Select District" selected></option>`);
                }
                $('#state').prop('disabled', false)
                $('#subdivision').prop('disabled', false)
                $('#district').prop('disabled', false)
            },
            error: function(response)
            {
                $('#state').prop('disabled', false)
                $('#subdivision').prop('disabled', false)
                $('#district').prop('disabled', false)
                document.getElementById('submit').disabled = false;
                document.getElementById('pinLoader').style.display = 'none';
            }
        });

    }
}





var leaveNotForSuccessSubmit = true
var submitting = 'no';
$("#bookbed").on('submit', function( event ) {
    event.preventDefault();
    let theForm = new FormData(this)
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    $('.loading-image-background').css('display', 'block');
    document.body.style.overflowY = 'hidden';
    document.getElementById('submit').innerHTML = "Submit"
    document.getElementById('errorSubmit').innerHtml = "";
    
    document.getElementById('submit').innerHTML = "Please Wait...";
    document.getElementById('submit').disabled = true;
    submitting = 'yes'
    $("#bookbed :input").prop("disabled", true);
    document.getElementById('errorSubmit').innerHtml = "";
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
            submitting = 'no';
            if(response.error == '1' || response.error == '2')
            {
                $('.loading-image-background').css('display', 'none');
                document.body.style.overflowY = 'auto';
                document.getElementById('submit').innerHTML = "Submit"
                document.getElementById('submit').disabled = false;
                document.getElementById("errorSubmit").innerHTML = response.message;
                $("#bookbed :input").prop("disabled", false);
            }

            else if(response.error == '0')
            {
                leaveNotForSuccessSubmit = false;
                $("#bookbed").trigger('reset');
                location.href = response.url;
            }
        },
        error:function(response)
        {
            $('.loading-image-background').css('display', 'none');
            document.body.style.overflowY = 'auto';
            submitting = 'no';
            document.getElementById('submit').innerHTML = "Submit";
            document.getElementById('errorSubmit').innerHtml = "<b>Some server error occurred. Please try again!</b>";
            document.getElementById('submit').disabled = false;
            $("#bookbed :input").prop("disabled", false);
        },
    });
});


$("#bookbed").on('reset', function(){
    $('#district').html(`<option label="Select District" selected></option>`);
});


window.onbeforeunload = function(e) {
    if(leaveNotForSuccessSubmit){
        return "You text is not saved!";
    }
}
