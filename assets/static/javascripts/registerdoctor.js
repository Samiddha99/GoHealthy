
$("#div_registration-form").on('click', "#donor", function(){
    $("#dob-field").hide();
    $('#dob').val('');
    $("#dobMessage").html("")
    if(document.getElementById('donor').checked){
        $('input[name="eligibiltyCheck"]').prop('checked', false)
        $('#donorEligibilityModal').modal('show');
        $("#eligibilityMessage").html("");
        $("#donorEligibilityBtn").prop('disabled', true);
    }
});
var isEligible;

$('input[name="eligibiltyCheck"]').on('change', function(){
    $("#eligibilityMessage").html("");
    $('#donorEligibilityBtn').prop('disabled', false);
    isEligible = $('input[name="eligibiltyCheck"]:checked').val();
    if(isEligible == '0'){
        $('#donor').prop('checked', false);
        $("#dob-field").hide();
    }
    else{
        $('#donor').prop('checked', true);
        $("#dob-field").show();
    }
});
$('#donorEligibilityBtn').on('click', function(){
    if(isEligible == '0'){
        $('#donorEligibilityModal').modal('hide');
        document.body.style.overflowY = 'auto';
    }
    else{
        $('#donorEligibilityModal').modal('hide');
        document.body.style.overflowY = 'auto';
    }
});

$("#div_registration-form").on('change', "#dob", ageCheck);
function ageCheck()
{
    document.getElementById("dobMessage").innerHTML = ""
    $("#dobMessage").removeClass('valid-feedback');
    $("#dobMessage").removeClass('invalid-feedback');
    dob = $('#dob').val()
    age = findAge(dob)
    if(age < 18 || age > 65)
    {
        $("#dobMessage").addClass('feedback-invalid');
        document.getElementById("dobMessage").innerHTML = `You are not eligible to be a blood donor.<br>Your age must be between 18 and 65 years.<br>Your current age is ${age}`
        ageOkay = 'no';
    }
    else
    {
        document.getElementById("dobMessage").innerHTML = ""
        ageOkay = 'yes';
    }
}

$("#registrationNo").on('change', registrationNumberCheck);
function registrationNumberCheck(){
    registrationNo = $(this).val();
    $('#registrationNovalidation').removeClass('feedback-valid');
    $('#registrationNovalidation').removeClass('feedback-invalid');
    $('#registrationNo').removeClass('is-valid');
    $('#registrationNo').removeClass('is-invalid');
    $('#registrationNovalidation').html('');
    $.ajax({
        type:'POST',
        url: "/registration-no-check/",
        data: {
            'registrationNo':registrationNo,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success: function(data)
        {
            if(data.exists)
            {
                $('#registrationNo').addClass('is-invalid');
                $("#registrationNovalidation").addClass('feedback-invalid');
                document.getElementById("dobMessage").innerHTML = data.message;
            }
        },
    });
}

$("#div_registration-form").on('change', "#degree", loadSpeciality)
function loadSpeciality()
{
    var select_option = {}
    var select = document.getElementById("speciality");
    select.options.length = 0;
    degree = $('#degree').val()
    $.ajax(
    {
        url: "/get-speciality/",
        data:{
            'degree':degree,
        },
        dataType: 'json',
        cache: false,
        success: function(response)
        { 
            select.options.length = 0;
            for(var i in response.speciality)
            {
                var newOption = new Option(response.speciality[i].Speciality, response.speciality[i].Speciality);
                select.add(newOption,undefined);
            }
            var opt = document.createElement('option');
            opt.label = 'Select Speciality'
            select.insertBefore(opt, select.childNodes[0]);
            opt.selected = true;
        },
    });
}