$("#email").on('change', emailCheck);
function emailCheck()
{
    var email = $('#email').val()
    var positionOfAt = email.indexOf("@");
    var positionOfDot = email.lastIndexOf(".");

    if(email.search("@") == -1 || //if '@' is not present
    email.search(" ") >= 1 || //if blank space is present
    email.search(".") == -1 || //if "." is not present
    positionOfAt < 1 || //if there is no character before "@", at least one character should be present before "@"
    positionOfDot - positionOfAt <= 2 || //between '@' and '.', if there is not at least two character
    email.length - positionOfDot <= 2) //if after '.' there is not at least two character)
    {
        $('#email').addClass('is-invalid')
        $('#emailMessage').html('Please enter valid email id!');
        document.getElementById('submit').disabled = true;
    }
    else
    {
        $('#email').removeClass('is-invalid')
        $('#emailMessage').html('');
        document.getElementById('submit').disabled = false;
    }
}



$("#complainForm").on('submit', function(event) {
    event.preventDefault();
    let theForm = new FormData(this);
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    $("#complainForm :input").prop("disabled", true);
    document.getElementById('submit').disabled = true;
    document.getElementById('submit').innerHTML = "Submitting....";
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
            document.getElementById('submit').innerHTML = "Submit"
            if(response.success == '1')
            {
                $("#complainForm").trigger('reset');
                $("#district").html(`<option label="Select District"></option>`)
                showSingleButtonAlert('Complaint Submitted', `<p>We Successfully Submit Your Complaint!<br>We will contact you if needed.<br>Your Complaint ID: <b id="compId">${response.compId}</b></p>`, 'Okay')
            }
            else if(response.success == '0'){
                showSingleButtonAlert(response.title, response.message, "Okay");
            }
            document.getElementById('submit').disabled = false;
            $("#complainForm :input").prop("disabled", false);
        },
        error:function(response)
        {
            document.getElementById('submit').innerHTML = "Submit";
            document.getElementById('submit').disabled = false;
            $("#complainForm :input").prop("disabled", false);
            showSingleButtonAlert('Error', `Some error occurred during the submission of your complaint.<br>Please try again.`, 'Try Again')
        },
    });
});



$("#subject").on('change', otherSubjectType);
function otherSubjectType()
{
    var val = $('#subject').val();
    if(val == 'Other')
    {
        document.getElementById('otherSubjectId').style.display = 'block';
        $('#otherSubjectId').val('');
    }
    else
    {
        document.getElementById('otherSubjectId').style.display = 'none';
        $('#otherSubjectId').val('N/A');
    }
}


$("#state").on('change', loadDistrict);
function loadDistrict()
{
    state = $('#state').val();
    $("#district").html(`<option label="Select District"></option>`)
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
                $("#district").append(`<option value="${response.districts[i]}">${response.districts[i]}</option>`)
            }
        },
    });
}



window.onbeforeunload = function(e) {
    return "You text is not saved!";
}
