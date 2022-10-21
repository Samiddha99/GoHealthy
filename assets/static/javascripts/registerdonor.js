


$('input[name="eligibiltyCheck"]').prop('checked', false)
$("#eligibilityMessage").html("");
$(document).ready(function(){
    $('#donorEligibilityModal').modal('show');
});

function loadModal(modal){
    try{
        modal.modal('show');
    }
    catch(error){
        console.log('')
    }
}
loadModal($('#donorEligibilityModal'));

var isEligible;
ageOkay = 'yes';

$('input[name="eligibiltyCheck"]').on('change', function(){
    $("#eligibilityMessage").html("");
    $('#donorEligibilityBtn').prop('disabled', false);
    isEligible = $('input[name="eligibiltyCheck"]:checked').val();
    if(isEligible == '0'){
        $("#eligibilityMessage").html("You have to register as a Normal User");
    }
    else{
        $("#eligibilityMessage").html("");
    }
});
$('#donorEligibilityBtn').on('click', function(){
    if(isEligible == '0'){
        $('#donorEligibilityModal').modal('hide');
        document.body.style.overflowY = 'auto';
        setTimeout(function(){ 
            $("#normal-reg-btn").trigger('click');
        }, 500);
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
    age = findAge(age)
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